import * as λ from '../src/index.js';

const resolving = reject => resolve => setTimeout(() => resolve('7urtle'), 10);
const resolvingBinary = async (reject, resolve) =>  setTimeout(() => resolve('7urtle'), 10);
const rejecting = reject => resolve => setTimeout(() => reject('I am an error.'), 10);
const rejectingBinary = async (reject, resolve) => setTimeout(() => reject('I am an error.'), 10);
const throwing = () => {
  throw 'I am a thrown error.';
};

test('AsyncEffect.of(() -> a).inspect() outputs string AsyncEffect(a).', () => {
  expect(λ.AsyncEffect.of(() => '7turtle').inspect().includes('AsyncEffect(')).toBe(true);
});

test('AsyncEffect.of(a -> b -> c).trigger(e -> f)(g -> h) for resolving curried function resolves.', done => {
  λ.AsyncEffect.of(resolving).trigger(error => error)(result => {
    expect(result).toBe('7urtle');
    done();
  });
});

test('AsyncEffect.ofPromise(a -> Promise) creates AsyncEffect from a promise.', done => {
  const successPromise = () => new Promise((resolve, reject) => resolve('7urtle'));
  λ.AsyncEffect.ofPromise(successPromise).trigger(error => error)(result => {
    expect(result).toBe('7urtle');
    done();
  });
});

test('AsyncEffect.ofPromise(a -> Promise) rejects for a failed promise.', done => {
  const failedPromise = () => new Promise((resolve, reject) => reject('error'));
  λ.AsyncEffect.ofPromise(failedPromise).trigger(error => {
    expect(error).toBe('error');
    done();
  })(success => success);
});

test('AsyncEffect.of((a, b) -> c).trigger(d -> e)(f -> g) for resolving async binary function resolves.', done => {
  λ.AsyncEffect.of(resolvingBinary).trigger(error => error)(result => {
    expect(result).toBe('7urtle');
    done();
  });
});

test('AsyncEffect.of((a -> b -> c).trigger accepts binary function.', done => {
  λ.AsyncEffect.of(resolving).trigger(error => error, result => {
    expect(result).toBe('7urtle');
    done();
  });
});

test('AsyncEffect.of((a -> b -> c).trigger accepts binary function after map.', done => {
  λ.AsyncEffect.of(resolving).map(a => a + 's').trigger(error => error, result => {
    expect(result).toBe('7urtles');
    done();
  });
});

test('AsyncEffect.of((a -> b -> c).trigger accepts binary function after flatMap.', done => {
  λ.AsyncEffect.of(resolving).flatMap(a => λ.AsyncEffect.of(reject => resolve => resolve(a + 's'))).trigger(error => error, result => {
    expect(result).toBe('7urtles');
    done();
  });
});

test('AsyncEffect.of(a -> b -> c).trigger(d -> e)(f -> g) for rejecting curried function rejects.', done => {
  λ.AsyncEffect.of(rejecting).trigger(error => {
    expect(error).toBe('I am an error.');
    done();
  })(result => result);
});

test('AsyncEffect.of((a, b) -> c).trigger(d -> e)(f -> g) for rejecting async binary function rejects.', done => {
  λ.AsyncEffect.of(rejectingBinary).trigger(error => {
    expect(error).toBe('I am an error.');
    done();
  })(result => result);
});

test('AsyncEffect.of(a -> b -> c).trigger(d -> e)(f -> g) for synchronous exceptions rejects.', done => {
  λ.AsyncEffect.of(throwing).trigger(error => {
    expect(error).toBe('I am a thrown error.');
    done();
  })(result => result);
});

test('AsyncEffect.of(a -> b -> c).promise() outputs JavaScript promise.', done => {
  λ.AsyncEffect.of(resolving).promise().then(result => {
    expect(result).toBe('7urtle');
    done();
  });
});

test('AsyncEffect.of(a -> b -> c).map(c -> d) composes function over AsyncEffect input function.', done => {
  λ.AsyncEffect.of(resolving).map(a => a + 's').trigger(error => error)(result => {
    expect(result).toBe('7urtles');
    done();
  });
});

test('AsyncEffect.of(a -> b -> c).flatMap(c -> AsyncEffect) outputs AsyncEffect.', done => {
  λ.AsyncEffect.of(resolving).flatMap(a => λ.AsyncEffect.of(reject => resolve => resolve(a + 's'))).trigger(error => error)(result => {
    expect(result).toBe('7urtles');
    done();
  });
});

test('AsyncEffect.of(a -> b -> c).flatMap(c -> AsyncEffect) handles reject states correctly passing along the initial error.', done => {
  let some = 1;
  const resolving = reject => resolve => setTimeout(() => resolve(++some), 10);
  const rejecting = reject => resolve => setTimeout(() => reject('I am an error.'), 10);
  λ.AsyncEffect.of(rejecting).flatMap(() => λ.AsyncEffect.of(resolving)).trigger(error => {
    expect(error).toBe('I am an error.');
    expect(some).toBe(1);
    done();
  })(result => result);
});

test('AsyncEffect.of(a -> b -> c).map(c -> d).ap(AsyncEffect) provides applicative ability to apply functors to each other.', done => {
  const add = a => b => a + b;
  const resolving = reject => resolve => setTimeout(() => resolve(1), 10);
  λ.AsyncEffect.of(resolving).map(add).ap(λ.AsyncEffect.of(resolving)).trigger(error => error)(result => {
    expect(result).toBe(2);
    done();
  });
});

test('AsyncEffect.of(AsyncEffect -> AsyncEffect -> c).ap(AsyncEffect).ap(AsyncEffect) provides applicative interface for a functor of a function.', done => {
  const add = a => b => a + b;
  const resolving = reject => resolve => setTimeout(() => resolve(1), 10);
  λ.AsyncEffect.of(reject => resolve => resolve(add)).ap(λ.AsyncEffect.of(resolving)).ap(λ.AsyncEffect.of(resolving)).trigger(error => error)(result => {
    expect(result).toBe(2);
    done();
  });
});

test('No input function is executed until trigger is called.', done => {
  let some = 1;
  const resolving = reject => resolve => setTimeout(() => resolve(++some), 10);
  λ.AsyncEffect.of(resolving).flatMap(() => λ.AsyncEffect.of(resolving));
  setTimeout(() => {
    expect(some).toBe(3);
    done();
  }, 30);
  λ.AsyncEffect.of(resolving).flatMap(() => λ.AsyncEffect.of(resolving)).trigger(error => error)(result => {
    expect(some).toBe(3);
    expect(result).toBe(3);
  });
});

test('mergeAsyncEffects resolves array with results if all effects resolve.', done => {
  const resolvingOne = λ.AsyncEffect.of(_ => resolve => resolve('Resolving One'));
  const resolvingTwo = λ.AsyncEffect.of(_ => resolve => resolve('Resolving Two'));
  λ.mergeAsyncEffects(resolvingOne, resolvingTwo)
  .trigger
  (error => fail(error))
  (result => {
    expect(result).toEqual(['Resolving One', 'Resolving Two']);
    done();
  })
});

test('mergeAsyncEffects rejects with first error if any effects reject.', done => {
  const resolvingOne = λ.AsyncEffect.of(_ => resolve => resolve('Resolving One'));
  const resolvingTwo = λ.AsyncEffect.of(_ => resolve => resolve('Resolving Two'));
  const rejectingOne = λ.AsyncEffect.of(reject => _ => reject('Rejecting One'));
  const rejectingTwo = λ.AsyncEffect.of(reject => _ => reject('Rejecting Two'));
  λ.mergeAsyncEffects(resolvingOne, rejectingOne, rejectingTwo, resolvingTwo)
  .trigger
  (error => {
    expect(error).toBe('Rejecting One');
    done();
  })
  (result => fail(`This should not resolve with result ${result}`))
});