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

            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold text-neutral">${(product.price / 100).toFixed(2)}</h2>
            </div>

            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-accent font-medium">In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-danger rounded-full"></div>
                  <span className="text-danger font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="font-medium text-neutral">Quantity:</span>
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 text-neutral-muted hover:bg-secondary transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-1 font-medium text-neutral">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 text-neutral-muted hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>
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
