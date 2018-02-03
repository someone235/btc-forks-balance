import axios from 'axios';

export async function getBalance(addr) {
  const { data: { result, rd } } = await axios.get(
    `https://main.ub.com/portals/blockexplore/address/${addr}?pageNo=1&pageSize=5`
  );
  if (rd === 'address not found') {
    return 0;
  }
  if (rd) {
    throw new Error(rd);
  }
  return result.amount * 1e8;
}

export function getBlockExplorerLink(addr) {
  return `https://www.ub.com/explorer/address?address=${addr}`;
}

export const ticker = 'ubtc';
export const cmcName = 'united-bitcoin';
