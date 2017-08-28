import React from 'react';
import { mkFeatureObj, geoJSONWrapper } from '../ConvertPoly';
import poly from '../stories/poly.js';
import polyFixtures from './polyFixtures';

// mkFeatureObj Tests
// test('expect type geoJSON to be geoJSONFeatureObj', () => {
//   expect(mkFeatureObj(poly.geoJSON)).toEqual(polyFixtures.geoJSONFeatureObj);
// });
test('expet type polyline to be geoJSONFeatureObj', () => {
  expect(mkFeatureObj(poly.polyline)).toEqual(polyFixtures.polylineFeatureObj);
});
test('expect type wkt to be geoJSONFeatureObj', () => {
  expect(mkFeatureObj(poly.wkt)).toEqual(polyFixtures.wktFeatureObj);
});
test('expet type wkb to be geoJSONFeatureObj', () => {
  expect(mkFeatureObj(poly.wkb)).toEqual(polyFixtures.wkbFeatureObj);
});
test('expect type circle to be geoJSONFeatureObj', () => {
  expect(mkFeatureObj(poly.circle)).toEqual(polyFixtures.circleFeatureObj);
});
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
