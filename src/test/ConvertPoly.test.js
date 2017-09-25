import React from 'react';
// eslint-disable-next-line max-len
import { ensureShapeIsClosed, ensureGeometryIsValid, convertPoly, makeGeoJSON } from '../ConvertPoly';
import poly from '../stories/poly.js';
import polyFixtures from './polyFixtures';
import dpPoly from '../stories/dpPoly.js';


// ensureShapeIsClosed
test('expect last coordinate to match first coordinate in shape array', () => {
  const result = ensureShapeIsClosed(polyFixtures.polylineFeatObj.geometry.coordinates);
  expect(result[0]).toEqual(result[47]);
});
test('given open shape, make sure it closes', () => {
  const result2 = ensureShapeIsClosed(polyFixtures.lineStringFeatObj.geometry.coordinates);
  expect(result2).toEqual(polyFixtures.lineStringFeatObj2.geometry.coordinates);
});

// ensureGeometryIsValid
test('expect open linestring to close', () => {
  const result3 = ensureGeometryIsValid(polyFixtures.lineStringFeatObj);
  expect(result3).toEqual(polyFixtures.closedLineStringFeatObj);
});
test('expect closed shape to pass through', () => {
  const result4 = ensureGeometryIsValid(polyFixtures.polylineFeatObj);
  expect(result4).toEqual(polyFixtures.polylineFeatObj);
});
test('given multipoly, shapes will pass', () => {
  const result5 = ensureGeometryIsValid(polyFixtures.multipolyFeatObj);
  expect(result5).toEqual(polyFixtures.multipolyFeatObj2);
});
test('given open multipolys, shapes will be closed then pass', () => {
  const result6 = ensureGeometryIsValid(polyFixtures.openMultipolyFeatObj);
  expect(result6).toEqual(polyFixtures.multipolyFeatObj3);
});
test('given multipolys with one open one closed, open will close and closed will pass', () => {
  const result7 = ensureGeometryIsValid(polyFixtures.mixedMultipolyFeatObj);
  expect(result7).toEqual(polyFixtures.multipolyFeatObj4);
});
// make test for wrong "type"
// make test to fail for only 1 or 2 points
// test('expect Error to be thrown', () => {
// NOTE use .toThrow for this
// });
     
// Convert Poly
// Create Feature Objects
test('given polyline, return feature', () => {
  const result8 = convertPoly(poly.polyline);
  expect(result8).toEqual(polyFixtures.polylineFeatObj2);
});
test('given wkt, return feature', () => {
  const result9 = convertPoly(poly.wkt);
  expect(result9).toEqual(polyFixtures.wktFeatObj);
});
test('given wkb, return feature', () => {
  const result10 = convertPoly(poly.wkb);
  expect(result10).toEqual(polyFixtures.wkbFeatObj);
});
test('given Circle, return feature', () => {
  const result11 = convertPoly(poly.circle);
  expect(result11).toEqual(polyFixtures.circleFeatObj);
});
test('given rectangle, return feature', () => {
  const result12 = convertPoly(poly.rectangle);
  expect(result12).toEqual(polyFixtures.rectangleFeatObj);
});
test('given geoJSON, return Feature Object', () => {
  const result13 = convertPoly(poly.geoJSON);
  expect(result13).toEqual(polyFixtures.geoJSONFeatObj);
});
test('given multipolugon geoJSON, return Feature Object', () => {
  const result14 = convertPoly(poly.geoJSONMultiPoly);
  expect(result14).toEqual(polyFixtures.geoJSONMultiPolyFeatObj);
});
test('given FeatureCollection geoJSON, throw error', () => {
  expect(() => convertPoly(poly.FeatureCollection)).toThrow('Ensure Geometry - invalid poly type: FeatureCollection');
});
test('given Feature geoJSON, return Feature Object', () => {
  const result16 = convertPoly(poly.Feature);
  expect(result16).toEqual(polyFixtures.geoJSONFeatureObject);
});
// makeGeoJSON
test('given polygon, make geoJSON', () => {
  const result15 = makeGeoJSON(poly.polyline);
  expect(result15).toEqual(polyFixtures.polylineGeoJSON);
});
test('given geoJSON, make geoJSON', () => {
  const result16 = makeGeoJSON(poly.geoJSON);
  expect(result16).toEqual(polyFixtures.geoJSONGeoJSON);
});
test('given wkt, make geoJSON', () => {
  const result17 = makeGeoJSON(poly.wkt);
  expect(result17).toEqual(polyFixtures.wktGeoJSON);
});
test('given wkb, make geoJSON', () => {
  const result18 = makeGeoJSON(poly.wkb);
  expect(result18).toEqual(polyFixtures.wkbGeoJSON);
});
test('given multipolygon geoJSON, make geoJSON', () => {
  const result19 = makeGeoJSON(poly.geoJSONMultiPoly);
  expect(result19).toEqual(polyFixtures.geoJSONMultiPoly);
});
