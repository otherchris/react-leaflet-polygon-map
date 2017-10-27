import reduce from 'lodash/reduce';
import map from 'lodash/map';
import min from 'lodash/min';
import max from 'lodash/max';
import flatten from 'lodash/flatten';
import L from 'leaflet';

const getCoords = (arr) => {
  if (!arr || !arr.length) return [];
  if (arr.length === 2 && typeof arr[1] === 'number') return [arr];
  if (arr[0].length && typeof arr[0][1] === 'number') return arr;
  if (arr[0][0].length && typeof arr[0][0][1] === 'number') return getCoords(flatten(arr));
  if (arr[0][0][0].length && typeof arr[0][0][0][1] === 'number') return getCoords(flatten(arr));
  return arr;
};

const getCenter = (polygons, points) => {
  console.log(polygons);
  if (polygons.length === 0 && points.length === 0) return [35, -83];
  let coords = [];
  map(polygons, (poly) => {
    coords = coords.concat(getCoords(poly.geometry.coordinates));
  });
  map(points, (point) => {
    coords.push(point.geometry.coordinates);
  });
  console.log('coords', coords);
  const lats = [];
  const longs = [];
  map(coords, (coord) => {
    lats.push(coord[1]);
    longs.push(coord[0]);
  });
  console.log([max(lats), min(lats), max(longs), min(longs)]);
  const c1 = L.latLng(max(lats), max(longs));
  const c2 = L.latLng(min(lats), min(longs));
  return L.latLngBounds(c1, c2);
};

export default getCenter;

