import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import points from './points';
import dpPoly from './dpPoly';
import '../main.css';
import './polygons';
import './styling';
import './tools';

storiesOf('Tilesets', module)
  .add('tiles = minimal_light', () => (
    <MapContainerStoryWithNotes
      polygons={[dpPoly.polyline]}
      points={points}
      tiles="minimal_light"
    />
  ))
  .add('tiles = minimal_dark', () => (
    <MapContainerStoryWithNotes
      polygons={[dpPoly.polyline]}
      points={points} tiles="minimal_dark"
    />
  ))
  .add('tiles = default', () => (
    <MapContainerStoryWithNotes
      polygons={[dpPoly.polyline]}
      points={points}
    />
  ));

