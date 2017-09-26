import React from 'react';
// eslint-disable-next-line max-len
import { ensureShapeIsClosed, ensureGeometryIsValid, convertPoly, sizeArray, polyToMulti, makeGeoJSON } from '../ConvertPoly';
import poly from '../stories/poly.js';
import polyFixtures from './polyFixtures';
import ensureClosedFixtures from './ensureShapeIsClosedFixtures';
import ensureValidGeoFixtures from './ensureGeometryIsValidFixtures';
import sizeArrayFixtures from './sizeArrayFixtures';
import polyToMultiFixtures from './PolyToMultiFixtures';
import makeGeoJSONFixtures from './makeGeoJSONFixtures';
import dpPoly from '../stories/dpPoly.js';


// ensureShapeIsClosed
test('expect last coordinate to match first coordinate in shape array', () => {
  const result = ensureShapeIsClosed(ensureClosedFixtures.polylineFeatObj.geometry.coordinates);
  expect(result[0]).toEqual(result[47]);
});
test('given open shape, make sure it closes', () => {
  const result2 = ensureShapeIsClosed(ensureClosedFixtures.lineStringFeatObj.geometry.coordinates);
  expect(result2).toEqual(ensureClosedFixtures.lineStringFeatObj2.geometry.coordinates);
});

// ensureGeometryIsValid
test('expect open linestring to close', () => {
  const result3 = ensureGeometryIsValid(ensureValidGeoFixtures.lineStringFeatObj);
  expect(result3).toEqual(ensureValidGeoFixtures.closedLineStringFeatObj);
});
test('expect closed linestring to becom polygon', () => {
  const result4 = ensureGeometryIsValid(ensureValidGeoFixtures.polylineFeatObj);
  expect(result4).toEqual(ensureValidGeoFixtures.polylineToGONFeatObj);
});
test('expect polygon to pass', () => {
  const resultPoly = ensureGeometryIsValid(ensureValidGeoFixtures.geoJSONFeatObj);
  expect(resultPoly).toEqual(ensureValidGeoFixtures.geoJSONFeatObjCONTROL);
});
test('expect open polygon to close', () => {
  const resultPoly2 = ensureGeometryIsValid(ensureValidGeoFixtures.openGeoJSONFeatObj);
  expect(resultPoly2).toEqual(ensureValidGeoFixtures.geoJSONFeatObjCONTROL);
});
test('given multipoly, shapes will pass', () => {
  const result5 = ensureGeometryIsValid(ensureValidGeoFixtures.multipolyFeatObj);
  expect(result5).toEqual(ensureValidGeoFixtures.multipolyFeatObjCONTROL);
});
test('given open multipolys, shapes will be closed then pass', () => {
  const result6 = ensureGeometryIsValid(ensureValidGeoFixtures.openMultipolyFeatObj);
  expect(result6).toEqual(ensureValidGeoFixtures.multipolyFeatObjCONTROL);
});
test('given multipolys with one open one closed, open will close and closed will pass', () => {
  const result7 = ensureGeometryIsValid(ensureValidGeoFixtures.mixedMultipolyFeatObj);
  expect(result7).toEqual(ensureValidGeoFixtures.multipolyFeatObjCONTROL);
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
  expect(result8).toEqual(polyFixtures.polylineToFeatObj);
});
test('given wkt, return feature', () => {
  const result9 = convertPoly(poly.wkt);
  expect(result9).toEqual(polyFixtures.wktToFeatObj);
});
test('given wkb, throw error', () => {
  expect(() => convertPoly(poly.wkb)).toThrow('Ensure Geometry - invalid poly type: wkb');
});
test('given Circle, return feature', () => {
  const result11 = convertPoly(poly.circle);
  expect(result11).toEqual(polyFixtures.circleFeatObj);
});
test('given rectangle, return feature', () => {
  const result12 = convertPoly(poly.rectangle);
  expect(result12).toEqual(polyFixtures.rectangleFeatObj);
});
test('given geoJSON, wrapped like Alt Type, return Feature Object', () => {
  const result13 = convertPoly(poly.geoJSON);
  expect(result13).toEqual(polyFixtures.geoJSONFeatObjCONTROL);
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
  expect(result16).toEqual(polyFixtures.geoJSONFeatObjCONTROL);
});
// polyToMulti
test('given Feature geoJSON, return Feature Object', () => {
  const polyToMulti1 = polyToMulti(polyToMultiFixtures.gJPolygonFeatObj);
  expect(polyToMulti1).toEqual(polyToMultiFixtures.gJMULTIPolygonFeatObjCONTROL);
});
test('given MultiPoly Feature geoJSON, return as is', () => {
  const polyToMulti2 = polyToMulti(polyToMultiFixtures.geoJSONMultiPolyFeatObj);
  expect(polyToMulti2).toEqual(polyToMultiFixtures.geoJSONMultiPolyFeatObjCONTROL);
});
test('given wrong type of geoJSON, throw error', () => {
  expect(() => polyToMulti(polyToMultiFixtures.LinestringFeatObj)).toThrow('Ensure Geometry - invalid poly type: LineString');
});
// makeGeoJSON MULTIPOLY FEAT OBJs
test('given polygon, make geoJSON', () => {
  const result17 = makeGeoJSON(poly.polyline);
  expect(result17).toEqual(makeGeoJSONFixtures.polylineGeoJSON);
});
test('given geoJSON, make geoJSON', () => {
  const result18 = makeGeoJSON(poly.geoJSON);
  expect(result18).toEqual(makeGeoJSONFixtures.geoJSONGeoJSON);
});
test('given wkt, make geoJSON', () => {
  const result19 = makeGeoJSON(poly.wkt);
  expect(result19).toEqual(makeGeoJSONFixtures.wktGeoJSON);
});
test('given Circle, make geoJSON', () => {
  const result20 = makeGeoJSON(poly.circle);
  expect(result20).toEqual(makeGeoJSONFixtures.circleGeoJSON);
});
test('given Rectangle, make geoJSON', () => {
  const result21 = makeGeoJSON(poly.rectangle);
  expect(result21).toEqual(makeGeoJSONFixtures.rectangleGeoJSON);
test('given wkb, make geoJSON', () => {
  expect(() => makeGeoJSON(poly.wkb)).toThrowError('Ensure Geometry - invalid poly type: wkb');
});
test('given multipolygon geoJSON, make geoJSON', () => {
  const result22 = makeGeoJSON(poly.geoJSONMultiPoly);
  expect(result22).toEqual(makeGeoJSONFixtures.geoJSONMultiPoly);
});

// sizeArray
/* test('given Polygon gJ Feat Obj, return MultiPolygon gJ Feat Obj', () => {
 *   const sizeArray1 = sizeArray(sizeArrayFixtures.gJPolygonFeatObj);
 *   console.log('sizeArray1', JSON.stringify(sizeArray1));
 *   expect(sizeArray1).toEqual(sizeArrayFixtures.gJMULTIPolygonFeatObjCONTROL);
 * });
 * test('given Polygon gJ Feat Obj MISSING set of brackets, return MultiPolygon gJ Feat Obj', () => {
 *   const sizeArray3 = sizeArray(sizeArrayFixtures.jackedUpgJPolygonFeatObj);
 *   console.log('sizeArray1', JSON.stringify(sizeArray3));
 *   expect(sizeArray3).toEqual(sizeArrayFixtures.gJMULTIPolygonFeatObjCONTROL);
 * });
 * test('given MultiPolygon gJ Feat Obj, return MultiPolygon gJ Feat Obj', () => {
 *   const sizeArray2 = sizeArray(sizeArrayFixtures.geoJSONMultiPolyFeatObj);
 *   console.log('sizeArray1', JSON.stringify(sizeArray2));
 *   expect(sizeArray2).toEqual(sizeArrayFixtures.geoJSONMultiPolyFeatObjCONTROL);
 * }); */
