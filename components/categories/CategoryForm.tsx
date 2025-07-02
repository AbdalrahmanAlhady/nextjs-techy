"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCategory, updateCategory } from '@/app/actions/admin-categories';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface Props {
  category?: Category;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CategoryForm({ category }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  });

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }

    startTransition(async () => {
      const action = category
        ? updateCategory.bind(null, category.id, formData)
        : createCategory.bind(null, formData);
      
      const result = await action();

      if (result.success) {
        toast({
          title: category ? 'Category Updated' : 'Category Created',
          description: `The category has been ${category ? 'updated' : 'created'} successfully.`,
        });
        router.push('/admin/categories');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg border shadow-md max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (category ? 'Updating...' : 'Creating...') : (category ? 'Update Category' : 'Create Category')}
        </Button>
      </div>
    </form>
  );
}
