'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '@/app/store/cartSlice';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import StarRating from './StarRating';
import StarRatingInput from './StarRatingInput';
import type { InferSelectModel } from 'drizzle-orm';
import { products } from '@/packages/db/schema';
import { Button } from './ui/button';

type Product = InferSelectModel<typeof products>;

interface ProductDetailClientProps {
  product: Product;
}


import { useTransition } from 'react';

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const [purchaseStatus, setPurchaseStatus] = useState<'loading' | 'eligible' | 'ineligible'>('loading');


  useEffect(() => {
    let isMounted = true;
    async function checkPurchase() {
      setPurchaseStatus('loading');
      try {
        const { hasPurchasedProduct } = await import('@/app/actions/buyer-has-purchased-product');
        const result = await hasPurchasedProduct(product.id);
        if (isMounted) {
          setPurchaseStatus(result.hasPurchased ? 'eligible' : 'ineligible');
        }
      } catch {
        if (isMounted) setPurchaseStatus('ineligible');
      }
    }
    checkPurchase();
    return () => { isMounted = false; };
  }, [product.id]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    };
    dispatch(addItem(cartItem));
    toast({
      title: "Added to cart",
      description: `${product.name} (x${quantity}) has been added to your cart.`,
    });
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'reviews', label: 'Reviews' },
  ];

    // State for reviews and average rating
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  async function fetchReviews() {
    const { getProductReviews } = await import('@/app/actions/get-reviews');
    const res = await getProductReviews(product.id);
    setReviews(res.reviews);
    setAverageRating(res.average);
    setReviewCount(res.count);
  }

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  // No review form here; only display reviews.


  return (
    <div className="bg-secondary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-neutral mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={averageRating} size="md" />
              <span className="text-neutral-muted">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-neutral">${(product.price / 100).toFixed(2)}</h2>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Save for later
                  </Button>
                  <Button 
                    className="w-full" 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || quantity > product.stock}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </div>

              {/* Stock status */}
              {product.stock <= 5 && product.stock > 0 && (
                <div className="mt-2 text-sm text-yellow-600">
                  Low stock warning: Only {product.stock} left in stock
                </div>
              )}
              {product.stock === 0 && (
                <div className="mt-2 text-sm text-red-600">
                  This product is currently out of stock
                </div>
              )}

              {/* Quantity selector */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm text-neutral-muted">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 text-neutral-muted hover:bg-secondary transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-1 font-medium text-neutral">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 text-neutral-muted hover:bg-secondary transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stock limit warning */}
              {quantity > product.stock && (
                <div className="mt-2 text-sm text-red-600">
                  Maximum available: {product.stock}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-border">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-neutral-muted hover:text-neutral'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-neutral text-base leading-relaxed">{product.description}</p>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="max-w-xl mx-auto">
                {/* Reviews List */}
                <div className="mt-10">
                  <h4 className="font-semibold mb-4">Reviews</h4>
                  {reviews.length === 0 ? (
                    <div className="text-neutral-muted">No reviews yet.</div>
                  ) : (
                    <ul className="space-y-6">
                      {reviews.map(r => (
                        <li key={r.id} className="border-b border-border pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <StarRating rating={r.rating} size="sm" />
                            <span className="text-xs text-neutral-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="text-sm font-medium text-neutral mb-1">{r.userName || 'Anonymous'}</div>
                          <div className="text-neutral text-sm">{r.comment}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
