import crypto from 'crypto';

export const randomChallenge = (): string => {
  const n = crypto.pseudoRandomBytes(256);
  return n.toString('utf-8');
};
