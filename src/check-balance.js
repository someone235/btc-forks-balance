import * as btc from './currencies/btc';
import * as bch from './currencies/bch';
import * as btg from './currencies/btg';
import * as btx from './currencies/btx';
import Promise from 'bluebird';
import axios from 'axios';
export default async function (addr) {
  return (await Promise.map([btc, bch, btg, btx], async currency => {
    return Promise.all([currency, currency.getBalance(addr), checkPrice(currency)]);
  })).map(([currency, balance, { priceBtc, priceUsd }]) => {
    return {
      ...currency,
      balance,
      priceBtc,
      priceUsd,
    }
  });
}

async function checkPrice({ cmcName }) {
  const { data: [{ price_btc, price_usd }] } = await axios.get(`https://api.coinmarketcap.com/v1/ticker/${cmcName}/`);
  return { priceBtc: Number(price_btc), priceUsd: Number(price_usd) };
}