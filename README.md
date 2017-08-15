# react-leaflet-map

# API

`<MapContainer />`

### Props:

`tiles`: string indicating which tileset to use

  * `default`: `http://{s}.tile.osm.org/{z}/{x}/{y}.png`
  * `minimal_light`: `https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png`
  * `minimal_dark`: `https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png`

`polygons`: array of polygons in PolyLine, GeoJSON, WKT or WKB format
`encoding`: if using WKB, the encoding of the WKB string (default is `base64`)
`points`: array of points in `[lat, long]` format
`height`: height of the resulting map
