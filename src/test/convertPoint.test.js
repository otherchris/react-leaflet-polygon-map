import React from 'react';
import convertPoint from '../convertPoint';

const feature = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [0, 1],
  },
};

test('convertPoint does not convert geoJSON feature', () => {
  expect(convertPoint({ type: 'Feature' })).toEqual({ type: 'Feature' });
});

test('convertPoint converts coordinates', () => {
  expect(convertPoint([1, 0])).toEqual(feature);
});

