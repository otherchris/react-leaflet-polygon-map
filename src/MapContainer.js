import React from 'react';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import cloneDeep from 'lodash/cloneDeep';
import MapComponent from './MapComponent';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { bindPoint: 'm' };
  }

  updateMap(data, cb) {
    if (
      !isEqual(data.points, this.props.points) ||
      !isEqual(data.features, this.props.features) ||
      !isEqual(data.remove, this.props.remove)) {
      this.props.onShapeChange(data, cb);
    }
  }

  setBindPoint(m, p) {
    if (this.state.bindPoint === 'm') {
      this.setState({ bindPoint: m });
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      const el = document.querySelector('a.leaflet-draw-edit-remove');
      el.onclick = () => {
        const _p = cloneDeep(this.props);
        _p.remove = !this.props.remove;
        el.classname = 'leaflet-draw-edit-remove';
      };
      //this.updateMap(this.props, noop);
    }
  }

  render() {
    return (
      <MapComponent
        {...omit(this.props, 'onShapeChange')}
        onShapeChange={this.updateMap.bind(this)}
        bindPoint={this.state.bindPoint}
        setBindPoint={this.setBindPoint.bind(this)}
      />
    );
  }
}

export default MapContainer;
