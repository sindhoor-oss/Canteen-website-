import React, { useState } from 'react';
import {
  X,
  Store,
  CheckCircle2,
  Clock,
  Phone,
  Flame,
  TrendingUp,
  Settings,
  QrCode,
  CreditCard,
  RefreshCw,
  BellRing,
} from 'lucide-react';
import { OrderBooking, StoreConfig } from '../types';
import { BobLogo } from './BobLogo';

interface StoreAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderBooking[];
  onUpdateOrderStatus: (orderId: string, status: OrderBooking['status']) => void;
  config: StoreConfig;
  onUpdateConfig: (newConfig: Partial<StoreConfig>) => void;
  onOpenQrPreview: () => void;
}

export const StoreAdminModal: React.FC<StoreAdminModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  config,
  onUpdateConfig,
  onOpenQrPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics' | 'settings'>('orders');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [phoneInput, setPhoneInput] = useState(config.merchantPhone);
  const [upiInput, setUpiInput] = useState(config.merchantUpiId);
  const [nameInput, setNameInput] = useState(config.merchantName);
  const [savedMsg, setSavedMsg] = useState(false);

  if (!isOpen) return null;

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Item counts sold
  const itemCounts: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((it) => {
      itemCounts[it.name] = (itemCounts[it.name] || 0) + it.quantity;
    });
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      merchantPhone: phoneInput,
      merchantUpiId: upiInput,
      merchantName: nameInput,
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-heading">
                  Kitchen Counter & Staff Dashboard
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  7338494643
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage incoming snack pre-bookings in real-time
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'orders'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Live Bookings ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Daily Summary (₹{totalRevenue})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'settings'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Payment Config (Phone / QR)
          </button>
        </div>

        {/* Tab 1: Live Bookings */}
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {/* Filter pills */}
            <div className="flex gap-1.5 flex-wrap">
              {['all', 'confirmed', 'preparing', 'ready', 'collected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition cursor-pointer ${
                    filterStatus === st
                      ? 'bg-orange-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No bookings in this category</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-orange-600 font-heading">
                            {ord.tokenNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              ord.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'preparing'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : ord.status === 'ready'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          {ord.customerName} • 📞 {ord.customerPhone}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900 font-heading">
                          ₹{ord.totalAmount}
                        </span>
                        <p className="text-[10px] font-semibold text-emerald-600">
                          {ord.paymentMethod.toUpperCase()} (PAID)
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                      {ord.items.map((it) => (
                        <div key={it.id} className="flex justify-between text-slate-700">
                          <span>
                            <strong>{it.quantity}x</strong> {it.name}
                          </span>
                          <span>₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                      {ord.specialNote && (
                        <p className="text-[11px] text-amber-700 pt-1 border-t border-slate-200">
                          Note: "{ord.specialNote}"
                        </p>
                      )}
                    </div>

                    {/* Status update controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">
                        Slot: {ord.pickupSlot}
                      </span>
                      <div className="flex gap-1.5">
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => onUpdateOrderStatus(ord.id, 'preparing')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-2xs"
                          >
                            Mark Preparing 🔥
                          </button>
                        )}
                        {ord.status === 'preparing' && (
                          <button
                            onClick={() => onUpdateOrderStatus(ord.id, 'ready')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-2xs"
                          >
                            Mark Ready 🛎️
                          </button>
                        )}
                        {ord.status === 'ready' && (
                          <button
                            onClick={() => onUpdateOrderStatus(ord.id, 'collected')}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-black text-white font-bold text-xs cursor-pointer"
                          >
                            Mark Collected ✅
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Analytics & Item Breakdown */}
        {activeTab === 'analytics' && (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                <span className="text-xs font-semibold text-orange-800 block">Total Revenue</span>
                <span className="text-2xl font-black text-orange-950 font-heading">
                  ₹{totalRevenue}
                </span>
                <span className="text-[10px] text-orange-700 block mt-1">Direct to 7338494643</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-600 block">Total Pre-Orders</span>
                <span className="text-2xl font-black text-slate-900 font-heading">
                  {orders.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Processed</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Items Pre-Booked Breakdown
              </h4>
              <div className="space-y-2 text-xs">
                {Object.entries(itemCounts).map(([name, count]) => (
                  <div key={name} className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-800">{name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                      {count} sold
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Payment Config */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Connected Merchant Phone: 7338494643</strong>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  All Razorpay payments and Bank of Baroda UPI QR scans are routed to this registered number.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recipient Merchant Phone
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  UPI VPA Handle
                </label>
                <input
                  type="text"
                  value={upiInput}
                  onChange={(e) => setUpiInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Store / Counter Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl font-bold text-xs bg-orange-600 hover:bg-orange-700 text-white cursor-pointer shadow-md shadow-orange-600/20"
              >
                Save Payment Settings
              </button>
              <button
                type="button"
                onClick={onOpenQrPreview}
                className="py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-orange-600" />
                <span>Test QR Code</span>
              </button>
            </div>

            {savedMsg && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
