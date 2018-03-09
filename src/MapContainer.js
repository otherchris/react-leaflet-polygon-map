import pick from 'lodash/pick';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import MapComponent from './MapComponent';
import './main.css';
import cleanProps from './cleanProps';

class MapContainer extends React.Component {
  render() {
    cleanProps(this.props, this.props.onShapeChange, noop);
    const passThroughProps = pick(this.props, [
      'bounds',
      'center',
      'edit',
      'features',
      'featureValidator',
      'force',
      'geolocate',
      'height',
      'legendComponent',
      'legendProps',
      'makeCircleOn',
      'maxAreaEach',
      'newCircleCenter',
      'newCircleRadius',
      'onShapeChange',
      'points',
      'remove',
      'style',
      'tileLayerProps',
      'tooltipOptions',
      'submitButton',
      'zoom',
    ]);
    return (
      <MapComponent
        bindPoint={this}
        {...passThroughProps}
      />
    );
  }
}

MapContainer.propTypes = {
  apikey: PropTypes.string,
  center: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.object,
  ]),
  edit: PropTypes.bool,
  features: PropTypes.arrayOf(PropTypes.object),
  featureValidator: PropTypes.func,
  geolocate: PropTypes.bool,
  height: PropTypes.number,
  legendComponent: PropTypes.func,
  legendProps: PropTypes.object,
  makeCircleOn: PropTypes.bool,
  maxAreaEach: PropTypes.number,
  onShapeChange: PropTypes.func,
  points: PropTypes.array,
  remove: PropTypes.bool,
  style: PropTypes.object,
  submitButton: PropTypes.object,
  tileLayerProps: PropTypes.object,
  tooltipOptions: PropTypes.object,
  unit: PropTypes.string,
  zoom: PropTypes.number,
};

MapContainer.defaultProps = {
  onShapeChange: (a, cb) => { cb(null, a); },
  features: [],
  points: [],
  featureValidator: () => [],
  makeCircleOn: false,
  zoom: 9,
  remove: false,
};

export default MapContainer;

