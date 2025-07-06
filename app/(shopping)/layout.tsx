import React from 'react';
import Layout from '@/components/Layout';

interface ShoppingLayoutProps {
  children: React.ReactNode;
}

const ShoppingLayout = ({ children }: ShoppingLayoutProps) => {
  return <Layout>{children}</Layout>;
};

export default ShoppingLayout;
