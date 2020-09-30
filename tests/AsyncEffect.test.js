import * as λ from '../src';

const resolving = reject => resolve => value => setTimeout(() => resolve(value), 10);
const resolvingTernary = async (reject, resolve, value) =>  setTimeout(() => resolve(value), 10);
const rejecting = reject => resolve => value => setTimeout(() => reject('I am an error.'), 10);
const rejectingTernary = async (reject, resolve, value) => setTimeout(() => reject('I am an error.'), 10);
const throwing = () => {
  throw 'I am a thrown error.';
};

test('AsyncEffect.of(() -> a).inspect() outputs string AsyncEffect(a).', () => {
  expect(λ.AsyncEffect.of(() => '7turtle').inspect().includes('AsyncEffect(function')).toBe(true);
});

test('AsyncEffect.of(a -> b -> c -> d).trigger(e -> f)(g -> h)(i) for resolving curried function resolves.', done => {
  λ.AsyncEffect.of(resolving).trigger(error => error)(result => {
    expect(result).toBe('7urtle');
    done();
  })('7urtle');
});

test('AsyncEffect.of((a, b, c) -> d).trigger(e -> f)(g -> h)(i) for resolving async ternary function resolves.', done => {
  λ.AsyncEffect.of(resolvingTernary).trigger(error => error)(result => {
    expect(result).toBe('7urtle');
    done();
  })('7urtle');
});

test('AsyncEffect.of((a -> b -> c -> d).trigger accepts ternary function.', done => {
  λ.AsyncEffect.of(resolving).trigger(error => error, result => {
    expect(result).toBe('7urtle');
    done();
  }, '7urtle');
});

test('AsyncEffect.of((a -> b -> c -> d).trigger accepts ternary function after map.', done => {
  λ.AsyncEffect.of(resolving).map(a => a + 's').trigger(error => error, result => {
    expect(result).toBe('7urtles');
    done();
  }, '7urtle');
});

test('AsyncEffect.of((a -> b -> c -> d).trigger accepts ternary function after flatMap.', done => {
  λ.AsyncEffect.of(resolving).flatMap(a => λ.AsyncEffect.of(reject => resolve => value => resolve(a + 's'))).trigger(error => error, result => {
    expect(result).toBe('7urtles');
    done();
  }, '7urtle');
});

test('AsyncEffect.of(a -> b -> c -> d).trigger(e -> f)(g -> h)(i) for rejecting curried function rejects.', done => {
  λ.AsyncEffect.of(rejecting).trigger(error => {
    expect(error).toBe('I am an error.');
    done();
  })(result => result)();
});

test('AsyncEffect.of((a, b, c) -> d).trigger(e -> f)(g -> h)(i) for rejecting async ternary function rejects.', done => {
  λ.AsyncEffect.of(rejectingTernary).trigger(error => {
    expect(error).toBe('I am an error.');
    done();
  })(result => result)();
});

test('AsyncEffect.of(a -> b -> c -> d).trigger(e -> f)(g -> h)(i) for synchronous exceptions rejects.', done => {
  λ.AsyncEffect.of(throwing).trigger(error => {
    expect(error).toBe('I am a thrown error.');
    done();
  })(result => result)();
});

test('AsyncEffect.of(a -> b -> c -> d).promise() outputs JavaScript promise.', done => {
  λ.AsyncEffect.of(resolving).promise('7urtle').then(result => {
    expect(result).toBe('7urtle');
    done();
  });
});

test('AsyncEffect.of(a -> b -> c -> d).map(b -> d) composes function over AsyncEffect input function.', done => {
  λ.AsyncEffect.of(resolving).map(a => a + 's').trigger(error => error)(result => {
    expect(result).toBe('7urtles');
    done();
  })('7urtle');
});

test('AsyncEffect.of(a -> b -> c -> d).flatMap(b -> AsyncEffect) outputs AsyncEffect.', done => {
  λ.AsyncEffect.of(resolving).flatMap(a => λ.AsyncEffect.of(reject => resolve => value => resolve(a + 's'))).trigger(error => error)(result => {
    expect(result).toBe('7urtles');
    done();
  })('7urtle');
});

test('AsyncEffect.of(a -> b -> c -> d).flatMap(b -> AsyncEffect) handles reject states correctly passing along the initial error.', done => {
  let some = 1;
  const resolving = reject => resolve => value => setTimeout(() => resolve(++some), 10);
  const rejecting = reject => resolve => value => setTimeout(() => reject('I am an error.'), 10);
  λ.AsyncEffect.of(rejecting).flatMap(() => λ.AsyncEffect.of(resolving)).trigger(error => {
    expect(error).toBe('I am an error.');
    expect(some).toBe(1);
    done();
  })(result => result)();
});

test('AsyncEffect.of(a -> b -> c -> d).map(b -> d).ap(AsyncEffect) provides applicative ability to apply functors to each other.', done => {
  const add = a => b => a + b;
  const resolving = reject => resolve => value => setTimeout(() => resolve(1), 10);
  λ.AsyncEffect.of(resolving).map(add).ap(λ.AsyncEffect.of(resolving)).trigger(error => error)(result => {
    expect(result).toBe(2);
    done();
  })();
});

test('AsyncEffect.of(AsyncEffect -> AsyncEffect -> c).ap(AsyncEffect).ap(AsyncEffect) provides applicative interface for a functor of a function.', done => {
  const add = a => b => a + b;
  const resolving = reject => resolve => value => setTimeout(() => resolve(1), 10);
  λ.AsyncEffect.of(reject => resolve => value => resolve(add)).ap(λ.AsyncEffect.of(resolving)).ap(λ.AsyncEffect.of(resolving)).trigger(error => error)(result => {
    expect(result).toBe(2);
    done();
  })();
});

test('No input function is executed until trigger is called.', done => {
  let some = 1;
  const resolving = reject => resolve => value => setTimeout(() => resolve(++some), 10);
  λ.AsyncEffect.of(resolving).flatMap(() => λ.AsyncEffect.of(resolving));
  setTimeout(() => {
    expect(some).toBe(3);
    done();
  }, 30);
  λ.AsyncEffect.of(resolving).flatMap(() => λ.AsyncEffect.of(resolving)).trigger(error => error)(result => {
    expect(some).toBe(3);
    expect(result).toBe(3);
  })();
});