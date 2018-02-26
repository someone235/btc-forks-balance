import getProxiedUrl from '../get-proxied-uri';

// const API_KEY = 'ac01dbfbaadc';

export async function getBalance(addr) {
  const { data } = await getProxiedUrl(
    `http://chainz.cryptoid.info/btx/api.dws?q=getbalance&a=${addr}`
  );
  return data * 1e8;
}

export function getBlockExplorerLink(addr) {
  return `https://chainz.cryptoid.info/btx/address.dws?${addr}.htm`;
}

export const ticker = 'btx';
export const cmcName = 'bitcore';
