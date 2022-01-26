import * as λ from '../src/index.js';

test('SyncEffect.of(() -> a).inspect() outputs string SyncEffect(a).', () => {
  expect(λ.SyncEffect.of(() => '7turtle').inspect()).toBe("SyncEffect(() => '7turtle')");
});

test('SyncEffect.of(() -> a).trigger() executes function provided as input of SyncEffect.', () => {
  expect(λ.SyncEffect.of(() => '7turtle').trigger()).toBe('7turtle');
});

test('SyncEffect.of(() -> a).map(b -> c) composes function over SyncEffect input function.', () => {
  expect(λ.SyncEffect.of(() => '7turtle').map(a => a + 's').trigger()).toBe('7turtles');
  expect(λ.SyncEffect.of(() => 1).map(a => a + 1).trigger()).toBe(2);
  expect(λ.SyncEffect.of(() => { throw 'error'; }).map(a => a + 1).trigger).toThrow('error');
});

test('SyncEffect.of(() -> a).map(b -> SyncEffect) outputs SyncEffect(SyncEffect).', () => {
  expect(λ.SyncEffect.of(() => '7turtle').map(a => λ.SyncEffect.of(() => a + 's')).trigger().trigger()).toBe('7turtles');
});

test('SyncEffect.of(() -> a).flatMap(b -> SyncEffect) outputs SyncEffect.', () => {
  expect(λ.SyncEffect.of(() => '7turtle').flatMap(a => λ.SyncEffect.of(() => a + 's')).trigger()).toBe('7turtles');
  expect(λ.SyncEffect.of(() => { throw 'error'; }).flatMap(a => λ.SyncEffect.of(() => a + 's')).trigger).toThrow('error');
  expect(λ.SyncEffect.of(() => '7turtle').flatMap(() => λ.SyncEffect.of(() => { throw 'error'; })).trigger).toThrow('error');
});

test('SyncEffect.of(() -> a).map(a -> b).ap(SyncEffect) provides applicative ability to apply functors to each other.', () => {
  const add = a => b => a + b;
  expect(λ.SyncEffect.of(() => 1).map(add).ap(λ.SyncEffect.of(() => 2)).trigger()).toBe(3);
});

test('SyncEffect.of(SyncEffect -> SyncEffect -> c).ap(SyncEffect).ap(SyncEffect) provides applicative interface for a functor of a function.', () => {
  const add = a => b => a + b;
  expect(λ.SyncEffect.of(() => add).ap(λ.SyncEffect.of(() => 1)).ap(λ.SyncEffect.of(() => 2)).trigger()).toBe(3);
  expect(λ.SyncEffect.of(() => add).ap(λ.SyncEffect.of(() => undefined)).ap(λ.SyncEffect.of(() => 2)).trigger()).toBe(NaN);
});

test('No input function is executed until trigger is called.', () => {
  let some = 1;
  λ.SyncEffect.of(() => ++some).map(a => {some=some+a; return some;});
  expect(some).toBe(1);
  λ.SyncEffect.of(() => ++some).map(a => {some=some+a; return some;}).trigger();
  expect(some).toBe(4);
  λ.SyncEffect.of(() => ++some).flatMap(a => λ.SyncEffect.of(() => {some=some+a; return some;}));
  expect(some).toBe(4);
  λ.SyncEffect.of(() => ++some).flatMap(a => λ.SyncEffect.of(() => {some=some+a; return some;})).trigger();
  expect(some).toBe(10);
  λ.SyncEffect.of(() => ++some).map(a => b => a + b).ap(λ.SyncEffect.of(() => ++some));
  expect(some).toBe(10);
  λ.SyncEffect.of(() => ++some).map(a => b => a + b).ap(λ.SyncEffect.of(() => ++some)).trigger();
  expect(some).toBe(12);
});

test('syncEffectToMaybe converts any SyncEffect monad to a Maybe monad.', () => {
  expect(λ.syncEffectToMaybe(λ.SyncEffect.of(() => '7urtle')).isJust()).toBe(true);
  expect(λ.syncEffectToMaybe(λ.SyncEffect.of(() => undefined)).isNothing()).toBe(true);
  expect(λ.syncEffectToMaybe(λ.SyncEffect.of(() => '7urtle')).value).toBe('7urtle');
  expect(λ.syncEffectToMaybe(λ.SyncEffect.of(() => { throw 'I am an error.'; })).isNothing()).toBe(true);
  expect(λ.syncEffectToMaybe(λ.SyncEffect.of(() => { throw 'I am an error.'; })).value).toBe(null);
});

test('syncEffectToEither converts any SyncEffect monad to an Either monad.', () => {
  expect(λ.syncEffectToEither(λ.SyncEffect.of(() => '7urtle')).isSuccess()).toBe(true);
  expect(λ.syncEffectToEither(λ.SyncEffect.of(() => '7urtle')).value).toBe('7urtle');
  expect(λ.syncEffectToEither(λ.SyncEffect.of(() => { throw 'I am an error.'; })).isFailure()).toBe(true);
  expect(λ.syncEffectToEither(λ.SyncEffect.of(() => { throw 'I am an error.'; })).value).toBe('I am an error.');
});

test('syncEffectToAsyncEffect converts any SyncEffect monad to a AsyncEffect monad and resolves.', done => {
  λ.syncEffectToAsyncEffect(λ.SyncEffect.of(() => '7urtle'))
    .trigger
    (error => { throw error; })
    (success => {
      expect(success).toBe('7urtle');
      done();
    });
});

test('syncEffectToAsyncEffect converts any SyncEffect monad to a AsyncEffect monad and rejects.', done => {
  λ.syncEffectToAsyncEffect(λ.SyncEffect.of(() => { throw 'I am an error.'; }))
    .trigger
    (error => {
      expect(error).toBe('I am an error.');
      done();
    })
    (() => { throw 'Unexpected success.'; });
});