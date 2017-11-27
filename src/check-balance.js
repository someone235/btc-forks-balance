import * as btc from './currencies/btc';
import * as bch from './currencies/bch';
import * as btg from './currencies/btg';
import * as btx from './currencies/btx';
import Promise from 'bluebird';
import axios from 'axios';
export default async function (addr) {
  return (await Promise.map([btc, bch, btg, btx], async currency => {
    const currAddr = currency.convertAddr ? currency.convertAddr(addr) : addr;
    return Promise.all([currency, getBalance(currency, currAddr), checkPrice(currency), currAddr]);
  })).map(([currency, balance, { priceBtc, priceUsd }, addr]) => {
    return {
      ...currency,
      balance,
      priceBtc,
      priceUsd,
      addr,
      blockExplorerLink: currency.getBlockExplorerLink(addr),
    }
  });
}

async function getBalance(currency, currAddr) {
  try {
    return await currency.getBalance(currAddr);
  } catch (e) {
    console.error(e);
    return e;
  }
}

async function checkPrice({ cmcName }) {
  const { data: [{ price_btc, price_usd }] } = await axios.get(`https://api.coinmarketcap.com/v1/ticker/${cmcName}/`);
  return { priceBtc: Number(price_btc), priceUsd: Number(price_usd) };
}