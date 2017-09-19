import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import dpPoly from './dpPoly';
import '../main.css';

storiesOf('Styling', module)
  .add('polygon colors', () => (
    <MapContainerStoryWithNotes
      style={{ color: 'green', fillColor: 'green', fillOpacity: 0.21 }}
      polygons={[dpPoly.polyline]}
    />
  ))
  .add('height', () => (
    <MapContainerStoryWithNotes
      height={ 600 }
      polygons={[dpPoly.polyline]}
    />
  ))
  .add('zoom', () => (
    <MapContainerStoryWithNotes
      zoom={ 13 }
      polygons={[dpPoly.polyline]}
    />
  ))
  .add('center', () => (
    <MapContainerStoryWithNotes
      center={ [38.35, -85.74] }
      polygons={[dpPoly.polyline]}
    />
  ));
