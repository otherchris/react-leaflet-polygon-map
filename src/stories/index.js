import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import points from './points';
import dpPoly from './dpPoly';
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

