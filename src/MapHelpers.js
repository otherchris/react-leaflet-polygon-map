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
import logoDefault from './logoDefault';
import getArea from './getArea';

export const cleanPoly = (poly) => {
  let p = cloneDeep(poly);
  p = getArea(p);
  if (p.geometry.type === 'Polygon') {
    p.geometry.type = 'MultiPolygon';
    p.geometry.coordinates = [p.geometry.coordinates];
  }
  return p;
};

export const generateIcon = (html) => new L.divIcon({
  className: 'my-div-icon',
  html: html || logoDefault,
});

export const expandFeatures = (obj) => {
  if (obj && obj.length) return obj;
  if (obj && obj.map && obj.map.polygons) {
    return obj.map.polygons;
  }
  if (obj && obj.type === 'FeatureCollection') {
    return obj.features;
  }
  return [obj];
};

export const indexByKey = (arr, key) => {
  let index = -1;
  map(arr, (val, ind) => {
    if (val.properties && (val.properties.key === key)) index = ind;
  });
  return index;
};

export const areaAccumulator = (sum, val) => sum + val.properties.area;
export const area = (unit, _area) => {
  const result = _area;
  return result;
};

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
