import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import points from './points';
import dpPoly from './dpPoly';

const DummyComponent = (props) => (
  <div style={{ backgroundColor: 'red', width: '100%', height: '100%' }}>
    Props are {JSON.stringify(props, null, ' ')}
  </div>
);

storiesOf('Legend', module)
  .add('With legend component', () => (
    <MapContainerStoryWithNotes
      legendComponent={DummyComponent}
      legendProps={{ aProp: 'a value' }}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Red rectangle in the lower right
      `}
    />
  ));
