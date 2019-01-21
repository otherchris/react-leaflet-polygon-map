import React from 'react';
import omit from 'lodash/omit';
import each from 'lodash/each';
import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import MapComponent from './MapComponent';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    bindPoint: 'm',
    mapState: { ...props },
    tileLayer: 'street'
  };
    this.tileSwitcher = this.tileSwitcher.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !isEqual(nextProps.matches, this.props.matches) ||
      !isEqual(nextProps.points, this.props.points) ||
      !isEqual(nextProps.features, this.props.features) ||
      !isEqual(nextProps.remove, this.props.remove) ||
      !isEqual(nextProps.edit, this.props.edit) ||
      !isEqual(nextProps.extraProps, this.props.extraProps) ||
      !isEqual(nextProps.tileLayer, this.props.tileLayer) ||
      (this.state.tileLayer !== nextState.tileLayer)) {
      return true;
    }
    if (!isEqual(this.state.bindPoint, nextState.bindPoint)) return true;
    return false;
  }

  setBindPoint(m) {
    if (this.state.bindPoint === 'm') {
      this.setState({ bindPoint: m });
    }
  }
  tileSwitcher(value) {
    if (value === this.state.tileLayer) return;
    if (value !== this.state.tileLayer) this.setState({ tileLayer: value });
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
    }
  }

  render() {
    const extraProps = {};
    let tileLayer;
    if (this.state.tileLayer === 'street') {
      tileLayer = {
        name: this.state.tileLayer,
        url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      };
    }
    if (this.state.tileLayer === 'sat') {
      tileLayer = {
        name: this.state.tileLayer,
        url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      };
    }
    each(this.props.extraProps, (p) => { extraProps[p] = this.props[p]; });
    return (
      <MapComponent
        {...cloneDeep(omit(this.props, 'extraProps'))}
        {...extraProps}
        bindPoint={this.state.bindPoint}
        setBindPoint={this.setBindPoint.bind(this)}
        tileLayer={tileLayer}
        tileSwitcher={this.tileSwitcher}
      />
    );
  }
}

MapContainer.defaultProps = {
  onShapeChange: noop,
  validateFunc: noop,
};

export default MapContainer;
