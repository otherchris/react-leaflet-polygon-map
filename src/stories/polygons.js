import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf, linkTo } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import map from 'lodash/map';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import dpPoly from './dpPoly';
import points from './points';


storiesOf('features', module)
  .add('map with a \'gon (polyline)', () => (
    <MapContainerStoryWithNotes
      features={[dpPoly.polyline]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Default styled polygon
      `}
    />
  ))
  .add('map with a \'gon (GeoJson)', () => (
    <MapContainerStoryWithNotes
      features={[dpPoly.geoJSON.data, dpPoly.geoJSON2.data]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Default styled polygon
      `}
    />
  ))
  .add('map with a \'gon (wkt)', () => (
    <MapContainerStoryWithNotes
      features={[dpPoly.wkt]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Default styled polygon
      `}
    />
  ))
  .add('map with all the \'gons', () => (
    // eslint-disable-next-line max-len
    <MapContainerStoryWithNotes
      features={[
        dpPoly.polyline,
        dpPoly.wkt,
        dpPoly.geoJSON,
      ]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Four default styled polygon
      `}
    />
  ))
  .add('map with a \'gon (with errors)', () => (
    <MapContainerStoryWithNotes
      features={[dpPoly.geoJSONerrors]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Default styled polygon
      `}
    />
  ))
  .add('map with a \'gon (non-trivial MP)', () => (
    <MapContainerStoryWithNotes
      features={[dpPoly.geoJSONmulti]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Default styled polygon
      `}
    />
  ));
storiesOf('Points', module)
  .add('map with a point', () => (
    <MapContainerStoryWithNotes
      features={[]}
      points={ points }
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. 12 default styled points in a circle
      `}
    />
  ));
