import { cleanPropsFunc } from '../cleanProps';
import noop from 'lodash/noop';

describe('cleanProps', () => {
  const extUpdate = (p, cb) => p;
  it('passes props through', () => {
    expect(cleanPropsFunc({a: 'a'})).toEqual({a: 'a'});
  });
});
