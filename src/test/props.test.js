import React from 'react';
import PropTypes from 'prop-types';
import { shallow, mount, render } from 'enzyme';
import map from 'lodash/map';
import fill from 'lodash/fill';
import MapContainer, { makePoint, makePoints } from '../MapContainer';
import testPropType from './support/testPropType';
import polygons from './support/fixtures/polygons';

describe('apikey', () => {
  testPropType(MapContainer, 'apikey', 'string');
});

describe('center', () => {
  it('makePoint', () => {
    const array = [1, -1];
    const none = null;
    const latLng = { lat: 1, lng: -1 };
    const geoJSON = { type: "Point", coordinates: [-1, 1] };
    const geoJSONFeature = { type: "Feature", geometry: geoJSON };

    expect(map([array, geoJSON, geoJSONFeature, latLng], makePoint)).toEqual(fill(Array(4), geoJSON))
  });

  it('has a default', () => {
    const wrapper = shallow(<MapContainer />);
    expect(wrapper.state().center).toEqual({ type: 'Point', coordinates: [-85.751528, 38.257222] })
  });
  it('can be supplied as an array', () => {
    const wrapper = shallow(<MapContainer center={[1,-1]} />);
    expect(wrapper.state().center).toEqual({ type: 'Point', coordinates: [-1, 1] })
  });

  it('can be supplied as a latLng object', () => {
    const wrapper = shallow(<MapContainer center={{ lat: 1, lng: -1 }} />);
    expect(wrapper.state().center).toEqual({ type: 'Point', coordinates: [-1, 1] })
  });

  it('can be supplied as a geoJSON object', () => {
    const geoJSON = { type: "Point", coordinates: [-1, 1] };
    const wrapper = shallow(<MapContainer center={ geoJSON } />);
    expect(wrapper.state().center).toEqual({ type: 'Point', coordinates: [-1, 1] })
  });

  it('can be supplied as a geoJSON feature', () => {
    const geoJSON = { type: "Point", coordinates: [-1, 1] };
    const geoJSONFeature = { type: "Feature", geometry: geoJSON };
    const wrapper = shallow(<MapContainer center={ geoJSONFeature } />);
    expect(wrapper.state().center).toEqual({ type: 'Point', coordinates: [-1, 1] })
  });
});

describe('edit', () => {
  testPropType(MapContainer, 'edit', 'bool');
});

describe('height', () => {
  testPropType(MapContainer, 'height', 'number');
});

describe('iconHTML', () => {
  testPropType(MapContainer, 'iconHTML', 'string');
});

describe('legendComponent', () => {
  testPropType(MapContainer, 'legendComponent', 'func');
});

describe('legendProps', () => {
  testPropType(MapContainer, 'legendProps', 'object');
});

describe('onShapeChange', () => {
  testPropType(MapContainer, 'onShapeChange', 'func');
});

describe('points', () => {
  testPropType(MapContainer, 'points', 'array.object');
});

describe('maxAreaEach', () => {
  testPropType(MapContainer, 'maxAreaEach', 'number');

  it('flags a given polygon as too large', () => {
    const wrapper = shallow(<MapContainer features={[polygons.large]} maxAreaEach={1} />)
    wrapper.instance().componentDidMount();
    console.log(wrapper.state().features)
    expect(wrapper.state().features[0].properties.tooLarge).toEqual(true);
  });
});

