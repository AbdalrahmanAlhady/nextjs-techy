export interface OrderItem {
  itemId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  status: string;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  shippingCost: number;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
}
