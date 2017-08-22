import React from 'react';
import MapContainer from '../MapContainer';
import { shallow } from 'enzyme';

test('get function', () => {
  const wrapper = shallow(<MapContainer />);
  expect(wrapper.convertPoly(4)).toBe(5);
});
