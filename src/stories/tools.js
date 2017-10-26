import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import points from './points';
import dpPoly from './dpPoly';

storiesOf('Edit tools', module)
  .add('with edit tools', () => (
    <MapContainerStoryWithNotes
      edit
      unit="miles"
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Edit tools in upper right
        <input type="checkbox" /> 2. Tools include polygon, edit, trash
      `}
    />
  ))
  .add('edit an existing polygon', () => (
    <MapContainerStoryWithNotes
      edit
      features={[dpPoly.wkt]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Clicking a polygon should make it editable
      `}
    />
  ));

storiesOf('Zips in a Radius', module)
  .add('With no center', () => (
    <MapContainerStoryWithNotes
      includeZipRadius
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Radius input, lower left
        <input type="checkbox" /> 2. Point edit tool
        <input type="checkbox" /> 3. Place a point, enter radius, and zips in
                                     that radius should be added as polygons
      `}
    />
  ));

storiesOf('Given location and radius', module)
  .add('location/radius tool', () => (
    <MapContainerStoryWithNotes
      includeCenterRadius
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Radius input, lower left
        <input type="checkbox" /> 2. Point edit tool
        <input type="checkbox" /> 3. Place a point, enter radius, and circle with
                                     given radius is added
      `}
    />
  ));
