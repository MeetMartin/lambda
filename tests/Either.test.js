import * as λ from '../src/index.js';

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
  expect(λ.Success(3).inspect()).toBe('Success(3)');
});

test('Either.Failure(a).inspect() outputs string Failure(a).', () => {
  expect(λ.Either.Failure('I am an error.').inspect()).toBe('Failure(\'I am an error.\')');
  expect(λ.Failure('I am an error.').inspect()).toBe('Failure(\'I am an error.\')');
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
  expect(λ.Either.try(() => { throw 'I am an error.' }).value).toBe('I am an error.');
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

test('Either.of(a).catchMap(a -> b) maps over the Failure value.', () => {
  const addS = a => a + 's';
  expect(λ.Failure('error').catchMap(addS).inspect()).toBe("Failure('errors')");
  expect(λ.Success('7urtle').catchMap(addS).inspect()).toBe("Success('7urtle')");
  expect(λ.Either.of('7urtle').catchMap(addS).inspect()).toBe("Success('7urtle')");
});

test('Either.of(a).bimap(a -> b)(a -> b) maps first function over Failure and the other over Success.', () => {
  const addRight = a => a + ' is right';
  const addLeft = a => a + ' is left';
  expect(λ.Failure('error').bimap(addLeft)(addRight).inspect()).toBe("Failure('error is left')");
  expect(λ.Failure('error').bimap(addLeft, addRight).inspect()).toBe("Failure('error is left')");
  expect(λ.Success('7urtle').bimap(addLeft)(addRight).inspect()).toBe("Success('7urtle is right')");
  expect(λ.Success('7urtle').bimap(addLeft, addRight).inspect()).toBe("Success('7urtle is right')");
  expect(λ.Either.of('7urtle').bimap(addLeft)(addRight).inspect()).toBe("Success('7urtle is right')");
});

test('Either.of(a).orOf(b) replaces Failure(a) with Success(b).', () => {
  expect(λ.Failure('error').orOf('7urtles').inspect()).toBe("Success('7urtles')");
  expect(λ.Success('7urtle').orOf('7urtles').inspect()).toBe("Success('7urtle')");
  expect(λ.Either.of('7urtle').orOf('7urtles').inspect()).toBe("Success('7urtle')");
});

test('Either.of(a).orElse(a -> Either) replaces Failure(a) with the output of orElse function.', () => {
  expect(λ.Failure('error').orElse(() => λ.Success('7urtles')).inspect()).toBe("Success('7urtles')");
  expect(λ.Success('7urtle').orElse(() => λ.Success('7urtles')).inspect()).toBe("Success('7urtle')");
  expect(λ.Either.of('7urtle').orElse(() => λ.Success('7urtles')).inspect()).toBe("Success('7urtle')");
});

test('Either.of(a).orTry(a -> b) replaces original Fairlure with Either.try.', () => {
  const iThrowError = () => {
    throw new Error('I am an error.');
  };
  expect(λ.Failure('error').orTry(iThrowError).inspect()).toBe('Failure(\'I am an error.\')');
  expect(λ.Failure('error').orTry(() => '7urtle').inspect()).toBe("Success('7urtle')");
  expect(λ.Success('7urtle').orTry(iThrowError).inspect()).toBe("Success('7urtle')");
  expect(λ.Either.of('7urtle').orTry(iThrowError).inspect()).toBe("Success('7urtle')");
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

test('mergeEithers outputs Either of array with all Either values depending whether they are Success or Failure.', () => {
  expect(λ.mergeEithers(λ.Either.of('abc'), λ.Either.of('def')).inspect()).toBe("Success(['abc', 'def'])");
  expect(λ.mergeEithers(λ.Either.of('abc'), λ.Either.Failure('def')).inspect()).toBe("Failure(['def'])");
  expect(λ.mergeEithers(λ.Either.Failure('abc'), λ.Either.of('def')).inspect()).toBe("Failure(['abc'])");
  expect(λ.mergeEithers(λ.Either.Failure('abc'), λ.Either.Failure('def')).inspect()).toBe("Failure(['abc', 'def'])");
});

test('validateEithers outputs Either of input value if all input functions returns Success or Failure with array of error messages.', () => {
  const isPasswordLongEnough = password =>
    password.length > 6
    ? λ.Either.Success(password)
    : λ.Either.Failure('Password must have more than 6 characters.');
  
  const isPasswordStrongEnough = password =>
    /[\W]/.test(password)
    ? λ.Either.Success(password)
    : λ.Either.Failure('Password must contain special characters.');

  const validatePassword = λ.validateEithers(isPasswordLongEnough, isPasswordStrongEnough);

  expect(validatePassword('LongPa$$word').inspect()).toBe("Success('LongPa$$word')");
  expect(validatePassword('Pa$$').inspect()).toBe("Failure(['Password must have more than 6 characters.'])");
  expect(validatePassword('LongPassword').inspect()).toBe("Failure(['Password must contain special characters.'])");
  expect(validatePassword('Pass').inspect()).toBe("Failure(['Password must have more than 6 characters.', 'Password must contain special characters.'])");
});

test('eitherToMaybe converts any Either monad to a Maybe monad.', () => {
  expect(λ.eitherToMaybe(λ.Either.Success('7urtle')).isJust()).toBe(true);
  expect(λ.eitherToMaybe(λ.Either.Success(undefined)).isNothing()).toBe(true);
  expect(λ.eitherToMaybe(λ.Either.Failure('I am an error.')).isNothing()).toBe(true);
  expect(λ.eitherToMaybe(λ.Either.Failure('I am an error.')).value).toBe(null);
});

test('eitherToSyncEffect converts any Either monad to a SyncEffect monad.', () => {
  expect(λ.eitherToSyncEffect(λ.Success('7urtle')).trigger()).toBe('7urtle');
  expect(λ.eitherToSyncEffect(λ.Failure('I am an error.')).trigger).toThrow('I am an error.');
});

test('eitherToAsyncEffect converts any Either monad to a AsyncEffect monad and resolves.', done => {
  λ.eitherToAsyncEffect(λ.Success('7urtle'))
    .trigger
    (error => { throw error; })
    (success => {
      expect(success).toBe('7urtle');
      done();
    });
});

test('eitherToAsyncEffect converts any Either monad to a AsyncEffect monad and rejects.', done => {
  λ.eitherToAsyncEffect(λ.Failure('I am an error.'))
    .trigger
    (error => {
      expect(error).toBe('I am an error.');
      done();
    })
    (() => { throw 'Unexpected success.'; });
});