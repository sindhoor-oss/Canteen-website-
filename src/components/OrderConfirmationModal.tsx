import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Copy,
  Check,
  UtensilsCrossed,
  Sparkles,
  Phone,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderBooking } from '../types';
import { playSuccessChime, playTapSound } from '../utils/audio';

interface OrderConfirmationModalProps {
  order: OrderBooking | null;
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onNewOrder,
}) => {
  const [copied, setCopied] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(900); // 15 mins default

  useEffect(() => {
    if (order) {
      playSuccessChime();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f59e0b', '#10b981', '#3b82f6'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [order]);

  // Live countdown timer for pickup
  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  if (!order) return null;

  const minutes = Math.floor(countdownSeconds / 60);
  const seconds = countdownSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleCopyToken = () => {
    playTapSound();
    navigator.clipboard.writeText(order.tokenNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    playTapSound();
    window.print();
  };

  const handleShareWhatsApp = () => {
    playTapSound();
    const itemsText = order.items
      .map((it) => `${it.quantity}x ${it.name} (₹${it.price * it.quantity})`)
      .join(', ');
    const message = encodeURIComponent(
      `🎉 Pre-Booking Token Confirmed!\nToken: ${order.tokenNumber}\nCustomer: ${order.customerName}\nItems: ${itemsText}\nTotal: ₹${order.totalAmount} (Paid via ${order.paymentMethod.toUpperCase()})\nPickup Slot: ${order.pickupSlot}\nShow this at counter!`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] flex flex-col">
        {/* Header Celebration Card */}
        <div className="bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 text-center shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center shadow-lg mb-2">
            <CheckCircle2 className="w-8 h-8 text-white stroke-[2.5]" />
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/25 text-white mb-1">
            <Sparkles className="w-3 h-3" /> Pre-Booking Confirmed!
          </span>
          <h2 className="text-xl font-black font-heading">
            Payment Received & Order Sent
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Linked to Counter Phone: <strong className="text-white">7338494643</strong>
          </p>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Prominent Token Display */}
          <div className="bg-orange-50 border-2 border-dashed border-orange-300 rounded-3xl p-4 text-center">
            <span className="text-[11px] font-black uppercase tracking-widest text-orange-700">
              YOUR PRE-BOOKING TOKEN
            </span>
            <div className="text-4xl font-black text-orange-600 font-heading my-1 tracking-tight">
              {order.tokenNumber}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-slate-500">Show this token at the counter</span>
              <button
                onClick={handleCopyToken}
                className="text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-md border border-orange-200 shadow-2xs"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Kitchen Live Status & Timer */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-orange-300 font-bold uppercase tracking-wider block">
                  Kitchen Status
                </span>
                <span className="text-sm font-bold text-white">
                  Preparing Your Fresh Snacks
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Est. Ready in</span>
              <span className="text-lg font-mono font-black text-emerald-400">
                {timeFormatted}
              </span>
            </div>
          </div>

          {/* Pickup Slot & Customer Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5 font-medium">Pickup Slot</span>
              <strong className="text-slate-800">{order.pickupSlot}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5 font-medium">Customer Phone</span>
              <strong className="text-slate-800">{order.customerPhone}</strong>
            </div>
          </div>

          {/* Itemized Order Slip */}
          <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2 bg-slate-50/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Ordered Items
            </span>
            <div className="divide-y divide-slate-100 text-xs">
              {order.items.map((item) => (
                <div key={item.id} className="py-1.5 flex justify-between items-center">
                  <span className="text-slate-800 font-medium">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-bold text-slate-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black text-slate-900 text-sm">
              <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
              <span className="text-base text-emerald-700 font-heading">
                ₹{order.totalAmount}
              </span>
            </div>

            {order.transactionId && (
              <p className="text-[10px] text-slate-400 font-mono pt-1">
                Ref ID: {order.transactionId}
              </p>
            )}
          </div>

          {/* Actions: Print & WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Share Token</span>
            </button>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0 space-y-2">
          <button
            onClick={() => {
              playTapSound();
              onNewOrder();
            }}
            className="w-full py-3 px-4 rounded-2xl font-black text-sm bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
          >
            <span>Pre-Book More Snacks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
