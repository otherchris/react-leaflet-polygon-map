import React from 'react';
import { expandPolys } from '../MapHelpers';
const googleObject = {
  map: {
    center: {
      lat: 38.25699840452126, lng: -85.75151560370483,
    },
    content: null,
    currentArea: 56909,
    maxAreaEach: 13333333,
    maxAreaAll: 33333333,
    scriptLoading: false,
    scriptLoadError: false,
    markers: [],
    polygons: [
      {
        id: 0,
        editable: false,
        path: [
          { lat: 38.25707078982852, lng: -85.74808716773987 },
          { lat: 38.25577337185174, lng: -85.74888110160828 },
          { lat: 38.257374079001885, lng: -85.75072646141052 },
          { lat: 38.257492024449654, lng: -85.74858069419861 },
        ],
        area: 22512.66109365669,
        options: { fillColor: '#caebba' },
      },
      {
        id: 1,
        editable: false,
        path: [
          { lat: 38.25659900415368, lng: -85.74780821800232 },
          { lat: 38.255453226190205, lng: -85.74800133705139 },
          { lat: 38.25503197974975, lng: -85.74619889259338 },
          { lat: 38.25653160595008, lng: -85.74516892433167 },
          { lat: 38.25691914476711, lng: -85.74705719947815 },
        ],
        area: 34396.05875596992,
        options: { fillColor: '#caebba' },
      },
    ],
    circles: [],
    rectangles: [],
    matchData: { matched: 268 },
    bounds: {
      south: 38.254470942994466,
      west: -85.75944421355285,
      north: 38.25952577813526,
      east: -85.74358699385681,
    },
  },
};

const googleResult = [
  {
    id: 0,
    editable: false,
    path: [
      { lat: 38.25707078982852, lng: -85.74808716773987 },
      { lat: 38.25577337185174, lng: -85.74888110160828 },
      { lat: 38.257374079001885, lng: -85.75072646141052 },
      { lat: 38.257492024449654, lng: -85.74858069419861 },
    ],
    area: 22512.66109365669,
    options: { fillColor: '#caebba' },
  },
  {
    id: 1,
    editable: false,
    path: [
      { lat: 38.25659900415368, lng: -85.74780821800232 },
      { lat: 38.255453226190205, lng: -85.74800133705139 },
      { lat: 38.25503197974975, lng: -85.74619889259338 },
      { lat: 38.25653160595008, lng: -85.74516892433167 },
      { lat: 38.25691914476711, lng: -85.74705719947815 },
    ],
    area: 34396.05875596992,
    options: { fillColor: '#caebba' },
  },
];

const FCObject = {
  type: 'FeatureCollection',
  features: ['one', 'two', 'three'],
};

const FCResult = ['one', 'two', 'three'];

test('expandPolys expands a Google map object', () => {
  expect(expandPolys(googleObject)).toEqual(googleResult);
});

test('expandPolys expands a feature collection', () => {
  expect(expandPolys(FCObject)).toEqual(FCResult);
});
