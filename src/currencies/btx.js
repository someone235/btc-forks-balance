import axios from 'axios';
import getProxiedUrl from '../get-proxied-uri';

// const API_KEY = 'ac01dbfbaadc';

export async function getBalance(addr) {
  const { data } = await getProxiedUrl(`chainz.cryptoid.info/btx/api.dws?q=getbalance&a=${addr}`);
  return data * 1e8;
}

export const ticker = 'btx';
export const cmcName = 'bitcore';