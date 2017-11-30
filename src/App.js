import React, { Component } from 'react';
import checkBalance from './check-balance';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import WAValidator from 'wallet-address-validator';
import { flatten } from 'ramda';
import Toggle from 'material-ui/Toggle';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summarized: true,
    };
  }

  onSubmit = async () => {
    const addresses = this.state.address.split('\n').map(a => a.trim());
    const isInvalid = addresses.find(a => !WAValidator.validate(a, 'BTC'));
    if (!isInvalid) {
      this.setState({
        loading: true,
      });
      const balance = await checkBalance(addresses);
      this.setState({
        balance,
        loading: false,
        addresses,
      });
    } else {
      alert('One or more of your BTC addresses is invalid');
    }
  };

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <a href="https://github.com/someone235/btc-forks-balance">
            <img
              src="https://camo.githubusercontent.com/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67"
              alt="Fork me on GitHub"
              data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"
            />
          </a>
          <div style={{ paddingLeft: 10 }}>
            <div style={{ marginBottom: 5 }}>
              <TextField
                multiLine
                rows={5}
                underlineShow={false}
                hintText="Put here one or more BTC addresses (separated by new lines)"
                onChange={e => this.setState({ address: e.target.value })}
                style={{
                  margin: 5,
                  width: 350,
                  border: '1px solid black',
                  maxWidth: '90%',
                }}
              />
              <RaisedButton
                onClick={this.onSubmit}
                primary={true}
                label="Check"
                disabled={this.state.loading}
              />
            </div>
            {this.state.balance &&
              this.state.addresses.length > 1 && (
                <Toggle
                  label="Summarized Mode"
                  onToggle={(ev, summarized) => this.setState({ summarized })}
                  toggled={this.state.summarized}
                  style={{ maxWidth: 200 }}
                />
              )}
            {this.getBalancesTable()}
            <div style={{ fontSize: 10 }}>
              <div>
                If you want to see a fork that is not on the list, please{' '}
                <a href="https://github.com/someone235/btc-forks-balance/issues/new">
                  place an issue
                </a>, and I will add it ASAP.
              </div>
              <div>
                Donate BTC: 1F5n1fKsNU5JZGNnHyJRnbz1azRyHnut9S or
                bc1q2vgfjzuraefg4uc3mpavqk234szvvvgznm27mt
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
  isSummarized() {
    return (
      this.state.summarized &&
      (this.state.balance && this.state.addresses.length > 1)
    );
  }
  getBalancesTable() {
    if (this.state.balance) {
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
    return this.state.balance.reduce(
      (sum, currency) => sum + getCurrencyTotalBtc(currency),
      0
    );
  }
  getTotal() {
    const totalBtc = this.getTotalBtc();
    const btc = this.state.balance[0];
    const totalUsd = totalBtc * btc.priceUsd / 1e8;
    return { totalBtc, totalUsd };
  }
  getAddressesBalances() {
    return flatten(
      this.state.balance.map(currency => {
        return currency.balances.map(balance => ({
          ...currency,
          ...balance,
        }));
      })
    );
  }
  getCurrencyBalances() {
    return this.state.balance.map(currency => {
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
      sum + (balance.value instanceof Error ? 0 : balance.value),
    0
  );
}

function getCurrencyTotalBtc(currency) {
  return getCurrencyTotal(currency) * currency.priceBtc;
}

export default App;

function BalanceRow({ currency, hideAddress }) {
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
