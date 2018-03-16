import React, { Component } from 'react';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import simpleNumberLocalizer from 'react-widgets-simple-number';
import logo from './logo.svg';
import './App.css';
import MapComponent from './MapComponent';
import testerProps from './testerProps';

simpleNumberLocalizer();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapProps: {},
      lastMapState: {},
    }
  }

  simpleOnChange(a, cb) {
    const { points, features, remove } = omit(a, 'markerIcon');
    if (!(
      //isEqual(points, this.state.lastMapState.points) &&
      //isEqual(features, this.state.lastMapState.features) &&
      //isEqual(remove, this.state.lastMapState.remove)
      isEqual(a, this.state.lastMapState)
    )) {
      this.setState({ mapProps: a, lastMapState: a});
    }
    cb(null, a);
  };

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
        <MapComponent {...this.state.mapProps} onShapeChange={this.simpleOnChange.bind(this)}/>
        <div className="lms">
          {JSON.stringify(this.state.lastMapState, null, '  ')}
        </div>
      </div>
    );
  }
}

export default App;
