# react-leaflet-polygon-map

A react component providing a multipurpose leaflet map with excellent support
for polygons.

## Supported React versions

???


## API

This package exports the `MapContainer` component that accepts the following
props:

### `apikey (string)`

Google location API for location search.

### `center (array/object)`

Initial center of the map. Can be provided as an array `[ <lat>, <lng> ]` ro an
object `{ lat: <lat>, lng: <lng }`.

### `edit (bool)`

Enable the draw layer on the map. Required for creating new polygons/points and
editing/removing existing polygons/points

### `handleSubmit (func)`

Callback triggered by submit button. If not present, submit button is not
rendered.

### `height (number)`

Pixel height of the map.

### `iconHTML (string)`

HTML to render for map markers

### `legendComponent (func)`

Component to render beneath the map, useful for map legends.

### `maxArea (object)`

Maximum area for polygons on the map. If area is exceeded, submit button will
be disabled
```
{
  area: <number>,
  unit: <'meters'|'miles'>
}
```

### `onChange (func)`

Callback triggered by state change in the container. Debounced at 100ms.

### `points (array)`

An array of points to be added as markers on the map. Points should be
provided either as an array like `[ <lat>, <lng> ]` or as a GeoJSON Point
feature (see [the feature specification](https://macwright.org/2015/03/23/geojson-second-bite.html#features)).

### `features (array)`

An array of polygons to be added to the map. Polygons must be a valid GeoJSON
MultiPolygon

### `remove (bool)`

Sets the initial remove state of the component.

### `style (object)`

???

### `tileLayerProps (object)`

Specify a non-default tileset.

```
{
  url: <url of tileset>
  attribution: <attribution string for tileset>
}
```

URL for tileset (default `http://{s}.tile.osm.org/{z}/{x}/{y}.png`).

### `tootTipOptions (object)`

???

### `zoom (number)`

Inital zoom level of map. (see [Leaflet zoom levels](http://leafletjs.com/examples/zoom-levels/))

