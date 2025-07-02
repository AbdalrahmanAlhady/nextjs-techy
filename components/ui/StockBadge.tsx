import React from 'react';

interface StockBadgeProps {
  stock: number;
}

export default function StockBadge({ stock }: StockBadgeProps) {
  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-50 border-red-100';
    if (stock < 10) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
    return 'text-green-600 bg-green-50 border-green-100';
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return `Low Stock (${stock})`;
    return `In Stock (${stock})`;
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStockColor(stock)}`}>
      {getStockText(stock)}
    </span>
  );
}
