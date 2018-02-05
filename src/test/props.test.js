import React from 'react';
import PropTypes from 'prop-types';
import { shallow, mount, render } from 'enzyme';
import map from 'lodash/map';
import fill from 'lodash/fill';
import MapContainer, { makePoint, makePoints, makeCenterLeaflet } from '../MapContainer';
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
    const geoDefault = { type: 'Point', coordinates:  [-85.751528, 38.257222] };
    const defaultCenter = makeCenterLeaflet(geoDefault);
    const wrapper = shallow(<MapContainer />);
    expect(wrapper.state().center).toEqual(defaultCenter)
  });
  it('can be supplied as an array', () => {
    const geoPoint = { type: 'Point', coordinates: [-1, 1] };
    const geoCenter = makeCenterLeaflet(geoPoint);
    const wrapper = mount(<MapContainer center={[1,-1]} />);
    wrapper.instance().componentDidMount(() => {
      expect(wrapper.state().center).toEqual(geoCenter)
    });
  });

  it('can be supplied as a latLng object', () => {
    const geoPoint = { type: 'Point', coordinates: [-1, 1] };
    const geoCenter = makeCenterLeaflet(geoPoint);
    const wrapper = shallow(<MapContainer center={{ lat: 1, lng: -1 }} />);
    wrapper.instance().componentDidMount(() => {
      expect(wrapper.state().center).toEqual(geoCenter)
    });
  });

  it('can be supplied as a geoJSON object', () => {
    const geoPoint = { type: 'Point', coordinates: [-1, 1] };
    const geoCenter = makeCenterLeaflet(geoPoint);
    const wrapper = shallow(<MapContainer center={ geoPoint} />);
    wrapper.instance().componentDidMount(() => {
      expect(wrapper.state().center).toEqual(geoCenter)
    });
  });

  it('can be supplied as a geoJSON feature', () => {
    const geoPoint = { type: 'Point', coordinates: [-1, 1] };
    const geoCenter = makeCenterLeaflet(geoPoint);
    const wrapper = shallow(<MapContainer center={{ type: 'Feature', geometry: geoPoint }} />);
    wrapper.instance().componentDidMount(() => {
      expect(wrapper.state().center).toEqual(geoCenter)
    });
  });
});

describe('edit', () => {
  testPropType(MapContainer, 'edit', 'bool');

  it('sets the edit state', () => {
    const wrapper = shallow(<MapContainer edit />);
    wrapper.instance().componentDidMount();
    expect(wrapper.state().edit).toEqual(true);
  });
});

describe('features', () => {
  testPropType(MapContainer, 'features', 'array.object');

  it('passes supplied features to state', () => {
    const wrapper = shallow(<MapContainer features={[polygons.large]} /> )
    wrapper.instance().componentDidMount(() => {
      expect(wrapper.state().features).toHaveLength(1);
    });
  });
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

describe('maxAreaEach', () => {
  testPropType(MapContainer, 'maxAreaEach', 'number');

  it('flags a given polygon as too large', () => {
    const wrapper = shallow(<MapContainer features={[polygons.large]} maxAreaEach={1} />)
    wrapper.instance().componentDidMount();
    expect(wrapper.state().features[0].properties.tooLarge).toEqual(true);
  });
});

describe('onShapeChange', () => {
  testPropType(MapContainer, 'onShapeChange', 'func');
});

describe('points', () => {
  testPropType(MapContainer, 'points', 'array.object');
});

describe('remove', () => {
  testPropType(MapContainer, 'remove', 'bool');
});

describe('style', () => {
  testPropType(MapContainer, 'style', 'object');
});

describe('zoom', () => {
  testPropType(MapContainer, 'zoom', 'number');
});
