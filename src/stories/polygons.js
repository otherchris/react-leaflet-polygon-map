import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapContainer from '../MapContainer';
import dpPoly from './dpPoly';
import points from './points';
import '../main.css';

storiesOf('Polygons', module)
  .add('map with no \'gons', () => (
    <MapContainer polygons={[]} tiles="minimal_light"/>
  ))
  .add('map with a \'gon (polyline)', () => (
    <MapContainer polygons={[dpPoly.polyline]} tiles="minimal_light"/>
  ))
  .add('map with a \'gon (GeoJson)', () => (
    <MapContainer polygons={[dpPoly.geoJSON]} tiles="minimal_light"/>
  ))
  .add('map with a \'gon (wkt)', () => (
    <MapContainer polygons={[dpPoly.wkt]} tiles="minimal_light"/>
  ))
  .add('map with a \'gon (wkb)', () => (
    <MapContainer polygons={[dpPoly.wkb]} tiles="minimal_light"/>
  ))
  .add('map with all the \'gons', () => (
    // eslint-disable-next-line max-len
    <MapContainer polygons={[dpPoly.wkt, dpPoly.polyline, dpPoly.geoJSON, dpPoly.wkb]} tiles="minimal_light"/>
  ))
  .add('map with all the things', () => (
    // eslint-disable-next-line max-len
    <MapContainer polygons={[dpPoly.wkt, dpPoly.polyline, dpPoly.geoJSON, dpPoly.wkb]} rectangles={[dpPoly.rectangle]} circles={[dpPoly.circle]} tiles="minimal_light"/>
  ))
  .add('map with rectangle', () => (
    <MapContainer rectangles={[dpPoly.rectangle]} tiles="minimal_light" />
  ))
  .add('map with a circle', () => (
    <MapContainer circles={[dpPoly.circle]} tiles="minimal_light" />
  ));

storiesOf('Points', module)
  .add('map with no points', () => (
    <MapContainer polygons={[]} points={[]} tiles="minimal_light"/>
  ))
  .add('map with a point', () => (
    <MapContainer polygons={[]} points={ points } tiles="minimal_light"/>
  ));
