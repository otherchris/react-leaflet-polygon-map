import React from 'react';
import omit from 'lodash/omit';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import MapComponent from './MapComponent';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { bindPoint: 'm', mapState: { ...props } };
  }

  updateMap(data, cb) {
    if (
      !isEqual(data.points, this.state.mapState.points) ||
      !isEqual(data.features, this.state.mapState.features) ||
      !isEqual(data.remove, this.state.mapState.remove)) {
      this.setState({ mapState: merge(this.state.mapState, data) }, () => {
        this.props.onShapeChange(this.state.mapState, cb);
      });
    }
  }

  setBindPoint(m, p) {
    if (this.state.bindPoint === 'm') {
      this.setState({ bindPoint: m });
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      let el = document.querySelector('a.leaflet-draw-edit-remove');
      if (!el) el = { onclick: '' };
      el.onclick = () => {
        const _p = cloneDeep(this.props);
        _p.remove = !this.props.remove;
        el.classname = 'leaflet-draw-edit-remove';
      };
      this.updateMap(this.props, noop);
    }
  }

  render() {
    return (
      <MapComponent
        {...omit(this.state.mapState, 'onShapeChange')}
        onShapeChange={this.updateMap.bind(this)}
        bindPoint={this.state.bindPoint}
        setBindPoint={this.setBindPoint.bind(this)}
      />
    );
  }
}

export default MapContainer;
