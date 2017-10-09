import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf, linkTo } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import map from 'lodash/map';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import dpPoly from './dpPoly';
import points from './points';


storiesOf('Polygons', module)
  .add('map with a \'gon (polyline)', () => (
    <MapContainerStoryWithNotes
      polygons={[dpPoly.polyline]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Default styled polygon
      `}
    />
  ))
  .add('map with a \'gon (GeoJson)', () => (
    <MapContainerStoryWithNotes
      polygons={[dpPoly.geoJSON]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Default styled polygon
      `}
    />
  ))
  .add('map with a \'gon (wkt)', () => (
    <MapContainerStoryWithNotes
      polygons={[dpPoly.wkt]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Default styled polygon
      `}
    />
  ))
  .add('map with all the \'gons', () => (
    // eslint-disable-next-line max-len
    <MapContainerStoryWithNotes
      polygons={[
        dpPoly.polyline,
        dpPoly.wkt,
        dpPoly.geoJSON,
      ]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Four default styled polygon
      `}
    />
  ))
  .add('map with all the things', () => (
    <MapContainerStoryWithNotes
      polygons={[
        dpPoly.wkt,
        dpPoly.polyline,
        dpPoly.geoJSON,
      ]}
      rectangles={[dpPoly.rectangle]}
      circles={[dpPoly.circle]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Four default styled polygon
        <input type="checkbox" /> 2. Default styled rectangle
        <input type="checkbox" /> 3. Default styled circle
      `}
    />
  ))
  .add('map with rectangle', () => (
    <MapContainerStoryWithNotes
      rectangles={[dpPoly.rectangle]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Default styled rectangle
      `}
    />
  ))
  .add('map with a circle', () => (
    <MapContainerStoryWithNotes
      circles={[dpPoly.circle]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Default styled circle
      `}
    />
  ));

storiesOf('Points', module)
  .add('map with a point', () => (
    <MapContainerStoryWithNotes
      polygons={[]}
      points={ points }
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. 12 default styled points in a circle
      `}
    />
  ));
