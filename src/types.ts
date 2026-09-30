export interface SnackItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  isTodaySpecial?: boolean;
  specialHighlight?: string;
  description: string;
  category: 'Beverage' | 'Meals' | 'Desserts';
  dietType: 'veg' | 'non-veg' | 'egg';
  image: string;
  popular?: boolean;
  prepTime: string;
  calories?: string;
}

export interface CartItem {
  snack: SnackItem;
  quantity: number;
}

export interface OrderBooking {
  id: string;
  tokenNumber: string;
  customerName: string;
  customerPhone: string;
  pickupSlot: string;
  specialNote?: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  paymentMethod: 'razorpay' | 'upi_qr';
  paymentStatus: 'paid' | 'pending';
  transactionId?: string;
  paidAt: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'collected';
}

export interface StoreConfig {
  merchantPhone: string;
  merchantUpiId: string;
  merchantName: string;
  razorpayKeyId: string;
  qrType: 'generated' | 'custom';
  customQrUrl?: string;
}
