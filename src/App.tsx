/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  QrCode,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Flame,
  Phone,
  UtensilsCrossed,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { SNACK_ITEMS, INITIAL_CONFIG } from './data/snacks';
import { SnackItem, CartItem, OrderBooking, StoreConfig } from './types';
import { Header } from './components/Header';
import { SnackCard } from './components/SnackCard';
import { CartSummaryBar } from './components/CartSummaryBar';
import { CheckoutDrawer } from './components/CheckoutDrawer';
import { QrPaymentModal } from './components/QrPaymentModal';
import { RazorpayModal } from './components/RazorpayModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { MyTokensModal } from './components/MyTokensModal';
import { StoreAdminModal } from './components/StoreAdminModal';
import { TodaySpecials } from './components/TodaySpecials';
import { BobLogo } from './components/BobLogo';

export default function App() {
  // Config
  const [config, setConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('snackbite_config');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });

  // Cart Quantities state: map itemId -> quantity
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('snackbite_cart');
    return saved ? JSON.parse(saved) : {};
  });

  // Orders / Bookings history
  const [orders, setOrders] = useState<OrderBooking[]>(() => {
    const saved = localStorage.getItem('snackbite_orders');
    return saved
      ? JSON.parse(saved)
      : [
          // Pre-populate with one confirmed sample token so user immediately sees how tokens work
          {
            id: 'ord-init-1',
            tokenNumber: '#SB-7338',
            customerName: 'Rahul S.',
            customerPhone: '7338494643',
            pickupSlot: 'In 10-15 Mins',
            items: [
              { id: 'special-biryani', name: 'Dum Biryani', price: 120, quantity: 1 },
              { id: 'campa-cola', name: 'Campa Cola', price: 10, quantity: 2 },
            ],
            totalAmount: 140,
            paymentMethod: 'razorpay',
            paymentStatus: 'paid',
            transactionId: 'pay_rzp_mock7338',
            paidAt: new Date().toISOString(),
            status: 'preparing',
          },
        ];
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isMyTokensOpen, setIsMyTokensOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeConfirmedOrder, setActiveConfirmedOrder] = useState<OrderBooking | null>(null);

  // Pending checkout customer info
  const [pendingCustomer, setPendingCustomer] = useState<{
    name: string;
    phone: string;
    slot: string;
    note: string;
  }>({
    name: 'Customer',
    phone: '7338494643',
    slot: 'In 10-15 Mins',
    note: '',
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('snackbite_cart', JSON.stringify(cartQuantities));
  }, [cartQuantities]);

  useEffect(() => {
    localStorage.setItem('snackbite_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('snackbite_config', JSON.stringify(config));
  }, [config]);

  // Derived cart items
  const cartItems: CartItem[] = SNACK_ITEMS.filter(
    (item) => (cartQuantities[item.id] || 0) > 0
  ).map((item) => ({
    snack: item,
    quantity: cartQuantities[item.id] || 0,
  }));

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.snack.price * item.quantity,
    0
  );
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + (item.snack.discount || 0) * item.quantity,
    0
  );

  // Today's special items (2 highlighted items with discounts)
  const specialItems = SNACK_ITEMS.filter((item) => item.isTodaySpecial);

  // Cart quantity update handler
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartQuantities((prev) => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[itemId];
      } else {
        next[itemId] = quantity;
      }
      return next;
    });
  };

  const handleClearCart = () => {
    setCartQuantities({});
  };

  // Filter snacks
  const filteredSnacks = SNACK_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handlers for initiating payment flows
  const handleInitiateRazorpay = (customer: {
    name: string;
    phone: string;
    slot: string;
    note: string;
  }) => {
    setPendingCustomer(customer);
    setIsCheckoutOpen(false);
    setIsRazorpayModalOpen(true);
  };

  const handleInitiateQr = (customer: {
    name: string;
    phone: string;
    slot: string;
    note: string;
  }) => {
    setPendingCustomer(customer);
    setIsCheckoutOpen(false);
    setIsQrModalOpen(true);
  };

  // Payment success handler (common for Razorpay & QR)
  const handlePaymentSuccess = (
    transactionId: string,
    method: 'razorpay' | 'upi_qr'
  ) => {
    // Generate order token
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const token = `#SB-${randomNum}`;

    const itemsToOrder = cartItems.length > 0 ? cartItems : [
      {
        snack: SNACK_ITEMS[0],
        quantity: 1,
      },
    ];

    const finalAmount = totalAmount > 0 ? totalAmount : itemsToOrder[0].snack.price;

    const newOrder: OrderBooking = {
      id: `ord-${Date.now()}`,
      tokenNumber: token,
      customerName: pendingCustomer.name || 'Valued Customer',
      customerPhone: pendingCustomer.phone || config.merchantPhone,
      pickupSlot: pendingCustomer.slot || 'In 10-15 Mins',
      specialNote: pendingCustomer.note,
      items: itemsToOrder.map((ci) => ({
        id: ci.snack.id,
        name: ci.snack.name,
        price: ci.snack.price,
        quantity: ci.quantity,
      })),
      totalAmount: finalAmount,
      paymentMethod: method,
      paymentStatus: 'paid',
      transactionId: transactionId,
      paidAt: new Date().toISOString(),
      status: 'confirmed',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartQuantities({});
    setIsRazorpayModalOpen(false);
    setIsQrModalOpen(false);
    setActiveConfirmedOrder(newOrder);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: OrderBooking['status']
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const categories = ['All', 'Meals', 'Beverage', 'Desserts'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-28">
      {/* Top Header */}
      <Header
        cartCount={totalQuantity}
        totalAmount={totalAmount}
        onOpenCart={() => setIsCheckoutOpen(true)}
        onOpenMyOrders={() => setIsMyTokensOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onDirectQrClick={() => setIsQrModalOpen(true)}
        activeOrdersCount={orders.filter((o) => o.status !== 'collected').length}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 space-y-8">
        {/* Hero Section with Pre-Booking instructions */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-orange-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-orange-500/20">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-orange-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left text */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 border border-orange-400/30 text-orange-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Pre-Booking & Counter Fast-Track</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight font-heading leading-tight">
                Pre-Book Your Snacks,{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-amber-300 to-yellow-400">
                  Skip The Wait!
                </span>
              </h2>

              <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
                Order Campa (₹10), Egg Rice (₹60), Biryani (₹120), Coffee (₹15), or Ice Cream (₹5).
                Pay directly to <strong className="text-white">7338494643</strong> via{' '}
                <strong className="text-orange-300">Razorpay</strong> or scan our{' '}
                <strong className="text-amber-300">UPI QR Code</strong> to receive your instant digital pickup token!
              </p>

              {/* 3 Step Guide */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 text-center">
                  <span className="text-orange-400 font-black text-xs block">STEP 1</span>
                  <span className="text-xs font-bold">Pick Snacks</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 text-center">
                  <span className="text-amber-400 font-black text-xs block">STEP 2</span>
                  <span className="text-xs font-bold">Pay to 7338494643</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 text-center">
                  <span className="text-emerald-400 font-black text-xs block">STEP 3</span>
                  <span className="text-xs font-bold">Show Token</span>
                </div>
              </div>
            </div>

            {/* Right Card: Quick QR & Payee Snapshot */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-xs bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-white/20 text-center relative">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-bold flex items-center gap-1 text-orange-600">
                    <BobLogo size={18} /> Baroda Pay QR
                  </span>
                  <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
                    7338494643
                  </span>
                </div>

                <div
                  onClick={() => setIsQrModalOpen(true)}
                  className="group relative p-3 bg-slate-50 hover:bg-orange-50/50 rounded-2xl border border-slate-200 cursor-pointer transition"
                  title="Click to view full UPI QR"
                >
                  <div className="relative w-36 h-36 mx-auto flex items-center justify-center bg-white rounded-xl shadow-inner border border-slate-200">
                    <QrCode className="w-28 h-28 text-slate-800 group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-md p-1 flex items-center justify-center border border-slate-200">
                        <BobLogo size={22} />
                      </div>
                    </div>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-orange-700">
                    <span>Scan to Pay (Any UPI)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-orange-600 hover:bg-orange-700 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Show My QR</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                {cat === 'All' ? 'All Items' : cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Biryani, Campa, Coffee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
            />
          </div>
        </section>

        {/* Today's Specials (Highlights 2 items with automatic discounts) */}
        <TodaySpecials
          specialItems={specialItems}
          cartQuantities={cartQuantities}
          onUpdateQuantity={handleUpdateQuantity}
        />

        {/* Snack Items Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              All Snacks & Fast Pre-Booking
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredSnacks.length} items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSnacks.map((snack) => (
              <SnackCard
                key={snack.id}
                snack={snack}
                quantity={cartQuantities[snack.id] || 0}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </div>
        </section>

        {/* Counter Info Banner */}
        <section className="bg-amber-50/80 rounded-3xl p-5 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Direct Counter & Payment Support: 7338494643
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Have a special custom order or need immediate counter assistance? Call or WhatsApp our kitchen lead directly.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:7338494643"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 shadow-2xs transition"
            >
              Call 7338494643
            </a>
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Show QR</span>
            </button>
          </div>
        </section>
      </main>

      {/* Floating Bottom Cart Bar */}
      <CartSummaryBar
        cartItems={cartItems}
        totalAmount={totalAmount}
        totalQuantity={totalQuantity}
        totalSavings={totalSavings}
        onCheckout={() => setIsCheckoutOpen(true)}
        onDirectQr={() => {
          setIsQrModalOpen(true);
        }}
      />

      {/* Checkout Drawer (Reviews items & allows choosing Razorpay vs QR) */}
      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalAmount={totalAmount}
        totalSavings={totalSavings}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onInitiateRazorpay={handleInitiateRazorpay}
        onInitiateQr={handleInitiateQr}
      />

      {/* Razorpay Payment Modal (Connected to 7338494643) */}
      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        amount={totalAmount > 0 ? totalAmount : 10}
        customerName={pendingCustomer.name}
        customerPhone={pendingCustomer.phone}
        orderSummary={cartItems.map((ci) => `${ci.quantity}x ${ci.snack.name}`).join(', ')}
        merchantPhone={config.merchantPhone}
        customKeyId={config.razorpayKeyId}
        onPaymentSuccess={(payId) => handlePaymentSuccess(payId, 'razorpay')}
      />

      {/* QR Payment Modal (Option: Any others can pay then show my QR) */}
      <QrPaymentModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        amount={totalAmount > 0 ? totalAmount : 10}
        customerName={pendingCustomer.name}
        customerPhone={pendingCustomer.phone}
        orderSummary={cartItems.map((ci) => `${ci.quantity}x ${ci.snack.name}`).join(', ')}
        defaultUpiId={config.merchantUpiId}
        onPaymentSuccess={(txnId) => handlePaymentSuccess(txnId, 'upi_qr')}
      />

      {/* Order Confirmation / Digital Token Slip */}
      <OrderConfirmationModal
        order={activeConfirmedOrder}
        onClose={() => setActiveConfirmedOrder(null)}
        onNewOrder={() => {
          setActiveConfirmedOrder(null);
          setCartQuantities({});
        }}
      />

      {/* My Tokens History Drawer */}
      <MyTokensModal
        isOpen={isMyTokensOpen}
        onClose={() => setIsMyTokensOpen(false)}
        orders={orders}
        onSelectOrder={(ord) => {
          setIsMyTokensOpen(false);
          setActiveConfirmedOrder(ord);
        }}
      />

      {/* Store Admin / Counter Staff Dashboard */}
      <StoreAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        config={config}
        onUpdateConfig={(newCfg) => setConfig((prev) => ({ ...prev, ...newCfg }))}
        onOpenQrPreview={() => {
          setIsAdminOpen(false);
          setIsQrModalOpen(true);
        }}
      />
    </div>
  );
}
