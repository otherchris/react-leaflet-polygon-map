import React from 'react';
import { shallow } from 'enzyme';
import spyConsole from './spyConsole';

const testPropType = (Component, propName, type) => {
  let value = null;
  switch (type) {
    case 'string':
      value = 1234;
      break;
    case 'number':
      value = '1234';
      break;
    default:
      value = null;
  }
  const props = {};
  props[propName] = value;
  return describe(propName, () => {
    let spy = spyConsole();
    it(`must be a ${type}`, () => {
      const wrapper = shallow(<Component { ...props } /> );
      expect(console.error).toHaveBeenCalled();
      expect(spy.console.mock.calls[0][0]).toContain('Failed prop type');
    });
  });
};

export default testPropType;
