"use client";

import React, { useState } from 'react';
import SimplePagination from '@/components/ui/simple-pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteCategory } from '@/app/actions/admin-categories';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Props {
  categories: Category[];
}

export default function CategoryTable({ categories }: Props) {
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(categories.length / ITEMS_PER_PAGE));
  const paginated = categories.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const result = await deleteCategory(categoryId);
      if (result.success) {
        toast({
          title: "Category deleted",
          description: "The category has been deleted successfully.",
        });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category. It might be linked to existing products.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
    <div className="bg-white rounded-lg border shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Slug</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Link href={`/admin/categories/edit/${category.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>

    <SimplePagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
