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
export const ensureGeometryIsValid = geometry => {
  switch (geometry.type) {
  case 'Polygon':
  case 'LineString':
    geometry.coordinates = ensureShapeIsClosed(geometry.coordinates);
    return geometry;
  case 'MultiPolygon':
    geometry.coordinates = geometry.coordinates.map((poly) =>
      ensureShapeIsClosed(poly));
    return geometry;
  default:
    throw Error(`Ensure Geometry - invalid geometry type: ${geometry.type}`);
  }
};

export const convertPoly = (poly) => {
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
  case 'geoJSON': {
    return poly.data;
  }
  default:
    return poly.data;
  }
};
