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
  ))
  .add('map with rectangle', () => ( // Replace poly.whatever with rectangle.geoJSON(or polyline) when you get one
    <MapContainer rectangles={[poly.geoJSON]} tiles="minimal_light" />
  ))
  .add('map with a circle', () => (  // Replce poly.whatever with circle.polyline(or geoJSON) when you get one
    <MapContainer circles={[poly.polyline]} tiles="minimal_light" />
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

storiesOf('Styling', module)
  .add('polygon colors', () => (
    <MapContainer
      style={{ color: 'green', fillColor: 'green', fillOpacity: 0.21 }}
      polygons={[poly.polyline]}
    />
  ))
  .add('height', () => (
    <MapContainer
      height={ 600 }
      polygons={[poly.polyline]}
    />
  ))
  .add('zoom', () => (
    <MapContainer
      zoom={ 13 }
      polygons={[poly.polyline]}
    />
  ))
  .add('center', () => (
    <MapContainer
      center={ [38.35, -85.74] }
      polygons={[poly.polyline]}
    />
  ))
