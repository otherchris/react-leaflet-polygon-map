const point_1 = {
  type: "Feature",
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [-85.7365740807634, 38.198252],
  },
}

const point_2 = {
  type: "Feature",
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [-85.8365740807634, 38.098252],
  },
}

const large = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "MultiPolygon",
    "coordinates": [
      [
        [
          [
              -112.35305786132812,
            36.07352228885536
            ],
          [
              -112.01179504394531,
            36.07352228885536
            ],
          [
              -112.01179504394531,
            36.33172177145511
            ],
          [
              -112.35305786132812,
            36.33172177145511
            ],
          [
              -112.35305786132812,
            36.07352228885536
            ]
        ]
        ]
    ]
  }
};


const points = [point_1, point_2];
const features = [large];

export default { points, features };
