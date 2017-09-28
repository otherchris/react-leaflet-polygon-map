// convertpoly function takes polyline, geoJSON, wkt, wkb, circle paths,
// and rectangle paths
// and returns geoJSON
// in the form of 'FeatureCollection' objects
// Original Circle and Rectangle dat is saved in object.features.properties
// see https://tools.ietf.org/html/rfc7946 for geoJSONFORMAT
import wkx from 'wkx';
import map from 'lodash/map';
import size from 'lodash/size';
import flatten from 'lodash/flatten';
import isEqual from 'lodash/isEqual';
import polyline from 'polyline';
import rewind from 'geojson-rewind';
import getArea from './getArea';


export const translateGooglePoly = (gPoly) => {
  const coords = map(gPoly.path, (coord) => [coord.lng, coord.lat]);
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [[coords]],
    },
  };
};

// given set of coordinates, checks to see if last set is equal to first set
// (read: makes sure it's closed)
// if not, closes shape by adding first set to end of coordinate array
export const ensureShapeIsClosed = shape => {
  const last = shape.length - 1;
  if (!isEqual(shape[0], shape[last])) shape.push(shape[0]);
  return shape;
};
// given geoJSON FEATURE OBJ, calls ensureShapeIsClosed() to check coord
// validity
export const ensureGeometryIsValid = featObj => {
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
// given different poly types: polyline, geoJSON (both poly and multipoly),
// wkt, wkb, circle (center/radius), rectangle (bounds/path)
// Returns as geoJSON Feature Objects
export const convertPoly = poly => {
  if (typeof poly.id === 'number') {
    return translateGooglePoly(poly);
  }
  switch (poly.type) {
  case 'polyline': {
    return {
      type: 'Feature',
      properties: {},
      geometry: polyline.toGeoJSON(poly.data),
    };
  }
  case 'wkt': {
    return {
      type: 'Feature',
      properties: {},
      geometry: wkx.Geometry.parse(poly.data).toGeoJSON(),
    };
  }
  case 'Circle': {
    const circleCoords = map(poly.data.path, (x) => [x.lng, x.lat]);
    const center = poly.data.center;
    const radius = poly.data.radius;
    const area = poly.data ? poly.data.area : null;
    return {
      type: 'Feature',
      properties: { center: center || '', radius: radius || '', area: area || '' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          circleCoords,
        ],
      },
    };
  }
  case 'Rectangle': {
    const bounds = poly.data.bounds;
    const rectCoords = [
      [bounds.north, bounds.west],
      [bounds.south, bounds.west],
      [bounds.south, bounds.east],
      [bounds.north, bounds.east],
    ];
    const area = poly.data ? poly.data.area : null;
    return {
      type: 'Feature',
      properties: { bounds: bounds || '', area: area || '' },
      geometry: {
        type: 'Polygon',
        coordinates: [rectCoords],
      },
    };
  }
  case 'Feature': {
    return poly;
  }
  case 'geoJSON': {
    return {
      type: poly.data.type,
      properties: poly.data.properties,
      geometry: poly.data.geometry,
    };
  }
  default:
    throw Error(`Ensure Geometry - invalid poly type: ${poly.type}`);
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
export const polyToMulti = geoJSONObj => {
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


// Given geoJSON feature
// Returns that same object with the coordinates array properly nested
/* export const sizeArray = geoJSONObj => {
 *   const { properties } = geoJSONObj;
 *   const { type, coordinates } = geoJSONObj.geometry;
 *   switch (type) {
 *   case 'Polygon': {
 *     const coordSize = coordinates.length;
 *     console.log('coord size', coordSize);
 *     if (coordSize === 1) {
 *       const flatterArray = flatten(coordinates);
 *       const newFeature = {
 *         type: 'Feature',
 *         properties,
 *         geometry: {
 *           type: 'Polygon',
 *           coordinates: flatterArray,
 *         },
 *       };
 *       return sizeArray(newFeature);
 *     }
 *     return geoJSONObj;
 *   }
 *   case 'MultiPolygon': {
 *     const coordSize = size(coordinates[0][0]);
 *     if (coordSize === 1) {
 *       const flatterArray = flatten(coordinates);
 *       const newFeature = {
 *         type: 'Feature',
 *         properties,
 *         geometry: {
 *           type: 'MultiPolygon',
 *           coordinates: flatterArray,
 *         },
 *       };
 *       return sizeArray(newFeature);
 *     }
 *     return geoJSONObj;
 *   }
 *   default:
 *     throw Error(`Ensure Geometry - invalid geometry type: ${geoJSONObj.geometry.type}`);
 *   }
 * }; */
// Given one of our specified poly types, runs it through the series of
// functions above
// Returns valid geoJSON Feature
export const makeGeoJSON = poly => {
  const featObj = convertPoly(poly);
  const validatedObj = ensureGeometryIsValid(featObj);
  const resizedArray = polyToMulti(validatedObj);
  const woundCoords = rewind(resizedArray, false);
  const resizedWithArea = getArea(woundCoords);
  return resizedWithArea;
};
