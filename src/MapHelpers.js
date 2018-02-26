import L from 'leaflet';
import polyline from 'polyline';
import hasIn from 'lodash/hasIn';
import includes from 'lodash/includes';
import map from 'lodash/map';
import range from 'lodash/range';
import reverse from 'lodash/reverse';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import math from 'mathjs';
import addArea from './addArea';

const validLatlngObject = (c) => typeof c.lat === 'number' && typeof c.lng === 'number';
const validGeoJSONPoint = (c) => c.type === 'Point' && validCoordsArray(c.coordinates);
const validGeoJSONPointFeature = (c) => c.type === 'Feature' && validGeoJSONPoint(c.geometry);

const validCoordsArray = (arr) =>
  arr &&
  arr.length &&
  arr.length === 2 &&
  arr[0] < 180 &&
  arr[0] > -180 &&
  arr[1] < 90 &&
  arr[1] > -90;

export const makePoints = (arr) => map(arr, makePoint);

// input a geoJSON point geometry
export const makeCenterLeaflet = (c) => L.latLng(c.coordinates[1], c.coordinates[0]);

export const makePoint = (cee) => {
  const c = cloneDeep(cee);
  if (!c) return { type: 'Point', coordinates: [-85.751528, 38.257222] };
  if (validCoordsArray(c)) return { type: 'Point', coordinates: reverse(c) };
  if (validLatlngObject(c)) return { type: 'Point', coordinates: [c.lng, c.lat] };
  if (validGeoJSONPoint(c)) return c;
  if (validGeoJSONPointFeature(c)) return c.geometry;
  return { type: 'Point', coordinates: [-85.751528, 38.257222] };
};

export const generateIcon = (html) => new L.divIcon({
  className: 'my-div-icon',
  html: html,
});

export const indexByKey = (arr, key) => {
  let index = -1;
  map(arr, (val, ind) => {
    if (val.properties && (val.properties.key === key)) index = ind;
  });
  return index;
};

export const areaAccumulator = (sum, val) => sum + val.properties.area;

const radians = (deg) => (deg / 360) * 2 * Math.PI;

const rotatedPointsOrigin = (radius, sides) => {
  const z = new math.complex({ phi: 0, r: radius });
  const angle = (2 * Math.PI) / sides;
  return map(range(sides), (x) => {
    const i = math.complex(0, 1);
    const point = math.multiply(z, math.exp(math.multiply(x, angle, math.complex(0, 1))));
    return [math.re(point), math.im(point)];
  });
};

const translatePoints = (points, center) => map(
  points,
  (point) => [point[0] + center[0], point[1] + center[1]],
);

const scalePoints = (points, lat) => {
  const factor = math.cos(radians(lat)) * 69.172;
  return map(points, (x) => [x[0] / 69.172, x[1] / factor]);
};

export const generateCircleApprox = (radius, unit, center, sides) => {
  if (unit !== 'miles') radius /= 1609.34;
  const points = rotatedPointsOrigin(radius, sides);
  const scaledPoints = scalePoints(points, center[0]);
  const translatedPoints = translatePoints(scaledPoints, center);
  const reversedPoints = map(translatedPoints, (x) => reverse(x));
  return {
    type: 'Feature',
    properties: {
      radius,
      unit,
      center,
      sides,
    },
    geometry: {
      type: 'MultiPolygon',
      coordinates: [[reversedPoints]],
    },
  };
};

export const polygonArrayToProp = (polys) => map(polys, (poly) => {
  // Don't rechange polys coming from map edit
  if (poly.geometry.type === 'Polygon') {
    return poly;
  }
  // Can't do anything with a non-trivial MultiPolygon
  if (poly.geometry.coordinates[0].length > 1) {
    const p = poly.properties;
    p.noEdit = true;
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: flatten(poly.geometry.coordinates),
      },
      properties: p,
    };
  }
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: flatten(poly.geometry.coordinates),
    },
    properties: poly.properties,
  };
});
