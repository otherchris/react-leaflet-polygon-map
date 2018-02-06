import React, { Component } from 'react';
import map from 'lodash/map';
import logo from './logo.svg';
import './App.css';
import MapContainer from './MapContainer';
import testerProps from './testerProps';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapProps: {},
    }
  }

  makeTest(test) {
    return (
      <button
        type="button"
        onClick={() => this.setState( { mapProps: test.props })}
        id={test.name} >
          {test.name}
      </button>
   );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          {map(testerProps, this.makeTest.bind(this))}
        <MapContainer {...this.state.mapProps} />
      </div>
    );
  }
}

export default App;
