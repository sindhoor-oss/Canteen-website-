import React from 'react';
import { X, Clock, CheckCircle2, QrCode, UtensilsCrossed } from 'lucide-react';
import { OrderBooking } from '../types';

interface MyTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderBooking[];
  onSelectOrder: (order: OrderBooking) => void;
}

export const MyTokensModal: React.FC<MyTokensModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading">
                My Pre-Booking Tokens
              </h3>
              <p className="text-xs text-slate-400">
                Show your token at counter 7338494643
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Orders list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No active pre-bookings yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Select your favorite snacks and pre-book to get an instant pickup token!
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-orange-600 font-heading">
                      {order.tokenNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {order.status}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900 font-heading">
                    ₹{order.totalAmount}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                  {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/80">
                  <span>Slot: {order.pickupSlot}</span>
                  <span className="font-semibold text-orange-600 group-hover:underline">
                    View Slip & Token →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
