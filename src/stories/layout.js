import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import points from './points';
import dpPoly from './dpPoly';

const DummyComponent = (props) => (
  <div style={{ backgroundColor: 'red', width: '100%', height: '100%' }}>
    A COMPONENT
  </div>
);

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
  ))
  .add('With legend component', () => (
    <MapContainerStoryWithNotes
      legendComponent={DummyComponent}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Red rectangle in the lower right
      `}
    />
  ));
