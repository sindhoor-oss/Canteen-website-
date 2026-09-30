import React from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { CartItem } from '../types';

interface CartSummaryBarProps {
  cartItems: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  totalSavings?: number;
  onCheckout: () => void;
  onDirectQr: () => void;
}

export const CartSummaryBar: React.FC<CartSummaryBarProps> = ({
  cartItems,
  totalAmount,
  totalQuantity,
  totalSavings = 0,
  onCheckout,
  onDirectQr,
}) => {
  if (totalQuantity === 0) return null;

  return (
    <aside
      aria-label="Current booking cart"
      className="fixed bottom-0 left-0 right-0 z-20 p-3 sm:p-4 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl transition-all duration-300"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left item details summary */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-xs font-black flex items-center justify-center border-2 border-white">
                {totalQuantity}
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Total:</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  ₹{totalAmount}
                </span>
                {totalSavings > 0 && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Saved ₹{totalSavings}!
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[220px] sm:max-w-xs">
                {cartItems.map((ci) => `${ci.quantity}x ${ci.snack.name}`).join(', ')}
              </p>
            </div>
          </div>

          <div className="hidden xs:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fast Counter Pickup</span>
          </div>
        </div>

        {/* Right action buttons: Pay with Razorpay / Book OR Pay via QR */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onDirectQr}
            className="flex-1 sm:flex-initial px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300/80 flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
            title="Pay exact amount using UPI QR"
          >
            <QrCode className="w-4 h-4 text-orange-600" />
            <span>Pay QR</span>
          </button>

          <button
            onClick={onCheckout}
            className="flex-2 sm:flex-initial px-5 py-3 rounded-2xl font-black text-sm bg-linear-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer group"
          >
            <span>Proceed to Buy</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </aside>
  );
};
