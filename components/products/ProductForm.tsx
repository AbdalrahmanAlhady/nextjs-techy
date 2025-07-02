
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { handleAddProduct, handleEditProduct } from '@/app/actions/admin-product-ui';
import { handleAddVendorProduct, handleEditVendorProduct } from '@/app/actions/vendor-product-ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteFileFromUploadcare } from '@/app/actions/uploadcare-actions';
import { UploadClient } from '@uploadcare/upload-client';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Stock must be a non-negative number',
  }),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']),
  categoryId: z.string().optional(),
  vendorId: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Props {
  categories: { id: string; name: string }[];
  vendors?: { id: string; name: string }[];
  vendorId?: string; // for vendor dashboard
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
    categoryId: string | null;
    image: string | null;
    vendorId?: string | null;
  };
}

export default function ProductForm({ initialData, vendorId, categories, vendors }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price?.toString() || '',
      stock: initialData?.stock?.toString() || '',
      status: initialData?.status || 'DRAFT',
      vendorId: initialData?.vendorId || vendorId || undefined,
      categoryId: initialData?.categoryId || undefined,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setImageUrl(initialData?.image || null);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    let uploadedFileUuid: string | null = null;
    let finalImageUrl = initialData?.image || null;

    try {
      // Step 1: Upload the file if a new one is selected
      if (selectedFile) {
        const uploadClient = new UploadClient({ publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY! });
        const uploadedFile = await uploadClient.uploadFile(selectedFile);
        uploadedFileUuid = uploadedFile.uuid;
        finalImageUrl = uploadedFile.cdnUrl;
      }

      // Step 2: Prepare product data
      let finalVendorId: string | undefined | null;

      if (vendors) { // Admin path
        if (initialData) { // Admin Edit
          finalVendorId = initialData.vendorId;
        } else { // Admin Add
          finalVendorId = data.vendorId;
        }
      } else { // Vendor path
        finalVendorId = vendorId;
      }

      if (!finalVendorId) {
        toast({ title: 'Vendor required', description: 'Please select a vendor.' });
        // If we uploaded a file, we need to delete it since we're stopping early
        if (uploadedFileUuid) await deleteFileFromUploadcare(uploadedFileUuid);
        return;
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        status: data.status,
        categoryId: data.categoryId || undefined,
        image: finalImageUrl || undefined,
        vendorId: finalVendorId,
      };

      // Step 3: Create or update the product
      const isVendor = !!vendorId && !vendors;
      const result = initialData
        ? isVendor
          ? await handleEditVendorProduct(initialData.id, productData)
          : await handleEditProduct(initialData.id, productData)
        : isVendor
          ? await handleAddVendorProduct(productData)
          : await handleAddProduct(productData);

      // Step 4: Handle the result
      if (result.success) {
        toast({
          title: initialData ? 'Product updated' : 'Product created',
          description: initialData ? 'The product has been updated successfully.' : 'The product has been created successfully.',
        });
        router.push(isVendor ? '/vendor/products' : '/admin/products');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      // If an upload happened during this failed submission, delete the file
      if (uploadedFileUuid) {
        await deleteFileFromUploadcare(uploadedFileUuid);
      }
      toast({
        title: 'Error',
        description: `Failed to ${initialData ? 'update' : 'create'} product. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Product description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="99.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Show dropdown only on ADD page (when initialData is not present) and when vendors are passed */}
                {vendors && vendors.length > 0 && !initialData && (
                  <FormField
                    control={form.control}
                    name="vendorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a vendor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vendors.map((vendor) => (
                              <SelectItem key={vendor.id} value={vendor.id}>
                                {vendor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {/* On EDIT page, just display the vendor name */}
                {initialData && vendors && (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <p className="text-sm pt-2 font-medium">
                      {vendors.find(v => v.id === initialData.vendorId)?.name || 'Unknown'}
                    </p>
                  </FormItem>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
                <CardDescription>Upload the product image here</CardDescription>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={handleFileChange} />
                </FormControl>
                {imageUrl && (
                  <div className="mt-4">
                    <p>Image Preview:</p>
                    <img src={imageUrl} alt="Product Preview" style={{ maxWidth: '200px', height: 'auto' }} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Saving...'
              : initialData
              ? 'Save changes'
              : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
