import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';
import BalanceRow from './BalanceRow';
import { flatten } from 'ramda';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summarized: true,
    };
  }
  render() {
    return (
      <div>
        {this.isSummarizedModeAllowed() && (
          <Toggle
            label="Summarized Mode"
            onToggle={(ev, summarized) => this.setState({ summarized })}
            toggled={this.state.summarized}
            style={{ maxWidth: 200 }}
          />
        )}
        {this.getTable()}
      </div>
    );
  }
  isSummarized() {
    return (
      this.state.summarized &&
      (this.props.balance && this.isSummarizedModeAllowed())
    );
  }
  isSummarizedModeAllowed() {
    return (
      this.props.balance &&
      this.props.balance.length &&
      this.props.balance[0].balances.length > 1
    );
  }
  getTable() {
    if (this.props.balance) {
      const { totalBtc, totalUsd } = this.getTotal();
      return (
        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Ticker</TableHeaderColumn>
              {!this.isSummarized() && (
                <TableHeaderColumn>Address</TableHeaderColumn>
              )}
              <TableHeaderColumn>Balance</TableHeaderColumn>
              <TableHeaderColumn>BTC Balance</TableHeaderColumn>
              <TableHeaderColumn>USD Balance</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                <b>Total</b>
              </TableRowColumn>
              {!this.isSummarized() && <TableRowColumn />}
              <TableRowColumn />
              <TableRowColumn>
                <b>{totalBtc / 1e8}</b>
              </TableRowColumn>
              <TableRowColumn>
                <b>{totalUsd}</b>
              </TableRowColumn>
            </TableRow>
            {this.getBalanceRows()}
          </TableBody>
        </Table>
      );
    }
  }
  getBalanceRows() {
    if (this.isSummarized()) {
      return this.getCurrencyBalances().map(currency => {
        return (
          <BalanceRow
            currency={currency}
            hideAddress={true}
            key={currency.ticker}
          />
        );
      });
    }
    return this.getAddressesBalances().map((currency, i) => {
      return <BalanceRow currency={currency} key={i} />;
    });
  }
  getTotalBtc() {
    return this.props.balance.reduce(
      (sum, currency) => sum + getCurrencyTotalBtc(currency),
      0
    );
  }
  getTotal() {
    const totalBtc = this.getTotalBtc();
    const btc = this.getBtc();
    const totalUsd = totalBtc * btc.priceUsd / 1e8;
    return { totalBtc, totalUsd };
  }
  getBtc() {
    return this.props.balance.find(c => c.ticker === 'btc');
  }
  getAddressesBalances() {
    return flatten(
      this.props.balance.map(currency => {
        return currency.balances.map(balance => ({
          ...currency,
          ...balance,
        }));
      })
    );
  }
  getCurrencyBalances() {
    return this.props.balance.map(currency => {
      return {
        ...currency,
        value: getCurrencyTotal(currency),
      };
    });
  }
}

function getCurrencyTotal(currency) {
  return currency.balances.reduce(
    (sum, balance) =>
      balance.value instanceof Error ? balance.value : balance.value + sum,
    0
  );
}

function getCurrencyTotalBtc(currency) {
  const currencyTotal = getCurrencyTotal(currency);
  return currencyTotal instanceof Error ? 0 : currencyTotal * currency.priceBtc;
}
