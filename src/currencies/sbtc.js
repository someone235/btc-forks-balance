import getProxiedUrl from '../get-proxied-uri';

export async function getBalance(addr) {
  const { data: { balanceSat } } = await getProxiedUrl(
    `http://block.superbtc.org/insight-api/addr/${addr}/?noTxList=1`
  );
  return balanceSat;
}

export function getBlockExplorerLink(addr) {
  return `http://block.superbtc.org/address/${addr}`;
}

export const ticker = 'sbtc';
export const cmcName = 'super-bitcoin';
