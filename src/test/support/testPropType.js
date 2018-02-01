import React from 'react';
import { shallow } from 'enzyme';
import noop from 'lodash/noop';
import spyConsole from './spyConsole';

// TODO: How to check a bool propType?
const testPropType = (Component, propName, type) => {
  let badValue = null;
  let goodValue = null;
  switch (type) {
    case 'string':
      badValue = 1234;
      goodValue = '1234';
      break;
    case 'number':
      badValue = '1234';
      goodValue = 1234;
      break;
    case 'func':
      badValue = 123;
      goodValue = (a, cb) => { cb(a) };
      break;
    case 'object':
      badValue = 123;
      goodValue = { p: 'v' };
      break;
    case 'bool':
      badValue = '123';
      goodValue = false;
      break;
    case 'array':
      badValue = '123';
      goodValue = [false];
      break;
    case 'array.object':
      badValue = ['123'];
      goodValue = [{thing: false}];
      break;
    default:
      badValue = null;
  }
  const badProps = {};
  const goodProps = {};
  badProps[propName] = badValue;
  goodProps[propName] = goodValue;
  return describe(propName, () => {
    let spy = spyConsole();
    it(`accepts a ${type}`, () => {
      const wrapper = shallow(<Component { ...goodProps } /> );
      expect(console.error).not.toHaveBeenCalled();
    });
    it(`must be a ${type}`, () => {
      const wrapper = shallow(<Component { ...badProps } /> );
      expect(console.error).toHaveBeenCalled();
      expect(spy.console.mock.calls[0][0]).toContain('Failed prop type');
    });
  });
};

export default testPropType;
