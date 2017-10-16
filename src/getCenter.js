import reduce from 'lodash/reduce';
import map from 'lodash/map';
import min from 'lodash/min';
import max from 'lodash/max';
import L from 'leaflet';

const getCoords = (arr) => {
  if (typeof arr[0][1] === 'number') return arr;
  return getCoords(arr[0]);
};

const radians = (deg) => (deg / 360) * 2 * Math.PI;

const getCenter = (polygons) => {
  if (polygons.length === 0) return [35, -83];
  let coords = [];
  map(polygons, (poly) => {
    coords = coords.concat(getCoords(poly.geometry.coordinates));
  });
  console.log(coords);
  const lats = [];
  const longs = [];
  map(coords, (coord) => {
    lats.push(coord[1]);
    longs.push(coord[0]);
  });
  console.log('bounds', [[max(lats), max(longs)], [min(lats), min(longs)]]);
  const c1 = L.latLng(max(lats), max(longs));
  const c2 = L.latLng(min(lats), min(longs));
  return L.latLngBounds(c1, c2);
};

export default getCenter;

