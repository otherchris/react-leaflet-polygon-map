import React, { Component } from 'react';
import map from 'lodash/map';
import omit from 'lodash/omit';
import simpleNumberLocalizer from 'react-widgets-simple-number';
import { ReactScriptLoader, ReactScriptLoaderMixin } from 'react-script-loader';
import logo from './logo.svg';
import './App.css';
import MapContainer from './MapContainer';
import testerProps from './testerProps';

simpleNumberLocalizer();

class App extends Component {
  constructor(props) {
    super(props);
    console.log(process.env.REACT_APP_GOOGLE_KEY)
    this.state = {
      mapProps: {},
      lastMapState: {},
    };
  }
  /*
  getScriptLoaderID() {
    return ReactScriptLoaderMixin.__getScriptLoaderID();
  }
  getScriptUrl() {
    const keyparam = process.env.REACT_APP_GOOGLE_KEY;
    return `https://maps.googleapis.com/maps/api/js?key=${keyparam}&libraries=places`;
  }
  onScriptLoaded() {
    console.log('success')
    this.setState({ googleAPILoaded: true });
  }
  onScriptError() {
    this.setState({ googleAPIError: true });
  }
  componentDidMount() {
    ReactScriptLoader.componentDidMount(this.getScriptLoaderID(), this, this.getScriptUrl());
  }
  */
  makeTest(test) {
    return (
      <button
        type="button"
        onClick={() => this.setState({ mapProps: test.props })}
        id={test.name}
      >
        {test.name}
      </button>
    );
  }

  simpleOnChange(a, cb) {
    this.setState({ mapProps: a, lastMapState: a });
    cb(null, a);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {map(testerProps, this.makeTest.bind(this))}
        <MapContainer {...this.state.mapProps} onShapeChange={this.simpleOnChange.bind(this)}/>
        <div className="lms">
          {JSON.stringify(omit(this.state.lastMapState, 'bindPoint'), null, '  ')}
        </div>
      </div>
    );
  }
}

export default App;
