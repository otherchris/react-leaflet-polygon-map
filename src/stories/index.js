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
    <MapContainer polygons={[]} tiles="minimal_light"/>
  ))
  .add('map with a \'gon (polyline)', () => (
    <MapContainer polygons={[poly.polyline]} tiles="minimal_light"/>
  ))
  .add('map with a \'gon (GeoJson)', () => (
    <MapContainer polygons={[poly.geoJSON]} tiles="minimal_light"/>
  ))
  .add('map with a \'gon (wkt)', () => (
    <MapContainer polygons={[poly.wkt]} tiles="minimal_light"/>
  ))
  .add('map with a \'gon (wkb)', () => (
    <MapContainer polygons={[poly.wkb]} tiles="minimal_light"/>
  ))
  .add('map with all the \'gons', () => (
    <MapContainer polygons={[poly.wkt, poly.polyline, poly.geoJSON, poly.wkb]} tiles="minimal_light"/>
  ))
  .add('map with hex wkb', () => (
    <MapContainer polygons={[poly.wkbHex]} encoding="hex" tiles="minimal_light"/>
  ));

storiesOf('Points', module)
  .add('map with no points', () => (
    <MapContainer polygons={[]} points={[]} tiles="minimal_light"/>
  ))
  .add('map with a point', () => (
    <MapContainer polygons={[]} points={ points } tiles="minimal_light"/>
  ));

storiesOf('Tilesets', module)
  .add('tiles = minimal_light', () => (
    <MapContainer polygons={[poly.polyline]} points={points} tiles="minimal_light" />
  ))
  .add('tiles = minimal_dark', () => (
    <MapContainer polygons={[poly.polyline]} points={points} tiles="minimal_dark" />
  ))
  .add('tiles = default', () => (
    <MapContainer polygons={[poly.polyline]} points={points} />
  ))

storiesOf('Edit tools', module)
  .add('without edit tools (default)', () => (
    <MapContainer />
  ))
  .add('with edit tools', () => (
    <MapContainer edit />
  ));
