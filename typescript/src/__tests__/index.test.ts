import { unfold } from '..';

describe('Fractal Objects', () => {
  it('unfolds undefined to undefined', () => {
    expect(unfold(undefined)).toBeUndefined();
  });

  it('unfolds empty parts set to undefined', () => {
    expect(unfold([])).toBeUndefined();
  });

  it('unfolds left and right defined values', () => {
    expect(unfold([{ key: ['a'] }, {}])).toEqual({ key: ['a'] });
    expect(unfold([{}, { key: ['b'] }])).toEqual({ key: ['b'] });
  });

  it('concatenates array values', () => {
    expect(unfold([{ key: ['a'] }, { key: ['b', 'c'] }])).toEqual({ key: ['a', 'b', 'c'] });
  });

  it('merges object values', () => {
    expect(unfold([{ obj: { key1: 'a', key2: 'a' } }, { obj: { key2: 'b', key3: 'c' } }])).toEqual({
      obj: { key1: 'a', key2: 'b', key3: 'c' }
    });
  });

  it('concats non-object values into array', () => {
    expect(unfold([{ date: new Date('2018-01-01') }, { date: new Date('2018-01-02') }])).toEqual({
      date: new Date('2018-01-02')
    });
  });
});
