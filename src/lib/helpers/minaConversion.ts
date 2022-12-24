export { nanoToMina, minaToNano, MINA };

function nanoToMina(m: number | bigint): bigint {
  return BigInt(m) * BigInt(10) ** BigInt(-9);
}

function minaToNano(m: number | bigint): bigint {
  return BigInt(m) * BigInt(10) ** BigInt(9);
}

const MINA = 10e9;
