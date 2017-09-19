import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf, linkTo } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import map from 'lodash/map';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import dpPoly from './dpPoly';
import points from './points';
import '../main.css';


storiesOf('Polygons', module)
  .add('map with no \'gons', () => (
    <MapContainerStoryWithNotes polygons={[]} additionalNotes={'An addtional note'} />
  ))
  .add('map with a \'gon (polyline)', () => (
    <MapContainerStoryWithNotes polygons={[dpPoly.polyline]} />
  ))
  .add('map with a \'gon (GeoJson)', () => (
    <MapContainerStoryWithNotes polygons={[dpPoly.geoJSON]} />
  ))
  .add('map with a \'gon (wkt)', () => (
    <MapContainerStoryWithNotes polygons={[dpPoly.wkt]} />
  ))
  .add('map with a \'gon (wkb)', () => (
    <MapContainerStoryWithNotes polygons={[dpPoly.wkb]} />
  ))
  .add('map with all the \'gons', () => (
    // eslint-disable-next-line max-len
    <MapContainerStoryWithNotes polygons={[
      dpPoly.wkb,
      dpPoly.polyline,
      dpPoly.wkt,
      dpPoly.geoJSON,
    ]}
    />
  ))
  .add('map with all the things', () => (
    <MapContainerStoryWithNotes
      polygons={[
        dpPoly.wkt,
        dpPoly.polyline,
        dpPoly.geoJSON,
        dpPoly.wkb,
      ]}
      rectangles={[dpPoly.rectangle]}
      circles={[dpPoly.circle]}
      tiles="minimal_light"
    />
  ))
  .add('map with rectangle', () => (
    <MapContainerStoryWithNotes rectangles={[dpPoly.rectangle]} tiles="minimal_light" />
  ))
  .add('map with a circle', () => (
    <MapContainerStoryWithNotes circles={[dpPoly.circle]} tiles="minimal_light" />
  ));

storiesOf('Points', module)
  .add('map with no points', () => (
    <MapContainerStoryWithNotes polygons={[]} points={[]} tiles="minimal_light"/>
  ))
  .add('map with a point', () => (
    <MapContainerStoryWithNotes polygons={[]} points={ points } tiles="minimal_light"/>
  ));
