
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Eye } from 'lucide-react';

import { Product } from '@/types';
import { addItem } from '@/app/store/cartSlice';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const ProductCard = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    dispatch(addItem(cartItem));
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-[16/9] overflow-hidden bg-secondary">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-bold text-lg text-neutral mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="font-semibold text-lg text-neutral">
              ${(product.price / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="w-full">
              <Link href={`/products/${product.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
            <Button className="w-full" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
