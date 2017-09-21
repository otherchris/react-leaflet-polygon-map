import React from 'react';
import getArea from '../getArea';
import getAreaFixtures from './getAreaFixtures';
import geojsonArea from 'geojson-area';

// getArea from feature object with no properties
test('given feature object, expect to calculate area and insert in properties{}', () => {
  console.log(geojsonArea);
  const result1 = getArea(getAreaFixtures.featObj);
  console.log(result1);
  expect(result1).toEqual(getAreaFixtures.featObjArea);
});
// getArea from feature object with properties
test('given feature object with existing property, expect to calculate area and insert in properties{} without losing OG data', () => {
  const result2 = getArea(getAreaFixtures.featObj2);
  expect(result2).toEqual(getAreaFixtures.featObj2Area);
});
// getArea from feature object that already has area
test('given feature object that already has area in properties{}, expect to pass through', () => {
  const result3 = getArea(getAreaFixtures.circleFeatObj);
  expect(result3).toEqual(getAreaFixtures.circleFeatObjArea);
});
// getArea from multipoly feature object
test('given multipoly feature object, expect to calculate area and insert in properties{}', () => {
  const result4 = getArea(getAreaFixtures.multiPFeatObj);
  expect(result4).toEqual(getAreaFixtures.multiPFeatObjArea);
});
