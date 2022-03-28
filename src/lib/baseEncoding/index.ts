import base from 'base-x';
const ALPHABET_58 =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function base58Decode(msg: string): string {
  if (msg === '') return '';
  const decoded = base(ALPHABET_58).decode(msg);
  return decoded.toString();
}

export function base58Encode(msg: string): string {
  return base(ALPHABET_58).encode(Buffer.from(msg, 'utf-8'));
}
