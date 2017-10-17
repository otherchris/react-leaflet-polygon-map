import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import points from './points';
import dpPoly from './dpPoly';
import poly from './poly';
import './layout';
import './polygons';
import './convertedPolys';
import './styling';
import './tools';
import './heatmap';

storiesOf('Tilesets', module)
  .add('tiles = minimal_light', () => (
    <MapContainerStoryWithNotes
      polygons={[dpPoly.polyline]}
      points={points}
      tiles='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
    />
  ))
  .add('tiles = default', () => (
    <MapContainerStoryWithNotes
      polygons={[dpPoly.polyline]}
      points={points}
    />
  ));

storiesOf('onChange prop', module)
  .add('pass an onChange function', () => (
    <MapContainerStoryWithNotes
      edit
      onChange={(state) => {
        alert(JSON.stringify(state, null, '  '));
      }}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Alert with state on component update
      `}
    />
  ));

storiesOf('handleSubmit', module)
  .add('Do not show Submit button if handleSubmit prop not provided', () => (
    <MapContainerStoryWithNotes
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. No submit button
      `}
    />
  ))
  .add('Show Submit button if handleSubmit prop is provided', () => (
    <MapContainerStoryWithNotes
      edit={true}
      handleSubmit={(state) => {
        alert(JSON.stringify(state, null, '  '));
      }}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Submit button
        <input type="checkbox" /> 2. Submit button raises alert on click
      `}
    />
  ))
  .add('Style submit button with submitButton prop', () => (
    <MapContainerStoryWithNotes
      edit={true}
      submitButton={{
        text: 'User supplied text',
        className: 'test-submit-style',
      }}
      handleSubmit={(state) => {
        alert(JSON.stringify(state, null, '  '));
      }}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Submit button
        <input type="checkbox" /> 2. Submit button raises alert on click
      `}
    />
  ))
  .add('Submit should be disabled if any polygon is too big', () => (
    <MapContainerStoryWithNotes
      edit
      polygons={[poly.tooBigPoly]}
      handleSubmit={(state) => {
        alert(JSON.stringify(state, null, '  '));
      }}
      maxArea={{
        unit: 'miles',
        max: 1,
      }}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Submit button in disabled state
        <input type="checkbox" /> 2. Visual indication that the poly is too big
        <input type="checkbox" /> 3. Resize or delete poly to enable submit
      `}
    />
  ))
  .add('Submit should be disabled if sum of polygons is too big', () => (
    <MapContainerStoryWithNotes
      edit
      polygons={poly.tooBigPolyArray}
      handleSubmit={(state) => {
        alert(JSON.stringify(state, null, '  '));
      }}
      maxArea={{
        unit: 'miles',
        max: 1,
      }}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Submit button in disabled state
        <input type="checkbox" /> 2. No visual indication on any given polygon
        <input type="checkbox" /> 3. Resize or delete poly to enable submit
      `}
    />
  ));

storiesOf('Click to remove', module)
  .add('click to remove', () => (
    <MapContainerStoryWithNotes
      polygons={[dpPoly.polyline]}
      edit
      remove
    />
  ));

storiesOf('Geolocation search', module)
  .add('do the thing', () => (
    <MapContainerStoryWithNotes
      apikey={''}
      polygons={[dpPoly.polyline]}
      edit
      remove
    />
  ));

storiesOf('expand google maps and feature collections', module)
  .add('Google map', () => (
    <MapContainerStoryWithNotes
      polygons={[dpPoly.googleMap]}
      edit
      remove
    />
  ))
  .add('Feature collection', () => (
    <MapContainerStoryWithNotes
      polygons={[dpPoly.featureCollection]}
      edit
      remove
    />
  ));

storiesOf('generate a polygon for augmented points', module)
  .add('12 sided \'gon', () => (
    <MapContainerStoryWithNotes
      points={[
        {
          type: 'Feature',
          properties: {
            radius: 5,
            units: 'miles',
            sides: 4,
          },
          geometry: {
            type: 'Point',
            coordinates: [-83, 35],
          },
        },
      ]}
      edit
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. 12 sided polygon around a marker
      `}
    />
  ));

storiesOf('Style tooltip', module)
  .add('with area/location', () => (
    <MapContainerStoryWithNotes
      tooltipOptions={{
        units: {
          name: 'fathoms',
          conversion: 0.298998, // conversion factor from meters to whatever
        },
        includeArea: true,
        text: 'A word before the area',
        className: 'class-for-styles-poly and-another',
      }}
      polygons={[poly.tooBigPoly]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Poly tooltips have area in 'sq fathoms'
        <input type="checkbox" /> 2. Markers and polys have a text message with the area
        <input type="checkbox" /> 3. tooltip elements have given class names
      `}
    />
  ))
  .add('without area/location', () => (
    <MapContainerStoryWithNotes
      tooltipOptions={{
        includeArea: false,
        text: 'A word ',
        className: 'class-for-styles-poly and-another',
        marker: {
          includeLocation: false,
          text: 'a point is here',
          className: 'class-for-styles-marker and-another',
        },
      }}
      polygons={[poly.tooBigPoly]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Markers and polys have a text message and no area
        <input type="checkbox" /> 3. tooltip elements have given class names
      `}
    />
  ))
  .add('for points with Location', () => (
    <MapContainerStoryWithNotes
      tooltipOptions={{
        marker: {
          includeLocation: true,
          text: 'a point is here',
        },
        className: 'class-for-styles-marker and-another points',
      }}
      points={points}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Markers have a text message and location
        <input type="checkbox" /> 3. tooltip elements have given class names
      `}
    />
  ))
  .add('for points without Location', () => (
    <MapContainerStoryWithNotes
      tooltipOptions={{
        marker: {
          includeLocation: false,
          text: 'a point is here',
        },
        className: 'class-for-styles-marker and-another points',
      }}
      points={points}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Markers have a text message and no location
        <input type="checkbox" /> 3. tooltip elements have given class names
      `}
    />
  ));
