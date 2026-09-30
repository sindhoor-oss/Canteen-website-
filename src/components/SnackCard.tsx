import React from 'react';
import { Plus, Minus, Flame, Clock, Sparkles } from 'lucide-react';
import { SnackItem } from '../types';
import { playTapSound } from '../utils/audio';

interface SnackCardProps {
  snack: SnackItem;
  quantity: number;
  onUpdateQuantity: (id: string, qty: number) => void;
}

export const SnackCard: React.FC<SnackCardProps> = ({
  snack,
  quantity,
  onUpdateQuantity,
}) => {
  const handleAdd = () => {
    playTapSound();
    onUpdateQuantity(snack.id, quantity + 1);
  };

  const handleDecrement = () => {
    playTapSound();
    if (quantity > 0) {
      onUpdateQuantity(snack.id, quantity - 1);
    }
  };

  const handleQuickAdd = (addQty: number) => {
    playTapSound();
    onUpdateQuantity(snack.id, quantity + addQty);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
        quantity > 0
          ? 'border-orange-500/70 shadow-lg shadow-orange-500/10 ring-2 ring-orange-500/20'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Image & Badge Section */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={snack.image}
          alt={snack.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Dietary Tag & Popular Tag & Today's Special Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {/* Veg / Non-Veg / Egg indicator */}
          <div
            className={`flex items-center justify-center w-5 h-5 rounded-md bg-white/95 backdrop-blur-xs shadow-xs border ${
              snack.dietType === 'veg'
                ? 'border-emerald-600'
                : snack.dietType === 'egg'
                ? 'border-amber-600'
                : 'border-rose-600'
            }`}
            title={snack.dietType.toUpperCase()}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                snack.dietType === 'veg'
                  ? 'bg-emerald-600'
                  : snack.dietType === 'egg'
                  ? 'bg-amber-600'
                  : 'bg-rose-600'
              }`}
            />
          </div>

          {snack.isTodaySpecial && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-linear-to-r from-orange-600 to-amber-600 text-white shadow-xs">
              <Sparkles className="w-3 h-3" /> Special ₹{snack.discount || 10} OFF
            </span>
          )}

          {snack.popular && !snack.isTodaySpecial && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
              <Sparkles className="w-3 h-3" /> Popular
            </span>
          )}
        </div>

        {/* Prep Time Tag */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-black/60 text-white backdrop-blur-md">
            <Clock className="w-3 h-3 text-orange-400" /> {snack.prepTime}
          </span>
        </div>

        {/* Floating Price Tag on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
              {snack.category}
            </span>
            <h3 className="text-xl font-black text-white leading-tight font-heading drop-shadow-xs">
              {snack.name}
            </h3>
          </div>
          <div className="text-right">
            <div className="inline-flex items-baseline gap-1 px-2.5 py-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/20 text-white shadow-sm">
              <span className="text-xs font-semibold text-amber-400">₹</span>
              <span className="text-xl font-black">{snack.price}</span>
              {snack.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-semibold ml-0.5">
                  ₹{snack.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description & Selection Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {snack.description}
          </p>

          {snack.calories && (
            <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" /> {snack.calories}
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">Pre-Booking Ready</span>
            </div>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="pt-2 border-t border-slate-100">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 hover:border-orange-600 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>ADD TO PRE-BOOK</span>
              <span className="text-xs opacity-75 font-normal ml-auto">₹{snack.price}</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-orange-500 rounded-xl p-1 text-white shadow-sm">
                <button
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 rounded-lg bg-orange-600 hover:bg-orange-700 flex items-center justify-center transition active:scale-95 cursor-pointer"
                >
                  <Minus className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="flex flex-col items-center px-2">
                  <span className="text-lg font-black leading-none">{quantity}</span>
                  <span className="text-[10px] font-semibold text-orange-100">
                    ₹{snack.price * quantity}
                  </span>
                </div>

                <button
                  onClick={handleAdd}
                  aria-label="Increase quantity"
                  className="w-9 h-9 rounded-lg bg-orange-600 hover:bg-orange-700 flex items-center justify-center transition active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Quick Add Presets for prebooking multiple items */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500">
                <span>Quick add:</span>
                <button
                  onClick={() => handleQuickAdd(1)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  +1
                </button>
                <button
                  onClick={() => handleQuickAdd(2)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  +2
                </button>
                <button
                  onClick={() => handleQuickAdd(5)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  +5
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
