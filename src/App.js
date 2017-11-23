import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
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


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSubmit = async () => {
    this.setState({
      loading: true
    })
    const balance = await checkBalance(this.state.address);
    this.setState({
      balance,
      loading: false,
    });
  };

  render() {
    return (
      <MuiThemeProvider>
        <div style={{ padding: 10 }}>
          <div>
            <TextField
              hintText="BTC Address"
              onChange={e => this.setState({ address: e.target.value })}
              style={{ margin: 5, width: 350 }}
            />
            <RaisedButton onClick={this.onSubmit} primary={true} label="Check" disabled={this.state.loading} />
          </div>
          {this.getBalancesTable()}
        </div>
      </MuiThemeProvider>
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
              <TableHeaderColumn>Balance</TableHeaderColumn>
              <TableHeaderColumn>BTC Balance</TableHeaderColumn>
              <TableHeaderColumn>USD Balance</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn><b>Total</b></TableRowColumn>
              <TableRowColumn></TableRowColumn>
              <TableRowColumn><b>{totalBtc / 1e8}</b></TableRowColumn>
              <TableRowColumn><b>{totalUsd}</b></TableRowColumn>
            </TableRow>
            {this.state.balance.map((currency, i) => {
              return (
                <TableRow key={currency.ticker}>
                  <TableRowColumn><a href={`https://coinmarketcap.com/currencies/${currency.cmcName}/`}>{currency.ticker}</a></TableRowColumn>
                  <TableRowColumn>{currency.balance / 1e8}</TableRowColumn>
                  <TableRowColumn>{currency.priceBtc * currency.balance / 1e8}</TableRowColumn>
                  <TableRowColumn>{currency.priceUsd * currency.balance / 1e8}</TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }
  }
  getTotalBtc() {
    return this.state.balance.reduce((sum, currency) => sum + currency.balance * currency.priceBtc, 0);
  }
  getTotal() {
    const totalBtc = this.getTotalBtc();
    const btc = this.state.balance[0];
    const totalUsd = totalBtc * btc.priceUsd / 1e8;
    return { totalBtc, totalUsd };
  }
}

export default App;