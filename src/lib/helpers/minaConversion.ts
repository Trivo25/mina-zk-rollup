export function nanoToMina(m: number | bigint): bigint {
  return BigInt(m) * BigInt(10) ** BigInt(-9);
}

export function minaToNano(m: number | bigint): bigint {
  return BigInt(m) * BigInt(10) ** BigInt(9);
}
