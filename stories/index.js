import React from 'react';
import polyline from 'polyline';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import MapExample from '../src/MapExample';
import MapContainer from '../src/MapContainer';
import poly from './poly';

const geoJSON = polyline.toGeoJSON(poly);
storiesOf('MapExample', module)
  .add('makes a map with no polys', () => (
    <MapExample
      polys={[]}
      width= { 600 }
      height= { 400 }
      centerLat={38.195}
      centerLong={-85.752}
      zoom={8}
      tileLayerProps={{
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      }}
    />
  ))
  .add('makes a map with a GeoJSON poly', () => (
    <MapExample
      polys={[geoJSON]}
      width= { 600 }
      height= { 400 }
      centerLat={38.195}
      centerLong={-85.752}
      zoom={11}
      tileLayerProps={{
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      }}
    />
  ))
  .add('tall skinny map', () => (
    <MapExample
      polys={[geoJSON]}
      width= { 60 }
      height= { 600 }
      centerLat={38.195}
      centerLong={-85.752}
      zoom={11}
      tileLayerProps={{
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      }}
    />
  ))
  .add('short fat map', () => (
    <MapExample
      polys={[geoJSON]}
      width= { 600 }
      height= { 60 }
      centerLat={38.195}
      centerLong={-85.752}
      zoom={11}
      tileLayerProps={{
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      }}
    />
  ));
