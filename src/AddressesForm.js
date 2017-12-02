import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Form from './Form';
import WAValidator from 'wallet-address-validator';

export default class extends Component {
  handleSubmit = ({ addresses: stringAddrs }) => {
    const addresses = stringAddrs.split('\n').map(a => a.trim());
    const isInvalid = addresses.find(a => !WAValidator.validate(a, 'BTC'));
    if (!isInvalid) {
      this.props.onSubmit(addresses);
    } else {
      alert('One or more of your BTC addresses is invalid');
    }
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
          />
          <RaisedButton
            type="submit"
            primary={true}
            label="Check"
            disabled={this.props.loading}
          />
        </Form>
      </div>
    );
  }
}
