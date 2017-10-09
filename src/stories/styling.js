import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import dpPoly from './dpPoly';

storiesOf('Styling', module)
  .add('polygon colors', () => (
    <MapContainerStoryWithNotes
      style={{ color: 'green', fillColor: 'green', fillOpacity: 0.21 }}
      polygons={[dpPoly.polyline]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Green polygon
      `}
    />
  ))
  .add('height', () => (
    <MapContainerStoryWithNotes
      height={ 600 }
      polygons={[dpPoly.polyline]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Map 200px taller than other examples
      `}
    />
  ))
  .add('zoom', () => (
    <MapContainerStoryWithNotes
      zoom={ 13 }
      polygons={[dpPoly.polyline]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Closer zoom than other examples
      `}
    />
  ))
  .add('center', () => (
    <MapContainerStoryWithNotes
      center={ [38.35, -85.74] }
      polygons={[dpPoly.polyline]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Centered farther north than other examples
      `}
    />
  ));
