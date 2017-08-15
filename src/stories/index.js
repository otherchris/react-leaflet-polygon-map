import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Button from './Button';
import Welcome from './Welcome';
import MapContainer from '../MapContainer';
import poly from './poly';
import points from './points';
import '../main.css';
import 'leaflet-draw/dist/leaflet.draw.css';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Polygons', module)
  .add('map with no \'gons', () => (
    <MapContainer polygons={[]}/>
  ))
  .add('map with a \'gon (polyline)', () => (
    <MapContainer polygons={[poly.polyline]}/>
  ))
  .add('map with a \'gon (GeoJson)', () => (
    <MapContainer polygons={[poly.geoJSON]}/>
  ))
  .add('map with a \'gon (wkt)', () => (
    <MapContainer polygons={[poly.wkt]}/>
  ));

storiesOf('Points', module)
  .add('map with no points', () => (
    <MapContainer polygons={[]} points={[]}/>
  ))
  .add('map with a point', () => (
    <MapContainer polygons={[]} points={ points }/>
  ));
