import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf, linkTo } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import map from 'lodash/map';
import MapContainerStoryWithNotes from './MapContainerStoryWithNotes';
import { makeGeoJSON } from '../ConvertPoly';
import poly from './poly';


storiesOf('Converted Polys', module)
  .add('Polyline', () => (
    <MapContainerStoryWithNotes
      polygons={[makeGeoJSON(poly.polyline)]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Polyline that has been run through ConvertPoly to become geoJSON Feature Obj.
        <input type="checkbox" /> 1. Polyline has been closed by ConvertPoly.
      `}
    />
  ))
  .add('wkt', () => (
    <MapContainerStoryWithNotes
      polygons={[makeGeoJSON(poly.wkt)]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. WKT polygon that has been run through ConvertPoly to become geoJSON Feature Obj.
      `}
    />
  ))
  .add('wkb', () => (
    <MapContainerStoryWithNotes
      polygons={[makeGeoJSON(poly.wkb)]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. WKB is not accepted. Should throw 'invalid poly type' error.
      `}
    />
  ))
  .add('Circle', () => (
    <MapContainerStoryWithNotes
      polygons={[makeGeoJSON(poly.circle)]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Circle that has been run through ConvertPoly to become geoJSON Feature Obj.
      `}
    />
  ))
  .add('Rectangle', () => (
    <MapContainerStoryWithNotes
      polygons={[makeGeoJSON(poly.rectangle)]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Rectangle that has been run through ConvertPoly to become geoJSON Feature Obj.
      `}
    />
  ))
  .add('GeoJSON', () => (
    <MapContainerStoryWithNotes
      polygons={[makeGeoJSON(poly.geoJSON)]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. GeoJSON polygon that has been run through ConvertPoly to become geoJSON Feature Obj.
      `}
    />
  ))
  .add('GeoJSON MultiPoly', () => (
    <MapContainerStoryWithNotes
      polygons={[makeGeoJSON(poly.geoJSONMultiPoly)]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. GeoJSON multipolygon that has been run through ConvertPoly to become geoJSON Feature Obj.
      `}
    />
  ))
  .add('FeatureColletion', () => (
    <MapContainerStoryWithNotes
      polygons={[makeGeoJSON(poly.FeatureCollection)]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. FeatureCollection that has been run through ConvertPoly to become geoJSON Feature Obj.
        <input type="checkbox" /> 2. Should throw error.
      `}
    />
  ))
  .add('Feature', () => (
    <MapContainerStoryWithNotes
      polygons={[makeGeoJSON(poly.Feature)]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. GeoJSON Feature that has been run through ConvertPoly.
        <input type="checkbox" /> 2. Should remain the same as input.
      `}
    />
  ))
  .add('GooglePoly', () => (
    <MapContainerStoryWithNotes
      polygons={[makeGeoJSON(poly.googlePoly)]}
      additionalNotes={`Should see \n
        <input type="checkbox" /> 1. Google Map Feature that has been run through ConvertPoly.
      `}
    />
  ));
