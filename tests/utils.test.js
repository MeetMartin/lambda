import * as λ from '../src';

test('typeOf outputs type of its input a.', () => {
  expect(λ.typeOf('7turtle')).toBe('string');
});

test('lenghtOf outputs the length of an input.', () => {
  expect(λ.lengthOf('7turtle')).toBe(7);
  expect(λ.lengthOf([1,2,3])).toBe(3);
  expect(λ.lengthOf({})).toBe(undefined);
});

test('passThrough output is the same as input a.', () => {
  expect(λ.passThrough(() => 'b')('a')).toBe('a');
  expect(λ.passThrough(() => 'b')('a')).toBe(λ.passThrough(() => 'b', 'a'));
});

test('log output is the same as input.', () => {
  expect(λ.log('a')).toBe('a');
});

test('spy output is the same as input.', () => {
  expect(λ.spy('a')).toBe('a');
});

test('minusOneToUndefined output is the same as input or undefined if input is -1.', () => {
  expect(λ.minusOneToUndefined(-1)).toBe(undefined);
  expect(λ.minusOneToUndefined(0)).toBe(0);
  expect(λ.minusOneToUndefined(1)).toBe(1);
  expect(λ.minusOneToUndefined('7urtle')).toBe('7urtle');
});

test('inspectFunction outputs name of named function or its conversion to string.', () => {
  function namedFunction() {
    return null;
  }
  expect(λ.inspectFunction(() => 'b').includes('function')).toBe(true);
  expect(λ.inspectFunction(namedFunction)).toBe('namedFunction');
});

test('inspectArray maps over input array [a] and outputs string representing it.', () => {
  function namedFunction() {
    return null;
  }
  expect(λ.inspectArray([1, 'a'])).toBe('[1, \'a\']');
  expect(λ.inspectArray([namedFunction, 'a'])).toBe('[namedFunction, \'a\']');
});

test('inspectString outputs string representing input.', () => {
  expect(λ.inspectString('a')).toBe('\'a\'');
});

test('inspectObject outputs string representing input.', () => {
  expect(λ.inspectObject({a: 'b'})).toBe('{a: \'b\'}');
  expect(λ.inspectObject({inspect: () => 'inspected'})).toBe('inspected');
});

test('deepInspect outputs inspectObject if input is an object.', () => {
  expect(λ.deepInspect({a: 'b'})).toBe(λ.inspectObject({a: 'b'}));
  expect(λ.deepInspect({inspect: () => 'inspected'})).toBe(λ.inspectObject({inspect: () => 'inspected'}));
});

test('deepInspect outputs inspectFunction if input is a function.', () => {
  function namedFunction() {
    return null;
  }
  expect(λ.deepInspect(() => 'b')).toBe(λ.inspectFunction(() => 'b'));
  expect(λ.deepInspect(namedFunction)).toBe(λ.inspectFunction(namedFunction));
});

test('deepInspect outputs inspectArray if input is an array.', () => {
  function namedFunction() {
    return null;
  }
  expect(λ.deepInspect([1, 'a'])).toBe(λ.inspectArray([1, 'a']));
  expect(λ.deepInspect([namedFunction, 'a'])).toBe(λ.inspectArray([namedFunction, 'a']));
});

test('deepInspect outputs inspectString if input is a string.', () => {
  expect(λ.deepInspect('a')).toBe(λ.inspectString('a'));
});

test('deepInspect outputs string if input is not an object, function, array or a string.', () => {
  expect(λ.deepInspect(1)).toBe('1');
});

test('deepInspect works over null and undefined.', () => {
  expect(λ.deepInspect(null)).toBe('null');
  expect(λ.deepInspect(undefined)).toBe('undefined');
});