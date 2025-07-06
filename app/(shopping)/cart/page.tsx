'use client';

import React from 'react';
import { FLAT_RATE_SHIPPING_COST } from '../../../config/shipping';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag,  } from 'lucide-react';

import { RootState } from '@/app/store/store';
import { removeItem, updateQuantity, clearCart } from '@/app/store/cartSlice';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity >= 1) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = FLAT_RATE_SHIPPING_COST;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${(item.price / 100).toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">${((item.price * item.quantity) / 100).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                          <X className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium">{shipping === 0 ? 'Free' : `$${(shipping / 100).toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
              <Button size="lg" className="w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <div className="flex justify-between mt-4">
                <Button variant="outline" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="destructive" onClick={handleClearCart}>
                  Clear Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
