import axios from 'axios';

export async function getBalance(addr) {
  const { data: { balanceSat } } = await axios.get(
    `http://52.187.7.191:3001/insight-api/addr/${addr}/?noTxList=1`
  );
  return balanceSat;
}

export function getBlockExplorerLink(addr) {
  return `http://explorer.btcd.io/#/address?loading=true&address=${addr}`;
}

export const ticker = 'bcd';
export const cmcName = 'bitcoin-diamond';
