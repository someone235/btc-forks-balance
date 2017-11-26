import axios from 'axios'

export async function getBalance(addr) {
  const { data } = await axios.get(`https://blockchain.info/q/addressbalance/${addr}`);
  return data;
}

export function getBlockExplorerLink(addr) {
  return `https://blockchair.com/bitcoin/address/${addr}`;
}

export const ticker = 'btc';
export const cmcName = 'bitcoin';