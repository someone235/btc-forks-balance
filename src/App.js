import React, { Component } from 'react';
import checkBalance from './check-balance';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AddressesForm from './AddressesForm';
import BalanceTable from './BalanceTable';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summarized: true,
    };
  }

  handleSubmit = async addresses => {
    this.setState({
      loading: true,
    });
    const balance = await checkBalance(addresses);
    this.setState({
      balance,
      loading: false,
      addresses,
    });
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
            <AddressesForm
              onSubmit={this.handleSubmit}
              loading={this.state.loading}
            />
            <BalanceTable balance={this.state.balance} />
            <div style={{ fontSize: 10 }}>
              <div>
                If you want to see a fork that is not on the list, please{' '}
                <a href="https://github.com/someone235/btc-forks-balance/issues/new">
                  place an issue
                </a>, and I will add it ASAP.
              </div>
              <div>Donate BTC: 1F5n1fKsNU5JZGNnHyJRnbz1azRyHnut9S</div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
