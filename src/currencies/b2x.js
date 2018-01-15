import axios from 'axios';

export async function getBalance(addr) {
  const { data: { balanceSat } } = await axios.get(
    `https://explorer.b2x-segwit.io/b2x-insight-api/addr/${addr}/?noTxList=1`
  );
  return balanceSat;
}

export function getBlockExplorerLink(addr) {
  return `https://explorer.b2x-segwit.io/address/${addr}`;
}

export const ticker = 'b2x';
export const cmcName = 'segwit2x';
