import consumeDrawnPoly from '../consumeDrawnPoly';

const input = {
  layerType: 'polygon',
  layer: {
    latlngs: [
      [
        {
          lat: 38.22091976683121,
          lng: -85.6432342529297,

        },
        {
          lat: 38.125374473531586,
          lng: -85.71189880371094,

        },
        {
          lat: 38.14373752548087,
          lng: -85.55946350097658,

        },
      ],
    ],
  },
}
test('function exists', () => {
  expect(consumeDrawnPoly).toBeDefined;
})
