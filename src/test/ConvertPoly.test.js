import React from 'react';
// eslint-disable-next-line max-len
import { ensureShapeIsClosed, ensureGeometryIsValid, mkFeatureObj, geoJSONWrapper, convertPoly } from '../ConvertPoly';
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
  expect(result2).toEqual(polyFixtures.closedLineStringFeatObj.geometry.coordinates);
});

// ensureGeometryIsValid
test('expect open linestring to close', () => {
  const result3 = ensureGeometryIsValid(polyFixtures.lineStringFeatObj.geometry);
  expect(result3).toEqual(polyFixtures.closedLineStringFeatObj.geometry);
});
test('expect closed shape to pass through', () => {
  const result4 = ensureGeometryIsValid(polyFixtures.polylineFeatObj.geometry);
  expect(result4).toEqual(polyFixtures.polylineFeatObj.geometry);
});
test('given multipoly, shapes will pass', () => {
  const result5 = ensureGeometryIsValid(polyFixtures.multipolyFeatObj.geometry);
  expect(result5).toEqual(polyFixtures.multipolyFeatObj2.geometry);
});
test('given open multipolys, shapes will be closed then pass', () => {
  const result6 = ensureGeometryIsValid(polyFixtures.openMultipolyFeatObj.geometry);
  expect(result6).toEqual(polyFixtures.multipolyFeatObj3.geometry);
});
test('given multipolys with one open one closed, open will close and closed will pass', () => {
  const result7 = ensureGeometryIsValid(polyFixtures.mixedMultipolyFeatObj.geometry);
  expect(result7).toEqual(polyFixtures.multipolyFeatObj4.geometry);
});
// make test for wrong "type"
// make test to fail for only 1 or 2 points
// test('expect Error to be thrown', () => {
// NOTE use .toThrow for this
// });
     
// Create Geometry
test('lets see what convert poly does', () => {
  const result8 = convertPoly(poly.polyline);
  console.log('heres what it is', result8);
  expect(result8).toEqual(polyFixtures.multiPolyFeatObj);
});

// mkFeatureObj Tests
// test('expect type geoJSON to be geoJSONFeatureObj', () => {
//   expect(mkFeatureObj(poly.geoJSON)).toEqual(polyFixtures.geoJSONFeatureObj);
// });
// test('expet type polyline to be geoJSONFeatureObj', () => {
//   expect(mkFeatureObj(poly.polyline)).toEqual(polyFixtures.polylineFeatureObj);
// });
// test('expect type wkt to be geoJSONFeatureObj', () => {
//   expect(mkFeatureObj(poly.wkt)).toEqual(polyFixtures.wktFeatureObj);
// });
// test('expet type wkb to be geoJSONFeatureObj', () => {
//   expect(mkFeatureObj(poly.wkb)).toEqual(polyFixtures.wkbFeatureObj);
// });
// test('expect type circle to be geoJSONFeatureObj', () => {
//   console.log()
//   expect(mkFeatureObj(poly.circle)).toEqual(polyFixtures.circleFeatureObj);
// });
// test('expet type rectangle to be geoJSONFeatureObj', () => {
//   expect(mkFeatureObj(poly.rectangle)).toEqual(polyFixtures.rectangleFeatureObj);
// });
// // geoJSONWrapper Tests
// test('expect geoJSONFeatureObj to be geoJSONGeoJSON', () => {
//   expect(geoJSONWrapper(poly.geoJSON)).toEqual(polyFixtures.geoJSONFeatureObj);
// });
// test('expet polylineFeatureObj to be polylineGeoJSON', () => {
//   expect(geoJSONWrapper(poly.polyline)).toEqual(polyFixtures.polylineFeatureObj);
// });
// test('expect wktFeatureObj to be wktGeoJSON', () => {
//   expect(geoJSONWrapper(poly.wkt)).toEqual(polyFixtures.wktFeatureObj);
// });
// test('expet wkbFeatureObj to be wkbGeoJSON', () => {
//   expect(geoJSONWrapper(poly.wkb)).toEqual(polyFixtures.wkbFeatureObj);
// });
// test('expect circleFeatureObj to be circleGeoJSON', () => {
//   expect(geoJSONWrapper(poly.circle)).toEqual(polyFixtures.circleFeatureObj);
// });
// test('expet type rectangle to be rectangleGeoJSON', () => {
//   expect(geoJSONWrapper(poly.rectangle)).toEqual(polyFixtures.rectangleFeatureObj);
// });


// create fixture
// take fixture
// look at poly.**(the type)
// compare the two
// make sure they are both objects with the same keys


// {
//   "type": "FeatureCollection",
//   "features": [
//       {
//             "type": "Feature",
//             "geometry": {
//                     "type": "Point",
//                     "coordinates": [0, 0]
//                   },
//             "properties": {
//                     "name": "null island"
//                   }
//           }
//     ]
// }
