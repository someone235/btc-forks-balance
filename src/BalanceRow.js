import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import numberToString from './number-to-string';
export default function BalanceRow({ currency, hideAddress }) {
  if (currency.value instanceof Error) {
    return (
      <TableRow>
        <TableRowColumn>
          <a href={`https://coinmarketcap.com/currencies/${currency.cmcName}/`}>
            {currency.ticker.toUpperCase()}
          </a>
        </TableRowColumn>
        {!hideAddress && (
          <TableRowColumn>
            <a href={currency.blockExplorerLink}>{currency.addr}</a>
          </TableRowColumn>
        )}
        <TableRowColumn>
          There was an error in fetching the balance
        </TableRowColumn>
        <TableRowColumn />
        <TableRowColumn />
      </TableRow>
    );
  }
  return (
    <TableRow>
      <TableRowColumn>
        <a href={`https://coinmarketcap.com/currencies/${currency.cmcName}/`}>
          {currency.ticker.toUpperCase()}
        </a>
      </TableRowColumn>
      {!hideAddress && (
        <TableRowColumn>
          <a href={currency.blockExplorerLink}>{currency.addr}</a>
        </TableRowColumn>
      )}
      <TableRowColumn>{numberToString(currency.value / 1e8)}</TableRowColumn>
      <TableRowColumn>
        {numberToString(currency.priceBtc * currency.value / 1e8)}
      </TableRowColumn>
      <TableRowColumn>
        {numberToString(currency.priceUsd * currency.value / 1e8)}
      </TableRowColumn>
    </TableRow>
  );
}
