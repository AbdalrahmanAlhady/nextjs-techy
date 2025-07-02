// File: types/index.ts

// Based on packages/db/schema.ts
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number; // in cents
  stock: number;
  image: string | null;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  vendorId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCardProps {
    id: string;
    title: string;
    vendor?: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    imageUrl: string;
    imageAlt?: string;
  }

export interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
}
  
