import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import MapExample from '../src/MapExample';
import MapContainer from '../src/MapContainer';

storiesOf('MapExample', module)
  .add('makes a map with no props', () => (
    <MapExample />
  ));

/*
storiesOf('MapContainer', module)
  .add('makes a map with no props', () => (
    <MapContainer polys={[]} />
  ));
  */
