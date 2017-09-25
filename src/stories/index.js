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
        <input type="checkbox" /> 1. Alert with state on component update />
      `}
    />
  ));

storiesOf('handleSubmit', module)
  .add('Do not show Submit button if handleSubmit prop not provided', () => (
    <MapContainerStoryWithNotes
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. No submit button/>
      `}
    />
  ))
  .add('Show Submit button if handleSubmit prop is provided', () => (
    <MapContainerStoryWithNotes
      handleSubmitpol={(state) => {
        alert(JSON.stringify(state, null, '  '));
      }}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Submit button
      `}
    />
  ))
  .add('Submit should be disabled if any polygon is too big', () => (
    <MapContainerStoryWithNotes
      polygons={[poly.tooBigPoly]}
      maxArea={{
        max: 1,
        units: 'miles',
      }}
      handleSubmitpol={(state) => {
        alert(JSON.stringify(state, null, '  '));
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
      polygons={poly.tooBigPolyArray}
      maxArea={{
        max: 1,
        units: 'miles',
      }}
      handleSubmitpol={(state) => {
        alert(JSON.stringify(state, null, '  '));
      }}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Submit button in disabled state
        <input type="checkbox" /> 2. No visual indication on any given polygon
        <input type="checkbox" /> 3. Resize or delete poly to enable submit
      `}
    />
  ));

