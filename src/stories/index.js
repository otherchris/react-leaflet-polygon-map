import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapContainer from '../MapContainer';
import points from './points';
import dpPoly from './dpPoly';
import '../main.css';
import './polygons';
import './styling';

storiesOf('Tilesets', module)
  .add('tiles = minimal_light', () => (
    <MapContainer polygons={[dpPoly.polyline]} points={points} tiles="minimal_light" />
  ))
  .add('tiles = minimal_dark', () => (
    <MapContainer polygons={[dpPoly.polyline]} points={points} tiles="minimal_dark" />
  ))
  .add('tiles = default', () => (
    <MapContainer polygons={[dpPoly.polyline]} points={points} />
  ));

