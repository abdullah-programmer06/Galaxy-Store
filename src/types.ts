export type Route = 'home' | 'games' | 'software' | 'support' | 'checkout' | 'uid-topup' | 'weekly-monthly' | 'weekly-lite' | 'level-up-pass' | 'product' | 'admin' | 'order-history' | 'signin' | 'signup' | 'profile';
export interface Product {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category?: string;
  delivery?: string;
  stock?: string;
  refund?: string;
  tags?: string[];
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  user: string;
  email: string;
  phone?: string;
  items: CartItem[];
  amount: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  paymentMethod?: string;
  senderNumber?: string;
  transactionId?: string;
}

