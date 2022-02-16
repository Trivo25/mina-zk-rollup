import crypto from 'crypto';

export function sha256(msg: string): string {
  let data = crypto.createHash('sha256').update(msg, 'utf-8');
  let hashed = data.digest('hex');
  return hashed;
}
