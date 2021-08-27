import * as λ from '../src';

test('Maybe.of(a).inspect() outputs string Just(a) or Nothing.', () => {
  expect(λ.Maybe.of(3).inspect()).toBe('Just(3)');
  expect(λ.Maybe.of(null).inspect()).toBe('Nothing');
});

test('Just(a).inspect() outputs string Just(a).', () => {
  expect(λ.Just(3).inspect()).toBe('Just(3)');
});

test('Nothing.inspect() outputs string Nothing.', () => {
  expect(λ.Nothing.inspect()).toBe('Nothing');
});

test('Maybe.of(a) outputs Nothing for an input that is null, undefined, an empty string or an empty array.', () => {
  expect(λ.Maybe.of(null).inspect()).toBe('Nothing');
  expect(λ.Maybe.of(undefined).inspect()).toBe('Nothing');
  expect(λ.Maybe.of('').inspect()).toBe('Nothing');
  expect(λ.Maybe.of([]).inspect()).toBe('Nothing');
});

test('Maybe.of(a) outputs Just for an input a that is not Nothing.', () => {
  expect(λ.Maybe.of(3).inspect()).toBe('Just(3)');
  expect(λ.Maybe.of('7urtle').inspect()).toBe('Just(\'7urtle\')');
  expect(λ.Maybe.of([1, 2]).inspect()).toBe('Just([1, 2])');
});

test('Maybe.of(a).isJust() of an input a outputs true for a value that is Just.', () => {
  expect(λ.Maybe.of(3).isJust()).toBe(true);
  expect(λ.Maybe.of(null).isJust()).toBe(false);
});

test('Maybe.of(a).isNothing() of an input a outputs true for a value that is Nothing.', () => {
  expect(λ.Maybe.of(null).isNothing()).toBe(true);
  expect(λ.Maybe.of(3).isNothing()).toBe(false);
});

test('Maybe.of(a).map(a -> b) executes function over Maybe input a.', () => {
  expect(λ.Maybe.of(3).map(a => a + 2).inspect()).toBe('Just(5)');
});

test('Maybe.of(a).map(a -> Just) outputs Just(Just).', () => {
  expect(λ.Maybe.of(3).map(a => λ.Maybe.of(a + 2)).inspect()).toBe('Just(Just(5))');
});

test('Maybe.of(a).map(a -> b) does not execute over Nothing.', () => {
  expect(λ.Maybe.of(null).map(a => a + 2).inspect()).toBe('Nothing');
});

test('Maybe.of(a).flatMap(a -> b) executes function over Maybe input a returns its raw value.', () => {
  expect(λ.Maybe.of(λ.Maybe.of(3).flatMap(a => a + 2)).inspect()).toBe('Just(5)');
  expect(λ.Maybe.of(3).flatMap(a => λ.Maybe.of(a + 2)).inspect()).toBe('Just(5)');
  expect(λ.Maybe.of(3).flatMap(a => a + 2)).toBe(5);
});

test('Maybe.of(a).flatMap(a -> b) does not execute over Nothing.', () => {
  expect(λ.Maybe.of(null).flatMap(a => a + 2).inspect()).toBe('Nothing');
});

test('Maybe.of(a).map(a -> b).ap(Maybe) provides applicative ability to apply functors to each other.', () => {
  const add = a => b => a + b;
  expect(λ.Maybe.of(1).map(add).ap(λ.Maybe.of(2)).inspect()).toBe('Just(3)');
  expect(λ.Maybe.of(1).map(add).ap(λ.Maybe.of(null)).inspect()).toBe('Nothing');
  expect(λ.Maybe.of(undefined).map(add).ap(λ.Maybe.of(2)).inspect()).toBe('Nothing');
});

test('Maybe.of(Maybe -> Maybe -> c).ap(Maybe).ap(Maybe) provides applicative interface for a functor of a function.', () => {
  const add = a => b => a + b;
  expect(λ.Maybe.of(add).ap(λ.Maybe.of(1)).ap(λ.Maybe.of(2)).inspect()).toBe('Just(3)');
  expect(λ.Maybe.of(add).ap(λ.Maybe.of(null)).ap(λ.Maybe.of(2)).inspect()).toBe('Nothing');
  expect(λ.Maybe.of(null).ap(λ.Maybe.of(1)).ap(λ.Maybe.of(2)).inspect()).toBe('Nothing');
});

test('maybe outputs result of a function onJust if input Maybe is Just or outputs input error if input Maybe is Nothing.', () => {
  expect(λ.maybe(() => 'error')(a => a)(λ.Maybe.of('abc'))).toBe('abc');
  expect(λ.maybe(() => 'error')(a => a)(λ.Maybe.of(undefined))).toBe('error');
  expect(λ.maybe(() => 'error')(a => a)(λ.Maybe.of('abc'))).toBe(λ.maybe('error', a => a, λ.Maybe.of('abc')));
});

test('mergeMaybes outputs Maybe of array with all Maybe values depending whether they are Nothing or Just.', () => {
  expect(λ.mergeMaybes(λ.Maybe.of('abc'), λ.Just('def')).inspect()).toBe("Just(['abc', 'def'])");
  expect(λ.mergeMaybes(λ.Maybe.of('abc'), λ.Nothing).inspect()).toBe("Nothing");
  expect(λ.mergeMaybes(λ.Nothing, λ.Maybe.Just('def')).inspect()).toBe("Nothing");
  expect(λ.mergeMaybes(λ.Maybe.Nothing, λ.Nothing).inspect()).toBe("Nothing");
});

test('maybeToEither converts any Maybe monad to an Either monad.', () => {
  expect(λ.maybeToEither(λ.Maybe.of('7urtle')).isSuccess()).toBe(true);
  expect(λ.maybeToEither(λ.Maybe.of(undefined)).isFailure()).toBe(true);
  expect(λ.maybeToEither(λ.Maybe.of(undefined)).value).toBe('Maybe is Nothing.');
});

test('maybeToSyncEffect converts any Maybe monad to an SyncEffect monad.', () => {
  expect(λ.maybeToSyncEffect(λ.Maybe.of('7urtle')).trigger()).toBe('7urtle');
  expect(λ.maybeToSyncEffect(λ.Maybe.of(undefined)).trigger).toThrow('Maybe is Nothing.');
});

test('maybeToAsyncEffect converts any Maybe monad to an AsyncEffect monad and resolves.', done => {
  λ.maybeToAsyncEffect(λ.Maybe.of('7urtle'))
    .trigger
    (error => { throw error; })
    (success => {
      expect(success).toBe('7urtle');
      done();
    });
});

test('maybeToAsyncEffect converts any Maybe monad to an AsyncEffect monad and rejects.', done => {
  λ.maybeToAsyncEffect(λ.Maybe.of(undefined))
    .trigger
    (error => {
      expect(error).toBe('Maybe is Nothing.');
      done();
    })
    (() => { throw 'Unexpected success.'; });
});