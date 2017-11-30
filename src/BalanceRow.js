import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
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
      <TableRowColumn>{currency.value / 1e8}</TableRowColumn>
      <TableRowColumn>
        {currency.priceBtc * currency.value / 1e8}
      </TableRowColumn>
      <TableRowColumn>
        {currency.priceUsd * currency.value / 1e8}
      </TableRowColumn>
    </TableRow>
  );
}
