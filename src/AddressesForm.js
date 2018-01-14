import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Form from './Form';
import WAValidator from 'wallet-address-validator';
import QrReader from 'react-qr-reader';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleSubmit = () => {
    this.submitAndValidateStringAddrs(this.state.stringAddrs);
  };
  submitAndValidateStringAddrs = stringAddrs => {
    const addresses = stringAddrs.split('\n').map(a => a.trim());
    const isInvalid = addresses.find(a => !WAValidator.validate(a, 'BTC'));
    if (!isInvalid) {
      this.props.onSubmit(addresses);
    } else {
      alert('One or more of your BTC addresses is invalid');
    }
  };
  showScanner = () => {
    this.setState({ showScanner: true });
  };
  handleScan = url => {
    if (url) {
      const address = parseBitcoinURL(url).address;
      this.submitAndValidateStringAddrs(address);
      this.setState({ showScanner: false, stringAddrs: address });
    }
  };
  handleTextChange = ev => {
    this.setState({ stringAddrs: ev.target.value });
  };
  closeScanner = () => {
    this.setState({ showScanner: false });
  };
  render() {
    return (
      <div style={{ marginBottom: 5 }}>
        <Form onSubmit={this.handleSubmit}>
          <TextField
            multiLine
            rows={5}
            underlineShow={false}
            hintText="Put here one or more BTC addresses (separated by new lines)"
            name="addresses"
            style={{
              margin: 5,
              width: 350,
              border: '1px solid black',
              maxWidth: '90%',
            }}
            onChange={this.handleTextChange}
            value={this.state.stringAddrs}
          />
          <div>
            <RaisedButton
              label="Scan QR Code"
              onClick={this.showScanner}
              backgroundColor="gray"
              style={{ margin: 5 }}
            />
            <RaisedButton
              type="submit"
              primary={true}
              label="Check"
              disabled={this.props.loading}
              style={{ margin: 5 }}
            />
          </div>
        </Form>
        {this.state.showScanner && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
            }}
            onClick={this.closeScanner}
          >
            <QrReader
              delay={300}
              onScan={this.handleScan}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>
    );
  }
}

/* Parse bitcoin URL query keys. */
function parseBitcoinURL(url) {
  var r = /^bitcoin:([a-zA-Z0-9]*)(?:\?(.*))?$/;
  var match = r.exec(url);
  if (!match) return null;

  var parsed = { url: url };

  if (match[2]) {
    var queries = match[2].split('&');
    for (var i = 0; i < queries.length; i++) {
      var query = queries[i].split('=');
      if (query.length === 2) {
        parsed[query[0]] = decodeURIComponent(query[1].replace(/\+/g, '%20'));
      }
    }
  }

  parsed.address = match[1];
  return parsed;
}
