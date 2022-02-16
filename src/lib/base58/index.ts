import base from 'base-x';
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const NULL_REGEX = /\0[\s\S]*$/g;

export function base58Decode(msg: string): string {
  if (msg === '') return '';
  const decoded = base(ALPHABET).decode(msg);
  const decodedString = decoded.slice(2, decoded.length - 4).toString('utf-8');
  return decodedString.replace(NULL_REGEX, '');
}

export function base58Encode(msg: string): string {
  return base(ALPHABET).encode(Buffer.from(msg, 'utf-8'));
}
