// convertpoly function takes polyline, geoJSON, wkt, wkb, circle paths,
// and rectangle paths and returns geoJSON
import wkx from 'wkx';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import polyline from 'polyline';

export const ensureShapeIsClosed = shape => {
  // console.log('SHAPE', shape);
  const last = shape.length - 1;
  if (!isEqual(shape[0], shape[last])) shape.push(shape[0]);
  return shape;
};
export const ensureGeometryIsValid = featObj => {
  switch (featObj.geometry.type) {
  case 'Polygon':
    featObj.geometry.coordinates = ensureShapeIsClosed(featObj.geometry.coordinates);
  case 'LineString':
    featObj.geometry.type = 'Polygon';
    featObj.geometry.coordinates = [ensureShapeIsClosed(featObj.geometry.coordinates)];
    return featObj;
  case 'MultiPolygon':
    const data = featObj.geometry.coordinates;
    map((data), function (poly) {
      map((poly), function (shape) {
        ensureShapeIsClosed(shape);
      });
    });
    return featObj;
  default:
    throw Error(`Ensure Geometry - invalid geometry type: ${featObj.geometry.type}`);
  }
};

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
export const featCollWrap = (featObj) => {
  return {
    type: 'FeatureCollection',
    features: [featObj],
  }
};
export const makeGeoJSON = poly => {
  const featObj = convertPoly(poly);
  const validatedObj = ensureGeometryIsValid(featObj);
  const convertedGeoJSON = featCollWrap(validatedObj);
  return convertedGeoJSON;
};
