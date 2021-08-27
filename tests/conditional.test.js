import * as λ from '../src';

test('both and(f,g)(x), and(g,f)(x) are equivalent to f(x) && g(x) as well as g(x) && f(x)', () => {
  const f = λ.isGreaterThan(0);
  const g = λ.isLessThan(10);
  expect(λ.and(f, g)(8)).toBe(f(8) && g(8));
  expect(λ.and(f, g)(8)).toBe(g(8) && f(8));
  expect(λ.and(g, f)(8)).toBe(f(8) && g(8));
  expect(λ.and(g, f)(8)).toBe(g(8) && f(8));
});

test('both or(f,g)(x), or(g,f)(x) are equivalent to f(x) || g(x) as well as g(x) || f(x)', () => {
  const f = λ.isGreaterThan(10);
  const g = λ.isZero;
  expect(λ.or(f, g)(0)).toBe(f(0) || g(0));
  expect(λ.or(f, g)(0)).toBe(g(0) || f(0));
  expect(λ.or(g, f)(0)).toBe(f(0) || g(0));
  expect(λ.or(g, f)(0)).toBe(g(0) || f(0));
});

test('and can be used together with or to encapsulate a predicate in a single function', () => {
  const not = boolFn => x => !boolFn(x);
  const isDivisibleBy = λ.nary(divisor => number => number % divisor === 0);
  const isNotDivisibleBy = λ.nary(λ.compose(not, isDivisibleBy));
  const isLeapYear = λ.or(λ.and(isDivisibleBy(4), isNotDivisibleBy(100)), isDivisibleBy(400));
  const year = 2000;
  expect(isLeapYear(year)).toBe((isDivisibleBy(4, year) && isNotDivisibleBy(100, year)) || isDivisibleBy(400, year));
});

test('isEqual output is true if strict equality between a and b is true.', () => {
  expect(λ.isEqual('something')('something')).toBe(true);
  expect(λ.isEqual('something')('something else')).toBe(false);
  expect(λ.isEqual(['a'])(['a'])).toBe(false);
  expect(λ.isEqual({a : 'something'})({a : 'something'})).toBe(false);
  expect(λ.isEqual('something')('something')).toBe(λ.isEqual('something', 'something'));
});

test('isEqual output is always false for comparison of objects and arrays.', () => {
  expect(λ.isEqual({})({})).toBe(false);
  expect(λ.isEqual([])([])).toBe(false);
});

test('isNotEqual output is true if strict equality between a and b is false.', () => {
  expect(λ.isNotEqual('something')('something else')).toBe(true);
  expect(λ.isNotEqual('something')('something')).toBe(false);
  expect(λ.isNotEqual('something')('something else')).toBe(λ.isNotEqual('something', 'something else'));
});

test('isNotEqual output is always true for comparison of objects and arrays.', () => {
  expect(λ.isNotEqual({})({})).toBe(true);
  expect(λ.isNotEqual([])([])).toBe(true);
});

test('isDeepEqual output is true if strict equality between the string conversion of a and the string conversion of b is true including arrays and objects.', () => {
  expect(λ.isDeepEqual('something')('something')).toBe(true);
  expect(λ.isDeepEqual('something')('something else')).toBe(false);
  expect(λ.isDeepEqual({})({})).toBe(true);
  expect(λ.isDeepEqual(['a'])(['a'])).toBe(true);
  expect(λ.isDeepEqual(['a', 'b'])(['a'])).toBe(false);
  expect(λ.isDeepEqual(['a'])(['b'])).toBe(false);
  expect(λ.isDeepEqual({a : 'something'})({a : 'something'})).toBe(true);
  expect(λ.isDeepEqual({a : 'something', b: c => c})({a : 'something'})).toBe(false);
  expect(λ.isDeepEqual({a : 'something'})({b : 'something'})).toBe(false);
  expect(λ.isDeepEqual('something')('something')).toBe(λ.isDeepEqual('something', 'something'));
});

test('isNotDeepEqual output is true if strict equality between the string conversion of a and the string conversion of b is false including arrays and objects.', () => {
  expect(λ.isNotDeepEqual('something')('something')).toBe(false);
  expect(λ.isNotDeepEqual('something')('something else')).toBe(true);
  expect(λ.isNotDeepEqual(['a'])(['a'])).toBe(false);
  expect(λ.isNotDeepEqual(['a', 'b'])(['a'])).toBe(true);
  expect(λ.isNotDeepEqual(['a'])(['b'])).toBe(true);
  expect(λ.isNotDeepEqual({a : 'something'})({a : 'something'})).toBe(false);
  expect(λ.isNotDeepEqual({a : 'something', b: c => c})({a : 'something'})).toBe(true);
  expect(λ.isNotDeepEqual({a : 'something'})({b : 'something'})).toBe(true);
  expect(λ.isNotDeepEqual('something')('something')).toBe(λ.isNotDeepEqual('something', 'something'));
});

test('isTrue output is true if input is true.', () => {
  expect(λ.isTrue(true)).toBe(true);
  expect(λ.isTrue(false)).toBe(false);
});

test('isFalse output is true if input is false.', () => {
  expect(λ.isFalse(false)).toBe(true);
  expect(λ.isFalse(true)).toBe(false);
});

test('isGreaterThan output is true if b is greater than a.', () => {
  expect(λ.isGreaterThan(1)(2)).toBe(true);
  expect(λ.isGreaterThan(2)(1)).toBe(false);
  expect(λ.isGreaterThan(1)(2)).toBe(λ.isGreaterThan(1, 2));
});

test('isLessThan output is true if b is less than a.', () => {
  expect(λ.isLessThan(2)(1)).toBe(true);
  expect(λ.isLessThan(1)(2)).toBe(false);
  expect(λ.isLessThan(2)(1)).toBe(λ.isLessThan(2, 1));
});

test('isAtLeast output is true if b is greater or equal to a.', () => {
  expect(λ.isAtLeast(1)(2)).toBe(true);
  expect(λ.isAtLeast(2)(2)).toBe(true);
  expect(λ.isAtLeast(2)(1)).toBe(false);
  expect(λ.isAtLeast(1)(2)).toBe(λ.isAtLeast(1, 2));
});

test('isAtMost output is true if b is less or equal to a.', () => {
  expect(λ.isAtMost(2)(1)).toBe(true);
  expect(λ.isAtMost(2)(2)).toBe(true);
  expect(λ.isAtMost(1)(2)).toBe(false);
  expect(λ.isAtMost(2)(1)).toBe(λ.isAtMost(2, 1));
});

test('isBetween output is true if c is between a and b.', () => {
  expect(λ.isBetween(1)(3)(2)).toBe(true);
  expect(λ.isBetween(3)(1)(2)).toBe(true);
  expect(λ.isBetween(1)(3)(3)).toBe(false);
  expect(λ.isBetween(1)(3)(4)).toBe(false);
  expect(λ.isBetween(1)(3)(2)).toBe(λ.isBetween(1, 3, 2));
});

test('isInRange output is true if c is in range of a and b.', () => {
  expect(λ.isInRange(1)(3)(2)).toBe(true);
  expect(λ.isInRange(3)(1)(2)).toBe(true);
  expect(λ.isInRange(1)(3)(3)).toBe(true);
  expect(λ.isInRange(1)(3)(4)).toBe(false);
  expect(λ.isInRange(1)(3)(2)).toBe(λ.isInRange(1, 3, 2));
});

test('isTypeOf output is true if b is a type of a.', () => {
  expect(λ.isTypeOf('number')(1)).toBe(true);
  expect(λ.isTypeOf('string')(1)).toBe(false);
  expect(λ.isTypeOf('number')(1)).toBe(λ.isTypeOf('number', 1));
});

test('isNotTypeOf output is true if b is not a type of a.', () => {
  expect(λ.isNotTypeOf('number')(1)).toBe(false);
  expect(λ.isNotTypeOf('string')(1)).toBe(true);
  expect(λ.isNotTypeOf('string')(1)).toBe(λ.isNotTypeOf('string', 1));
});

test('isString output is true if input is a string.', () => {
  expect(λ.isString('string')).toBe(true);
  expect(λ.isString(1)).toBe(false);
});

test('isNotString output is true if input is not a string.', () => {
  expect(λ.isNotString('string')).toBe(false);
  expect(λ.isNotString(1)).toBe(true);
});

test('isBoolean output is true if input is a boolean.', () => {
  expect(λ.isBoolean(true)).toBe(true);
  expect(λ.isBoolean(1)).toBe(false);
});

test('isNotBoolean output is true if input is not a boolean.', () => {
  expect(λ.isNotBoolean(true)).toBe(false);
  expect(λ.isNotBoolean(1)).toBe(true);
});

test('isNull output is true if input is a null.', () => {
  expect(λ.isNull(null)).toBe(true);
  expect(λ.isNull(1)).toBe(false);
});

test('isNotNull output is true if input is not a null.', () => {
  expect(λ.isNotNull(null)).toBe(false);
  expect(λ.isNotNull(1)).toBe(true);
});

test('isUndefined output is true if input is an undefined.', () => {
  expect(λ.isUndefined(undefined)).toBe(true);
  expect(λ.isUndefined(1)).toBe(false);
});

test('isNotUndefined output is true if input is not an undefined.', () => {
  expect(λ.isNotUndefined(undefined)).toBe(false);
  expect(λ.isNotUndefined(1)).toBe(true);
});

test('isNumber output is true if input is a number.', () => {
  expect(λ.isNumber(1)).toBe(true);
  expect(λ.isNumber('string')).toBe(false);
});

test('isNotNumber output is true if input is not a number.', () => {
  expect(λ.isNotNumber(1)).toBe(false);
  expect(λ.isNotNumber('string')).toBe(true);
});

test('isObject output is true if input is an object, array, or null.', () => {
  expect(λ.isObject({})).toBe(true);
  expect(λ.isObject([])).toBe(true);
  expect(λ.isObject(null)).toBe(true);
  expect(λ.isObject(1)).toBe(false);
});

test('isNotObject output is true if input is not an object, array, or null.', () => {
  expect(λ.isNotObject({})).toBe(false);
  expect(λ.isNotObject([])).toBe(false);
  expect(λ.isNotObject(null)).toBe(false);
  expect(λ.isNotObject(1)).toBe(true);
});

test('isArray output is true if input is an array.', () => {
  expect(λ.isArray([])).toBe(true);
  expect(λ.isArray({})).toBe(false);
});

test('isNotArray output is true if input is not an array.', () => {
  expect(λ.isNotArray([])).toBe(false);
  expect(λ.isNotArray({})).toBe(true);
});

test('isFunction output is true if input is a function.', () => {
  const someObject = {inspect: () => 'inspected'};
  expect(λ.isFunction(() => null)).toBe(true);
  expect(λ.isFunction(someObject.inspect)).toBe(true);
  expect(λ.isFunction(1)).toBe(false);
});

test('isNotFunction output is true if input is not a function.', () => {
  const someObject = {inspect: () => 'inspected'};
  expect(λ.isNotFunction(() => null)).toBe(false);
  expect(λ.isNotFunction(someObject.inspect)).toBe(false);
  expect(λ.isNotFunction(1)).toBe(true);
});

test('isLength output is true if b is a length of a.', () => {
  expect(λ.isLength(3)('abc')).toBe(true);
  expect(λ.isLength(3)([1,2,3])).toBe(true);
  expect(λ.isLength(1)('abc')).toBe(false);
  expect(λ.isLength(1)([1,2,3])).toBe(false);
  expect(λ.isLength(3)('abc')).toBe(λ.isLength(3, 'abc'));
});

test('isNotLength output is true if b is not a length of a.', () => {
  expect(λ.isNotLength(1)('abc')).toBe(true);
  expect(λ.isNotLength(1)([1,2,3])).toBe(true);
  expect(λ.isNotLength(3)('abc')).toBe(false);
  expect(λ.isNotLength(3)([1,2,3])).toBe(false);
  expect(λ.isNotLength(1)('abc')).toBe(λ.isNotLength(1, 'abc'));
});

test('isEmpty output is true if input is an empty string, array, or object. Otherwise is is false.', () => {
  expect(λ.isEmpty('')).toBe(true);
  expect(λ.isEmpty([])).toBe(true);
  expect(λ.isEmpty({})).toBe(true);
  expect(λ.isEmpty('abc')).toBe(false);
  expect(λ.isEmpty([1,2,3])).toBe(false);
});

test('isNotEmpty output is false if input is an empty string, array, or object. Otherwise it is true.', () => {
  expect(λ.isNotEmpty('abc')).toBe(true);
  expect(λ.isNotEmpty([1,2,3])).toBe(true);
  expect(λ.isNotEmpty('')).toBe(false);
  expect(λ.isNotEmpty([])).toBe(false);
  expect(λ.isNotEmpty({})).toBe(false);
});

test('isZero output is true if a is 0.', () => {
  expect(λ.isZero(0)).toBe(true);
  expect(λ.isZero(1)).toBe(false);
  expect(λ.isZero('7urtle')).toBe(false);
});

test('isNotZero output is true if a is not 0.', () => {
  expect(λ.isNotZero(1)).toBe(true);
  expect(λ.isNotZero('7urtle')).toBe(true);
  expect(λ.isNotZero(0)).toBe(false);
});

test('isNothing returns true if input is null, undefined or empty string or empty array.', () => {
  expect(λ.isNothing(null)).toBe(true);
  expect(λ.isNothing(undefined)).toBe(true);
  expect(λ.isNothing('')).toBe(true);
  expect(λ.isNothing([])).toBe(true);
  expect(λ.isNothing({})).toBe(true);
  expect(λ.isNothing(1)).toBe(false);
  expect(λ.isNothing('7urtle')).toBe(false);
  expect(λ.isNothing([1, 2])).toBe(false);
  expect(λ.isNothing(λ.Nothing)).toBe(true);
  expect(λ.isNothing(λ.Just('7urtle'))).toBe(false);
  expect(λ.isNothing(λ.Maybe.of('7urtle'))).toBe(false);
});

test('isJust returns true if input is not null, undefined or empty string or empty array.', () => {
  expect(λ.isJust(1)).toBe(true);
  expect(λ.isJust('7urtle')).toBe(true);
  expect(λ.isJust([1, 2])).toBe(true);
  expect(λ.isJust(null)).toBe(false);
  expect(λ.isJust(undefined)).toBe(false);
  expect(λ.isJust('')).toBe(false);
  expect(λ.isJust([])).toBe(false);
  expect(λ.isJust({})).toBe(false);
  expect(λ.isJust(λ.Nothing)).toBe(false);
  expect(λ.isJust(λ.Just('7urtle'))).toBe(true);
  expect(λ.isJust(λ.Maybe.of('7urtle'))).toBe(true);
});

test('when tests anything argument by passing it to predicate function.', () => {
  const predicate = a => a > 1;
  const whenTrueFn = a => a * 2;

  expect(λ.when(predicate)(whenTrueFn)(2)).toBe(4);
  expect(λ.when(predicate)(whenTrueFn)(1)).toBe(1);
  expect(λ.when(predicate)(whenTrueFn)(2)).toBe(λ.when(predicate, whenTrueFn, 2));
});

test('unless tests anything argument by passing it to predicate function.', () => {
  const predicate = a => a > 1;
  const whenFalseFn = a => a * 2;

  expect(λ.unless(predicate)(whenFalseFn)(4)).toBe(4);
  expect(λ.unless(predicate)(whenFalseFn)(1)).toBe(2);
  expect(λ.unless(predicate)(whenFalseFn)(1)).toBe(λ.unless(predicate, whenFalseFn, 1));
});

test('ifElse tests anything argument by passing it to predicate function.', () => {
  const predicate = a => a > 1;
  const whenTrueFn = a => a / 2;
  const whenFalseFn = a => a * 2;

  expect(λ.ifElse(predicate)(whenTrueFn)(whenFalseFn)(4)).toBe(2);
  expect(λ.ifElse(predicate)(whenTrueFn)(whenFalseFn)(1)).toBe(2);
  expect(λ.ifElse(predicate)(whenTrueFn)(whenFalseFn)(2)).toBe(λ.ifElse(predicate, whenTrueFn, whenFalseFn, 2));
});