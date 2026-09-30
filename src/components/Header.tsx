import React from 'react';
import { UtensilsCrossed, Phone, QrCode, ShoppingBag, Clock, Sparkles } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  totalAmount: number;
  onOpenCart: () => void;
  onOpenMyOrders: () => void;
  onOpenAdmin: () => void;
  onDirectQrClick: () => void;
  activeOrdersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  totalAmount,
  onOpenCart,
  onOpenMyOrders,
  onOpenAdmin,
  onDirectQrClick,
  activeOrdersCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-linear-to-r from-amber-600 via-orange-500 to-rose-600 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
            <span>⚡ Kitchen Fast-Track: Pre-Book now to skip the counter queue!</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1 opacity-90">
              <Phone className="w-3 h-3" /> Payee Contact: <strong className="tracking-wide">7338494643</strong>
            </span>
            <button
              onClick={onDirectQrClick}
              className="underline hover:text-amber-100 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <QrCode className="w-3 h-3" /> Show UPI QR
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-heading">
                Snack<span className="text-orange-600">Bite</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800">
                <Sparkles className="w-3 h-3 text-orange-600" /> Pre-Order
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>Fresh & Hot Snacks</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-medium">Counter Ready in 10m</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Pay / Show QR Button */}
          <button
            onClick={onDirectQrClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 hover:border-orange-300 bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 transition cursor-pointer"
            title="Scan & Pay directly via QR Code"
          >
            <QrCode className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">Pay via QR</span>
            <span className="sm:hidden">QR</span>
          </button>

          {/* Active Orders / Tokens */}
          <button
            onClick={onOpenMyOrders}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            title="View Pre-Booking Tokens"
          >
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">My Tokens</span>
            {activeOrdersCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                {activeOrdersCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/25 transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden xs:inline">Cart</span>
            {cartCount > 0 && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                <span>₹{totalAmount}</span>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] bg-white text-orange-700 font-extrabold ml-0.5">
                  {cartCount}
                </span>
              </>
            )}
          </button>

          {/* Store Staff Counter / Admin link */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Kitchen Counter / Store Staff View"
          >
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-600">
              Staff
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
