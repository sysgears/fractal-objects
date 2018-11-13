import { fold, foldTo, getPureParts } from '..';

describe('Fractal Objects', () => {
  it('folds undefined to undefined', () => {
    expect(fold(undefined)).toBeUndefined();
  });

  it('folds empty parts set to undefined', () => {
    expect(fold([])).toBeUndefined();
  });

  it('folds left and right defined values', () => {
    expect(fold([{ key: ['a'] }, {}])).toEqual({ key: ['a'] });
    expect(fold([{}, { key: ['b'] }])).toEqual({ key: ['b'] });
  });

  it('concatenates array values', () => {
    expect(fold([{ key: ['a'] }, { key: ['b', 'c'] }])).toEqual({ key: ['a', 'b', 'c'] });
  });

  it('merges object values', () => {
    expect(fold([{ obj: { key1: 'a', key2: 'a' } }, { obj: { key2: 'b', key3: 'c' } }])).toEqual({
      obj: { key1: 'a', key2: 'b', key3: 'c' }
    });
  });

  it('concats non-object values into array', () => {
    expect(fold([{ date: new Date('2018-01-01') }, { date: new Date('2018-01-02') }])).toEqual({
      date: new Date('2018-01-02')
    });
  });

  it('returns pure parts for the nested fractal', () => {
    expect(getPureParts(fold([fold([{ key: ['a'] }, { key: ['b', 'c'] }]), { key: ['d'] }]))).toEqual([
      { key: ['a'] },
      { key: ['b', 'c'] },
      { key: ['d'] }
    ]);
  });

  it('allows downstream info writing into pure parts', () => {
    interface Shape {
      key?: string;
    }
    const part: Shape = { key: 'a' };
    const whole1: Shape = {};
    const whole2: Shape = {};
    foldTo(whole1, []);
    foldTo(whole2, [whole1, part]);
    getPureParts(whole2).forEach((p: any) => (p.myKey = 'test'));
    expect(whole1).toHaveProperty('myKey');
    expect(part).toHaveProperty('myKey');
  });
});
