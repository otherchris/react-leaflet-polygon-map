import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import 'leaflet-draw/dist/leaflet.draw.css';
import MapContainer from '../MapContainer';
import points from './points';
import dpPoly from './dpPoly';

storiesOf('Edit tools', module)
  .add('without edit tools (default)', () => (
    <MapContainer />
  ))
  .add('with edit tools', () => (
    <MapContainer edit />
  ));

storiesOf('Zips in a Radius', module)
  .add('With no center', () => (
    <MapContainer
      includeZipRadius
    />
  ))
  .add('With center provided', () => (
    <MapContainer
      includeZipRadius
      center="a given center"
    />
  ));
