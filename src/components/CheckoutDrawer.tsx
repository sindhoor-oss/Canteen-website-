import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Clock,
  User,
  Phone,
  MessageSquare,
  ShieldCheck,
  QrCode,
  CreditCard,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { CartItem } from '../types';
import { playTapSound } from '../utils/audio';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  totalSavings?: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onClearCart: () => void;
  onInitiateRazorpay: (customer: { name: string; phone: string; slot: string; note: string }) => void;
  onInitiateQr: (customer: { name: string; phone: string; slot: string; note: string }) => void;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  totalSavings = 0,
  onUpdateQuantity,
  onClearCart,
  onInitiateRazorpay,
  onInitiateQr,
}) => {
  const [customerName, setCustomerName] = useState('Anand');
  const [customerPhone, setCustomerPhone] = useState('9876543210');
  const [pickupSlot, setPickupSlot] = useState('In 10-15 Mins');
  const [specialNote, setSpecialNote] = useState('');
  const [phoneError, setPhoneError] = useState('');

  if (!isOpen) return null;

  const validateCustomer = () => {
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number for order pickup');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleRazorpayClick = () => {
    playTapSound();
    if (!validateCustomer()) return;
    onInitiateRazorpay({
      name: customerName || 'Valued Customer',
      phone: customerPhone,
      slot: pickupSlot,
      note: specialNote,
    });
  };

  const handleQrClick = () => {
    playTapSound();
    if (!validateCustomer()) return;
    onInitiateQr({
      name: customerName || 'Valued Customer',
      phone: customerPhone,
      slot: pickupSlot,
      note: specialNote,
    });
  };

  const slots = [
    'In 10-15 Mins',
    'In 25-30 Mins',
    'Lunch Slot (1:00 PM)',
    'Evening Slot (5:30 PM)',
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">
                Pre-Booking Order
              </h2>
              <p className="text-xs text-slate-400">
                {cartItems.length} snack item(s) selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Cart Items List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Selected Snacks
              </h3>
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Your pre-booking tray is empty</p>
                <p className="text-xs text-slate-500 mt-1">
                  Add Campa, Egg Rice, Biryani, Coffee or Ice Cream to proceed!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cartItems.map(({ snack, quantity }) => (
                  <div
                    key={snack.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/90 gap-3"
                  >
                    <img
                      src={snack.image}
                      alt={snack.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            snack.dietType === 'veg'
                              ? 'bg-emerald-600'
                              : snack.dietType === 'egg'
                              ? 'bg-amber-600'
                              : 'bg-rose-600'
                          }`}
                        />
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {snack.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500">
                        ₹{snack.price} × {quantity}
                      </p>
                      <span className="text-xs font-black text-orange-600 font-heading">
                        ₹{snack.price * quantity}
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(snack.id, quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(snack.id, quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Details Form */}
          {cartItems.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Customer & Pickup Info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="customer-name-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="customer-name-input"
                      type="text"
                      placeholder="e.g. Anand Kumar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="customer-phone-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Phone (for Token SMS) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="customer-phone-input"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        setPhoneError('');
                      }}
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                        phoneError ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{phoneError}</p>
                  )}
                </div>
              </div>

              {/* Pickup Time Slot */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  Select Pickup Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        playTapSound();
                        setPickupSlot(slot);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition cursor-pointer ${
                        pickupSlot === slot
                          ? 'border-orange-500 bg-orange-50 text-orange-950 ring-1 ring-orange-500'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Note */}
              <div>
                <label htmlFor="special-instructions-input" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  Special Note (Optional)
                </label>
                <input
                  id="special-instructions-input"
                  type="text"
                  placeholder="e.g. Chilled Campa, Extra spoon, Make biryani spicy"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Bill Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                {totalSavings > 0 ? (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>Items Subtotal</span>
                      <span className="line-through text-slate-400">₹{totalAmount + totalSavings}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Today's Specials Discount
                      </span>
                      <span>-₹{totalSavings}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Pre-Booking Fee</span>
                  <span className="text-emerald-700 font-bold">FREE (₹0)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black text-slate-900 text-sm">
                  <div>
                    <span>Grand Total to Pay</span>
                    {totalSavings > 0 && (
                      <p className="text-[10px] text-emerald-600 font-semibold">
                        Auto ₹{totalSavings} discount applied!
                      </p>
                    )}
                  </div>
                  <span className="text-xl text-orange-600 font-heading">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Dual Payment Action Buttons (Razorpay & Show QR) */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200 shrink-0 space-y-3 shadow-lg">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Choose Payment Method to Pre-Book
              </span>
            </div>

            {/* BUTTON 1: Razorpay Option (Connected to 7338494643) */}
            <button
              onClick={handleRazorpayClick}
              className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center justify-between transition active:scale-98 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/40 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">Buy with Razorpay</div>
                  <div className="text-[10px] text-blue-200 font-medium">
                    To Phone: 7338494643
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-heading text-base">
                <span>₹{totalAmount}</span>
                <span className="text-blue-200 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>

            {/* BUTTON 2: Show My QR Option (Direct Baroda Pay / UPI QR) */}
            <button
              onClick={handleQrClick}
              className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-linear-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25 flex items-center justify-between transition active:scale-98 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">Show My UPI QR Code</div>
                  <div className="text-[10px] text-orange-100 font-medium">
                    Any others can scan & pay
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-heading text-base">
                <span>₹{totalAmount}</span>
                <span className="text-amber-200 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Token Generated Upon Payment to 7338494643</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
