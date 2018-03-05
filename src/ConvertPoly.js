// convertpoly function takes polyline, geoJSON, wkt, wkb, circle paths,
// and rectangle paths
// and returns geoJSON
// in the form of 'FeatureCollection' objects
// Original Circle and Rectangle dat is saved in object.features.properties
// see https://tools.ietf.org/html/rfc7946 for geoJSONFORMAT
import map from 'lodash/map';
import size from 'lodash/size';
import flatten from 'lodash/flatten';
import isEqual from 'lodash/isEqual';
import rewind from 'geojson-rewind';
import getArea from './getArea';
import { generateCircleApprox } from './MapHelpers';

// given set of coordinates, checks to see if last set is equal to first set
// (read: makes sure it's closed)
// if not, closes shape by adding first set to end of coordinate array
const ensureShapeIsClosed = shape => {
  const last = shape.length - 1;
  if (!isEqual(shape[0], shape[last])) shape.push(shape[0]);
  return shape;
};
// given geoJSON FEATURE OBJ, calls ensureShapeIsClosed() to check coord
// validity
const ensureGeometryIsValid = featObj => {
  switch (featObj.geometry.type) {
  case 'LineString': {
    featObj.geometry.type = 'Polygon';
    featObj.geometry.coordinates = [ensureShapeIsClosed(featObj.geometry.coordinates)];
    return featObj;
  }
  case 'Polygon': {
    const poly = featObj.geometry.coordinates;
    map((poly), (shape) => {
      ensureShapeIsClosed(shape);
    });
    return featObj;
  }
  case 'MultiPolygon': {
    const data = featObj.geometry.coordinates;
    map((data), (poly) => {
      map((poly), (shape) => {
        ensureShapeIsClosed(shape);
      });
    });
    return featObj;
  }
  default:
    throw Error(`Ensure Geometry - invalid geometry type: ${featObj.geometry.type}`);
  }
};

// Given geoJSON Feature Obj
// Returns geoJSON Feature Collection
/* export const featCollWrap = (featObj) =>
 *   ({
 *     type: 'FeatureCollection',
 *     features: [featObj],
 *   }); */
// Given geoJSON Feature
// Returns Polygons as MultiPolys,
// Multipolys pass through
// Everything else is error
const polyToMulti = geoJSONObj => {
  const { properties } = geoJSONObj;
  const { type, coordinates } = geoJSONObj.geometry;
  switch (type) {
  case 'Polygon': {
    const newFeature = {
      type: 'Feature',
      properties,
      geometry: {
        type: 'MultiPolygon',
        coordinates: [coordinates],
      },
    };
    return newFeature;
  }
  case 'MultiPolygon': {
    return geoJSONObj;
  }
  default:
    throw Error(`Ensure Geometry - invalid poly type: ${type}`);
  }
};

// Given one of our specified poly types, runs it through the series of
// functions above
// Returns valid geoJSON Feature
const makeGeoJSON = poly => {
  const validatedObj = ensureGeometryIsValid(poly);
  const resizedArray = polyToMulti(validatedObj);
  const woundCoords = rewind(resizedArray, false);
  const resizedWithArea = getArea(woundCoords);
  return resizedWithArea;
};

export default makeGeoJSON;
