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
  case 'Polygon': {
    featObj.geometry.coordinates = ensureShapeIsClosed(featObj.geometry.coordinates);
    return featObj;
  }
  case 'LineString': {
    featObj.geometry.type = 'Polygon';
    featObj.geometry.coordinates = [ensureShapeIsClosed(featObj.geometry.coordinates)];
    return featObj;
  }
  case 'MultiPolygon': {
    const data = featObj.geometry.coordinates;
    map((data), function (poly) {
      map((poly), function (shape) {
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
  const area = poly.data.area;
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
  case 'wkb': {
    const buf = Buffer.from(poly.data, 'base64');
    return {
      type: 'Feature',
      properties: {},
      geometry: wkx.Geometry.parse(buf).toGeoJSON(poly.data),
    };
  }
  case 'Circle': {
    const circleCoords = map(poly.data.path, (x) => [x.lng, x.lat]);
    const center = poly.data.center;
    const radius = poly.data.radius;
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
    const rectCoords = map(poly.data.path, (x) => [x.lng, x.lat]);
    const bounds = poly.data.bounds;
    return {
      type: 'Feature',
      properties: { bounds: bounds || '', area: area || '' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          rectCoords,
        ],
      },
    };
  }
  case 'MultiPolygon':
  case 'geoJSON': {
    return poly.data.features[0];
  }
  default:
    throw Error(`Ensure Geometry - invalid poly type: ${poly.type}`);
  }
};
// Given geoJSON Feature Obj
// Returns geoJSON Feature Collection
export const featCollWrap = (featObj) =>
  ({
    type: 'FeatureCollection',
    features: [featObj],
  });
// Given geoJSON Feature Collection
// Returns that same object with the coordinates array properly nested
// (code above is kind of janky so it's wrapped one too many times)
export const sizeArray = geoJSONObj => {
  const { properties } = geoJSONObj.features[0];
  switch (geoJSONObj.features[0].geometry.type) {
  case 'Polygon': {
    const { type, coordinates } = geoJSONObj.features[0].geometry;
    const coordSize = size(coordinates[0]);
    if (coordSize === 1) {
      const flatterArray = flatten(coordinates);
      const newFeature = {
        type: 'Feature',
        properties,
        geometry: {
          type,
          coordinates: flatterArray,
        },
      };
      return sizeArray(featCollWrap(newFeature));
    }
    return geoJSONObj;
  }
  case 'MultiPolygon': {
    const { type, coordinates } = geoJSONObj.features[0].geometry;
    const coordSize = size(coordinates[1]);
    if (coordSize === 1) {
      const flatterArray = flatten(coordinates);
      const newFeature = {
        type: 'Feature',
        properties,
        geometry: {
          type,
          coordinates: flatterArray,
        },
      };
      return sizeArray(featCollWrap(newFeature));
    }
    return geoJSONObj;
  }
  default:
    throw Error(`Ensure Geometry - invalid geometry type: ${geoJSONObj.features.geometry.type}`);
  }
};
// Given one of our specified poly types, runs it through the series of
// functions above
// Returns valid geoJSON Feature Collection
export const makeGeoJSON = poly => {
  const featObj = convertPoly(poly);
  const validatedObj = ensureGeometryIsValid(featObj);
  const convertedGeoJSON = featCollWrap(validatedObj);
  const resizedArray = sizeArray(convertedGeoJSON);
  return resizedArray;
};
