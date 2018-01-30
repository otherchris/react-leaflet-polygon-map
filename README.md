# react-leaflet-polygon-map

A react component providing a multipurpose leaflet map with excellent support
for polygons.

## Supported React versions

^15.6.1

## API

This package exports the `MapContainer` component that accepts the following
props:

### `apikey (string)`

Google location API for location search.

### `center (array/object)`

Initial center of the map. Can be provided as
  - an array `[ <lat>, <lng> ]`
  - an object `{ lat: <lat>, lng: <lng> }`
  - a GeoJSON Point `{ "type": "Point", "coordinates": [ <lat>, <lng> ] }`
  - a GeoJSON Feature ```
    {
      "type": "Feature",
      "properties": { <props> },
      "geometry": { <GeoJSON Point> }
    }```

### `edit (bool)`

Enable the draw layer on the map. Required for creating new polygons/points and
editing/removing existing polygons/points

### `height (number)`

Pixel height of the map.

### `iconHTML (string)`

HTML to render for map markers

### `legendComponent (func)`

Component to render beneath the map, useful for map legends.

### `legendProps (object)`

Initial props for legend component

### `maxArea (number)`

Maximum area for polygons on the map. If area is exceeded, submit button will
be disabled. Measured in sq meters.

### `onShapeChange (func)`

Callback triggered by state change in the container. Debounced at 100ms. Second
arg should be an (err, res) callback.

### `points (array)`

An array of points to be added as markers on the map. Points should be
provided either as an array like `[ <lat>, <lng> ]` or as a GeoJSON Point
feature (see [the feature specification](https://macwright.org/2015/03/23/geojson-second-bite.html#features)).

### `features (array)`

An array of polygons to be added to the map. Polygons must be a valid GeoJSON
Feature with MultiPolygon geometry.

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

