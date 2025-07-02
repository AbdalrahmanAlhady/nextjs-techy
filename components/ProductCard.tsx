
import React from 'react';
import Link from 'next/link';
import StarRating from './StarRating';
import { ProductCardProps } from '@/types';

const ProductCard = ({
  id,
  title,
  vendor,
  price,
  originalPrice,
  rating,
  imageUrl,
  imageAlt
}: ProductCardProps) => {
  return (
    <Link href={`/products/${id}`}>
      <div className="bg-white rounded-lg border border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="aspect-[16/9] overflow-hidden bg-secondary">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-4">
          {vendor && <p className="text-sm text-neutral-muted mb-1">{vendor}</p>}
          <h3 className="font-bold text-lg text-neutral mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {rating !== undefined && (
            <div className="mb-3">
              <StarRating rating={rating} size="sm" showRating />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg text-neutral">
              ${(price / 100).toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-neutral-muted line-through">
                ${(originalPrice / 100).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
