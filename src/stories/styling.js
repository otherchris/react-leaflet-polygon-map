import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapContainer from '../MapContainer';
import dpPoly from './dpPoly';
import '../main.css';

storiesOf('Styling', module)
  .add('polygon colors', () => (
    <MapContainer
      style={{ color: 'green', fillColor: 'green', fillOpacity: 0.21 }}
      polygons={[dpPoly.polyline]}
    />
  ))
  .add('height', () => (
    <MapContainer
      height={ 600 }
      polygons={[dpPoly.polyline]}
    />
  ))
  .add('zoom', () => (
    <MapContainer
      zoom={ 13 }
      polygons={[dpPoly.polyline]}
    />
  ))
  .add('center', () => (
    <MapContainer
      center={ [38.35, -85.74] }
      polygons={[dpPoly.polyline]}
    />
  ));
