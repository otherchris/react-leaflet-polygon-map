import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import 'leaflet-draw/dist/leaflet.draw.css';
import Button from './Button';
import Welcome from './Welcome';
import MapContainer from '../MapContainer';
import dpPoly from './dpPoly';
import poly from './poly';
import points from './points';
import '../main.css';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

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

storiesOf('Edit tools', module)
  .add('without edit tools (default)', () => (
    <MapContainer />
  ))
  .add('with edit tools', () => (
    <MapContainer edit />
  ));

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
  ))
storiesOf('Zips in a Radius', module)
  .add('With no center', () => (
  <MapContainer
    zipRadius
  />
  ))
  .add('With center provided', () => (
  <MapContainer
    zipRadius
    center="a given center"
  />
));
