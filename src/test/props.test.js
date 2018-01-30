import React from 'react';
import PropTypes from 'prop-types';
import { shallow, mount, render } from 'enzyme';
import map from 'lodash/map';
import fill from 'lodash/fill';
import MapContainer, { makeCenter } from '../MapContainer';
import testPropType from './support/testPropType';

describe('apikey', () => {
  testPropType(MapContainer, 'apikey', 'string');
});

describe('center', () => {
  it('makeCenter', () => {
    const array = [1, -1];
    const none = null;
    const latLng = { lat: 1, lng: -1 };
    const geoJSON = { type: "Point", coordinates: [-1, 1] };
    const geoJSONFeature = { type: "Feature", geometry: geoJSON };

    expect(map([array, geoJSON, geoJSONFeature, latLng], makeCenter)).toEqual(fill(Array(4), geoJSON))
  });

  it('can be supplied as an array', () => {
    const wrapper = shallow(<MapContainer center={[1,-1]} />);
    expect(wrapper.state().center).toEqual({ type: 'Point', coordinates: [-1, 1] })
  });
});

describe('edit', () => {
  it('sets the edit state to true', () => {
    const wrapper = shallow(<MapContainer edit />);
    expect(wrapper.state().edit).toEqual(true);
  });
  it('casts to bool', () => {
    const wrapper = shallow(<MapContainer edit="false" />);
    expect(wrapper.state().edit).toEqual(true);
  });
});

describe('height', () => {
  testPropType(MapContainer, 'height', 'number');
});

