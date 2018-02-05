import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import { addressPoints } from './realworld.10000.js';

storiesOf('Heatmap', module)
  .add('one should exist', () => (
    <MapContainerStoryWithNotes
      heatmap={addressPoints}
    />
  ));
