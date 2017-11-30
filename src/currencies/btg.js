import axios from 'axios';
import base58check from '../base58check';

export async function getBalance(addr) {
  try {
    const { data: { balanceSat } } = await axios.get(
      `https://btgexplorer.com/api/addr/${addr}/?noTxList=1`
    );
    return balanceSat;
  } catch (e) {
    const { data } = await axios.get(
      `https://btgexp.com/ext/getbalance/${addr}`
    );
    return data * 1e8;
  }
}

export function convertAddr(add) {
  var decoded = base58check.decode(add, 'hex');
  if (decoded.prefix === '00') {
    // 1: dec: 0 hex: 00
    console.log('Pay-to-PubkeyHash Bitcoin to Bitcoin Gold');
    return base58check.encode(decoded.data, '26');
  } else if (decoded.prefix === '05') {
    // 5: dec: 5 hex: 05
    console.log('Pay-to-Script-Hash Bitcoin to Bitcoin Gold');
    return base58check.encode(decoded.data, '17');
  } else if (decoded.prefix === '17') {
    // A: dec: 23 hex: 17
    console.log('Pay-to-Script-Hash Bitcoin Gold to Bitcoin');
    return base58check.encode(decoded.data, '05');
  } else if (decoded.prefix === '26') {
    // G: dec: 38 hex: 26
    console.log('Pay-to-PubkeyHash Bitcoin Gold to Bitcoin');
    return base58check.encode(decoded.data, '00');
  }
}

export function getBlockExplorerLink(addr) {
  return `https://btgexplorer.com/address/${addr}`;
}

export const ticker = 'btg';
export const cmcName = 'bitcoin-gold';
