import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import { addressPoints } from './stories/realworld.10000.js';

const Heatmap = (props) => (
  <HeatmapLayer
    fitBoundsOnLoad
    fitBoundsOnUpdate
    points={props.heatmap}
    longitudeExtractor={m => m[1]}
    latitudeExtractor={m => m[0]}
    intensityExtractor={m => parseFloat(m[2])}
  />
);

Heatmap.propTypes = {
  points: PropTypes.array,
  heatmap: PropTypes.object,
};

export default Heatmap;
