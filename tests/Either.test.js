import * as λ from '../src';

test('Either.of(a) outputs instance of Success holding its input value.', () => {
  expect(λ.Either.of(3).inspect()).toBe('Success(3)');
});

test('Either.Success(a) outputs instance of Success holding its input value.', () => {
  expect(λ.Either.Success(3).inspect()).toBe('Success(3)');
});

test('Either.Failure(a) outputs instance of Failure holding its input value.', () => {
  expect(λ.Either.Failure('I am an error.').inspect()).toBe('Failure(\'I am an error.\')');
});

test('Either.of(a).inspect() outputs string Success(a).', () => {
  expect(λ.Either.of(3).inspect()).toBe('Success(3)');
});

test('Either.Success(a).inspect() outputs string Success(a).', () => {
  expect(λ.Either.Success(3).inspect()).toBe('Success(3)');
});

test('Either.Failure(a).inspect() outputs string Failure(a).', () => {
  expect(λ.Either.Failure('I am an error.').inspect()).toBe('Failure(\'I am an error.\')');
});

test('Either.of(a).isSuccess() always outputs true.', () => {
  expect(λ.Either.of(3).isSuccess()).toBe(true);
  expect(λ.Either.of(3).isFailure()).toBe(false);
});

test('Either.Failure(a).isFailure() outputs false if Either is Failure.', () => {
  expect(λ.Either.Failure('I am an error.').isFailure()).toBe(true);
  expect(λ.Either.Failure('I am an error.').isSuccess()).toBe(false);
});

test('Either.try(a -> b) outputs Success(b) if no error is thrown.', () => {
  const iReturnValue = () => '7urtle';
  expect(λ.Either.try(iReturnValue).inspect()).toBe('Success(\'7urtle\')');
  expect(λ.Either.try(iReturnValue).isSuccess()).toBe(true);
  expect(λ.Either.try(iReturnValue).isFailure()).toBe(false);
});

test('Either.try(a -> b) outputs Failure(e.message) if error is thrown.', () => {
  const iThrowError = () => {
    throw new Error('I am an error.');
  };
  expect(λ.Either.try(iThrowError).inspect()).toBe('Failure(\'I am an error.\')');
  expect(λ.Either.try(iThrowError).isFailure()).toBe(true);
  expect(λ.Either.try(iThrowError).isSuccess()).toBe(false);
});

test('Either.of(a).map(a -> b) executes function over Either input a.', () => {
  expect(λ.Either.of(3).map(a => a + 2).inspect()).toBe('Success(5)');
});

test('Either.of(a).map(a -> Success) outputs Success(Success).', () => {
  expect(λ.Either.of(3).map(a => λ.Either.of(a + 2)).inspect()).toBe('Success(Success(5))');
});

test('Either.Failure(a).map(a -> b) does not execute provided function and retains Failure input value.', () => {
  expect(λ.Either.Failure('I am an error.').map(a => a + '7turtle').inspect()).toBe('Failure(\'I am an error.\')');
});

test('Either.of(a).flatMap(a -> b) executes function over Either input a returns its raw value.', () => {
  expect(λ.Either.of(λ.Either.of(3).flatMap(a => a + 2)).inspect()).toBe('Success(5)');
  expect(λ.Either.of(3).flatMap(() => λ.Either.Failure('I am an error.')).inspect()).toBe('Failure(\'I am an error.\')');
  expect(λ.Either.of(3).flatMap(a => a + 2)).toBe(5);
});

test('Either.Failure(a).flatMap(a -> b) does not execute provided function and retains Failure input value.', () => {
  expect(λ.Either.Failure('I am an error.').flatMap(a => a + '7turtle').inspect()).toBe('Failure(\'I am an error.\')');
});

test('Either.of(a).map(a -> b).ap(Either) provides applicative ability to apply functors to each other.', () => {
  const add = a => b => a + b;
  expect(λ.Either.of(1).map(add).ap(λ.Either.of(2)).inspect()).toBe('Success(3)');
  expect(λ.Either.of(1).map(add).ap(λ.Either.Failure('I am an error.')).inspect()).toBe('Failure(\'I am an error.\')');
  expect(λ.Either.Failure('I am an error.').map(add).ap(λ.Either.of(2)).inspect()).toBe('Failure(\'I am an error.\')');
});

test('Either.of(Either -> Either -> c).ap(Either).ap(Either) provides applicative interface for a functor of a function.', () => {
  const add = a => b => a + b;
  expect(λ.Either.of(add).ap(λ.Either.of(1)).ap(λ.Either.of(2)).inspect()).toBe('Success(3)');
  expect(λ.Either.of(add).ap(λ.Either.Failure('I am an error.')).ap(λ.Either.of(2)).inspect()).toBe('Failure(\'I am an error.\')');
  expect(λ.Either.Failure('I am an error.').ap(λ.Either.of(1)).ap(λ.Either.of(2)).inspect()).toBe('Failure(\'I am an error.\')');
});

test('either outputs result of a function onSuccess if input Either is Success or outputs result of a function onFailure if input Either is Failure.', () => {
  expect(λ.either(a => 'error: ' + a)(a => 'success: ' + a)(λ.Either.of('abc'))).toBe('success: abc');
  expect(λ.either(a => 'error: ' + a)(a => 'success: ' + a)(λ.Either.Failure(':('))).toBe('error: :(');
  expect(λ.either(a => 'error: ' + a)(a => 'success: ' + a)(λ.Either.of('abc'))).toBe(λ.either(a => 'error: ' + a, a => 'success: ' + a, λ.Either.of('abc')));
});