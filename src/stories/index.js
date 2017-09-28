import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import points from './points';
import dpPoly from './dpPoly';
import poly from './poly';
import '../main.css';
import './layout';
import './polygons';
import './styling';
import './tools';

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
  ));
