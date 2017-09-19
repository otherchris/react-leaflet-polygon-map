import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import points from './points';
import dpPoly from './dpPoly';

storiesOf('Edit tools', module)
  .add('without edit tools (default)', () => (
    <MapContainerStoryWithNotes />
  ))
  .add('with edit tools', () => (
    <MapContainerStoryWithNotes edit />
  ));

storiesOf('Zips in a Radius', module)
  .add('With no center', () => (
    <MapContainerStoryWithNotes
      includeZipRadius
    />
  ))
  .add('With center provided', () => (
    <MapContainerStoryWithNotes
      includeZipRadius
      center="a given center"
    />
  ));
