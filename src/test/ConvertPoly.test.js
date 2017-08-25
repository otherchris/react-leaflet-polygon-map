import React from 'react';
import convertPoly from '../ConvertPoly';
import poly from '../stories/poly.js';
import polyFixtures from './polyFixtures';

test('expect type geoJSON to be geoJSON', () => {
  expect(convertPoly(poly.geoJSON.data)).toEqual(polyFixtures.geoJSON);
//     {
//     type: 'FeatureCollection',
//     features: expect.arrayContaining([expect.objectContaining({
//       type: expect.any(String),
//       properties: expect.any(Object),
//       geometry: expect.objectContaining({
//         type: expect.any(String),
//         coordinates: expect.arrayContaining(Array),
//       })
//     })])
//   })
});

    // features.type: expect.toBe("Feature"),
    // features.properties: expect.any(Object),
    // features.geometry: expect.any(Object),
    // features.geometry.type: expect.toBe("Polygon"),
    // features.geometry.coordinates: expect.any(Array),

//   expect(poly.geoJSON).toBeInstanceOf(Object);
//   expect(poly.geoJSON.data.type).toBe('FeatureCollection');
//   expect(poly.geoJSON.data.features.geometry.coordinates).toBe(Array);



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
