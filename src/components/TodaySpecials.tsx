import React from 'react';
import { Sparkles, Flame, Plus, Minus, Tag, Clock, CheckCircle2, Award } from 'lucide-react';
import { SnackItem } from '../types';
import { playTapSound } from '../utils/audio';

interface TodaySpecialsProps {
  specialItems: SnackItem[];
  cartQuantities: Record<string, number>;
  onUpdateQuantity: (id: string, qty: number) => void;
}

export const TodaySpecials: React.FC<TodaySpecialsProps> = ({
  specialItems,
  cartQuantities,
  onUpdateQuantity,
}) => {
  if (!specialItems || specialItems.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border-2 border-orange-400/40 p-5 sm:p-6 shadow-md mb-8">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-orange-400/15 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30">
            <Flame className="w-6 h-6 stroke-[2.2] animate-bounce-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                Today's Specials
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                <Sparkles className="w-3 h-3" /> Auto Discount
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Chef's hot picks for today! Instant discount applied automatically when added to cart.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-xs border border-orange-200 text-xs font-bold text-orange-900 shadow-2xs self-start sm:self-auto">
          <Tag className="w-3.5 h-3.5 text-orange-600" />
          <span>Save ₹10 on each item today</span>
        </div>
      </div>

      {/* 2 Highlighted Items Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {specialItems.map((item) => {
          const qty = cartQuantities[item.id] || 0;
          const origPrice = item.originalPrice || item.price + 10;
          const savings = (origPrice - item.price) * qty;

          const handleAdd = () => {
            playTapSound();
            onUpdateQuantity(item.id, qty + 1);
          };

          const handleDecrement = () => {
            playTapSound();
            if (qty > 0) {
              onUpdateQuantity(item.id, qty - 1);
            }
          };

          return (
            <div
              key={item.id}
              className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col sm:flex-row gap-4 p-4 shadow-sm hover:shadow-md ${
                qty > 0
                  ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20'
                  : 'border-orange-200/80 hover:border-orange-300'
              }`}
            >
              {/* Special Ribbon Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-orange-600 text-white shadow-sm">
                  <Award className="w-3 h-3" /> Special
                </span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-sm">
                  ₹{item.discount || 10} OFF
                </span>
              </div>

              {/* Thumbnail Image */}
              <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-orange-400" /> {item.prepTime}
                  </span>
                </div>
              </div>

              {/* Item Info & Actions */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.dietType === 'egg'
                          ? 'bg-amber-600'
                          : item.dietType === 'non-veg'
                          ? 'bg-rose-600'
                          : 'bg-emerald-600'
                      }`}
                    />
                    <h4 className="text-base sm:text-lg font-black text-slate-900 font-heading leading-tight">
                      {item.name}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">
                    {item.description}
                  </p>
                </div>

                {/* Price Display with Strikethrough & Savings */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl sm:text-2xl font-black text-orange-600 font-heading">
                        ₹{item.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-semibold">
                        ₹{origPrice}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 block mt-0.5">
                      Auto applied in cart
                    </span>
                  </div>

                  {/* Quantity Stepper / Add button */}
                  <div>
                    {qty === 0 ? (
                      <button
                        onClick={handleAdd}
                        className="py-2 px-3.5 rounded-xl font-bold text-xs bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>ADD SPECIAL</span>
                      </button>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 bg-orange-600 text-white rounded-xl p-0.5 shadow-sm">
                          <button
                            onClick={handleDecrement}
                            className="w-7 h-7 rounded-lg bg-orange-700 hover:bg-orange-800 flex items-center justify-center transition cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                          <span className="w-7 text-center text-xs font-black">
                            {qty}
                          </span>
                          <button
                            onClick={handleAdd}
                            className="w-7 h-7 rounded-lg bg-orange-700 hover:bg-orange-800 flex items-center justify-center transition cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        </div>
                        {savings > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600">
                            Saved ₹{savings}!
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
