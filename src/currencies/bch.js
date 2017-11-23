import axios from 'axios'
import getProxiedUrl from '../get-proxied-uri';

export async function getBalance(addr) {
  // const { data } = await axios.get(`https://blockdozer.com/insight-api/addr/${addr}/balance`);
  // return data;
  const { data: { data: [{ sum_value_unspent }] } } = await getProxiedUrl(`https://api.blockchair.com/bitcoin-cash/dashboards/address/${addr}`);
  return Number(sum_value_unspent);
}

export const ticker = 'bch';
export const cmcName = 'bitcoin-cash';