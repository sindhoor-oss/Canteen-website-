import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { generateUpiQrDataUrl, buildUpiPayUrl } from '../utils/qrHelper';
import { BobLogo } from './BobLogo';
import { playSuccessChime, playTapSound } from '../utils/audio';

interface QrPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  customerName?: string;
  customerPhone?: string;
  orderSummary?: string;
  onPaymentSuccess: (transactionId: string) => void;
  defaultUpiId?: string;
}

export const QrPaymentModal: React.FC<QrPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  customerName = 'Customer',
  customerPhone = '',
  orderSummary = 'Snacks Pre-booking',
  onPaymentSuccess,
  defaultUpiId = '7338494643@barodampay',
}) => {
  const [upiId, setUpiId] = useState(defaultUpiId);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [customAmount, setCustomAmount] = useState(amount || 10);

  const activeAmount = amount > 0 ? amount : customAmount;

  // Generate QR on mount or when amount / upiId changes
  useEffect(() => {
    let isMounted = true;
    async function loadQr() {
      const url = await generateUpiQrDataUrl({
        upiId: upiId,
        name: 'Snacks Pre-Booking',
        amount: activeAmount,
        note: `Snacks ${orderSummary.slice(0, 20)}`,
        transactionRef: `SB${Date.now().toString().slice(-6)}`,
      });
      if (isMounted) {
        setQrDataUrl(url);
      }
    }
    loadQr();
    return () => {
      isMounted = false;
    };
  }, [upiId, activeAmount, orderSummary]);

  if (!isOpen) return null;

  const upiDeepLink = buildUpiPayUrl({
    upiId: upiId,
    name: 'Snacks Pre-Booking (7338494643)',
    amount: activeAmount,
    note: 'Snacks PreBooking',
  });

  const handleCopyUpi = () => {
    playTapSound();
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    playTapSound();
    setIsVerifying(true);
    setErrorMsg('');

    // Simulate instant UPI transaction verification
    setTimeout(() => {
      setIsVerifying(false);
      playSuccessChime();
      const generatedTxn = utrNumber.trim()
        ? `UTR-${utrNumber.trim()}`
        : `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      onPaymentSuccess(generatedTxn);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-500 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight font-heading">
                Pay via UPI QR Code
              </h3>
              <p className="text-[11px] text-orange-100 flex items-center gap-1">
                <span>Receiver:</span>
                <strong className="tracking-wide">7338494643</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-center">
          {/* Amount Badge */}
          <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-3 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-800">
                Total Pre-Booking Amount
              </span>
              <p className="text-2xl font-black text-slate-900 font-heading">
                ₹{activeAmount}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Instant Verification
              </span>
              <p className="text-[11px] mt-0.5">Pre-Order Token Ready</p>
            </div>
          </div>

          {/* QR Code Card with Bank of Baroda Center Icon */}
          <div className="relative inline-block mx-auto p-4 bg-white rounded-3xl shadow-md border-2 border-slate-100">
            {qrDataUrl ? (
              <div className="relative w-56 h-56 sm:w-60 sm:h-60 mx-auto">
                <img
                  src={qrDataUrl}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain rounded-xl"
                />
                {/* Center Badge: Bank of Baroda Logo (Matches uploaded QR image) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-200/80 p-1 flex items-center justify-center">
                    <BobLogo size={36} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-slate-50 rounded-xl">
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            )}

            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
              <BobLogo size={18} />
              <span>Baroda Pay / UPI Supported</span>
            </div>
          </div>

          {/* UPI ID Copy Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left">
            <div className="text-xs text-slate-500 font-medium mb-1">
              Registered UPI Phone & VPA:
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="font-mono text-sm font-bold text-slate-900">
                  {upiId}
                </span>
                <p className="text-[11px] text-slate-500">Phone: 7338494643</p>
              </div>
              <button
                onClick={handleCopyUpi}
                className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1 shadow-2xs transition active:scale-95 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy UPI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Direct Pay Deep-Links */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Or tap below to open in your UPI App:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={upiDeepLink}
                className="p-2 rounded-xl border border-slate-200 hover:border-orange-400 bg-white hover:bg-orange-50/50 flex flex-col items-center justify-center text-center transition cursor-pointer text-xs font-bold text-slate-800"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1 font-black text-xs">
                  G
                </div>
                <span>Google Pay</span>
              </a>
              <a
                href={upiDeepLink}
                className="p-2 rounded-xl border border-slate-200 hover:border-orange-400 bg-white hover:bg-orange-50/50 flex flex-col items-center justify-center text-center transition cursor-pointer text-xs font-bold text-slate-800"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1 font-black text-xs">
                  Pe
                </div>
                <span>PhonePe</span>
              </a>
              <a
                href={upiDeepLink}
                className="p-2 rounded-xl border border-slate-200 hover:border-orange-400 bg-white hover:bg-orange-50/50 flex flex-col items-center justify-center text-center transition cursor-pointer text-xs font-bold text-slate-800"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-1 font-black text-xs">
                  Pay
                </div>
                <span>Paytm / BHIM</span>
              </a>
            </div>
          </div>

          {/* Verification / UTR Section */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-left">
              <label htmlFor="utr-number-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Enter UPI Ref / UTR No. (Optional):
              </label>
              <input
                id="utr-number-input"
                type="text"
                placeholder="e.g. 427819384910 or leave blank for instant"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              />
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-2xl font-black text-sm bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>I HAVE PAID ₹{activeAmount}</span>
                </>
              )}
            </button>
          </div>

          {/* Custom UPI Settings Toggle for Store Owner */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-[11px] text-slate-500 hover:text-orange-600 font-medium underline cursor-pointer"
            >
              {showConfig ? 'Hide UPI Settings' : 'Change UPI ID / Handle (Optional)'}
            </button>

            {showConfig && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
                <div>
                  <label htmlFor="upi-vpa-handle-input" className="block font-semibold text-slate-700 mb-0.5">
                    UPI VPA Handle:
                  </label>
                  <input
                    id="upi-vpa-handle-input"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-xs"
                    placeholder="7338494643@barodampay"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUpiId('7338494643@barodampay')}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] hover:bg-orange-50"
                  >
                    Baroda Pay
                  </button>
                  <button
                    onClick={() => setUpiId('7338494643@upi')}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] hover:bg-orange-50"
                  >
                    @upi
                  </button>
                  <button
                    onClick={() => setUpiId('7338494643@paytm')}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] hover:bg-orange-50"
                  >
                    @paytm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
