import React, { Component } from 'react';

export default class extends Component {
  getFormData(target) {
    const domData = new FormData(target);
    const data = {};
    [...domData.keys()].forEach(key => (data[key] = domData.get(key)));
    return data;
  }
  handleSubmit = ev => {
    ev.preventDefault();
    this.props.onSubmit(this.getFormData(ev.target));
  };
  render() {
    return <form onSubmit={this.handleSubmit}>{this.props.children}</form>;
  }
}
