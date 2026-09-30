import QRCode from 'qrcode';

export interface GenerateQrOptions {
  upiId: string;
  name: string;
  amount: number;
  note?: string;
  transactionRef?: string;
}

/**
 * Builds the official NPCI UPI Deep Link URL for Indian UPI payments.
 * Spec: upi://pay?pa={vpa}&pn={payee}&am={amount}&cu=INR&tn={note}&tr={ref}
 */
export function buildUpiPayUrl(options: GenerateQrOptions): string {
  const params = new URLSearchParams();
  params.set('pa', options.upiId.trim());
  params.set('pn', options.name.trim());
  if (options.amount > 0) {
    params.set('am', options.amount.toFixed(2));
  }
  params.set('cu', 'INR');
  if (options.note) {
    params.set('tn', options.note.trim());
  }
  if (options.transactionRef) {
    params.set('tr', options.transactionRef.trim());
  }
  return `upi://pay?${params.toString()}`;
}

/**
 * Generates high-resolution Data URL for the QR code
 */
export async function generateUpiQrDataUrl(options: GenerateQrOptions): Promise<string> {
  const upiUrl = buildUpiPayUrl(options);
  try {
    return await QRCode.toDataURL(upiUrl, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'H', // High error correction level allows center logo overlay
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return '';
  }
}
