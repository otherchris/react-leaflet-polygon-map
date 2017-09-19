import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import points from './points';
import dpPoly from './dpPoly';


storiesOf('Layout', module)
  .add('Default Layout', () => (
    <MapContainerStoryWithNotes
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Map with zoom tools
        <input type="checkbox" /> 2. No zip/radius tools
        <input type="checkbox" /> 3. No extra lower-right component
        <input type="checkbox" /> 4. No edit tools
      `}
    />
  ));
