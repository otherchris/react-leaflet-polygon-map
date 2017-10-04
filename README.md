# react-leaflet-map

# API

`<MapContainer />`

### Props:

`tiles`: string indicating which tileset to use

  * `default`: `http://{s}.tile.osm.org/{z}/{x}/{y}.png`
  * `minimal_light`: `https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png`
  * `minimal_dark`: `https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png`

`polygons`: array of polygons in PolyLine, GeoJSON, GeoJSON MultiPolygon, or WKT format

`points`: array of points in `[lat, long]` format

`height`: height of the resulting map

`iconHTML`: map marker defined as HTML with `<src>` or `<img>`



All poly shapes and types will be returned as MultiPolygon Feature Objects. Format below:
```
geoJSON = {
 type: 'Feature', (req)
 properties: {
  area: number, (optional: will be claculated)
  key: value, (optional)
  key2: value2,(optional)
 },
 geometry: {
  type: 'MultiPolygon', (req)
  coordinates: [[[ (req)
   [lat, lng],
   [lat, lng],
  ]]],
 },
}
```


`<MapComponent />`
`<Tooltip />`
`<EditTools />`
`<MapSubmitButton />`
`<LegendComponent />`
