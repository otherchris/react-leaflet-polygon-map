import React from 'react';
import omit from 'lodash/omit';
import each from 'lodash/each';
import assign from 'lodash/assign';
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
    const lastState = cloneDeep(this.state.mapState);
    if (
      !isEqual(data.matches, this.state.mapState.matches) ||
      !isEqual(data.points, this.state.mapState.points) ||
      !isEqual(data.features, this.state.mapState.features) ||
      !isEqual(data.remove, this.state.mapState.remove) ||
      !isEqual(data.tileLayerProps, this.state.mapState.tileLayerProps)) {
      this.setState({ mapState: assign(lastState, data) }, () => {
        console.log('INSIDE FEATS', this.state.mapState.features);
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
    const extraProps = {};
    each(this.props.extraProps, (p) => { extraProps[p] = this.props[p]; });
    return (
      <MapComponent
        {...omit(this.state.mapState, 'onShapeChange')}
        {...extraProps}
        onShapeChange={this.updateMap.bind(this)}
        bindPoint={this.state.bindPoint}
        setBindPoint={this.setBindPoint.bind(this)}
      />
    );
  }
}

export default MapContainer;
