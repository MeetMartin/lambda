import * as λ from '../src';

test('identity output is the same as input.', () => {
  expect(λ.identity('a')).toBe('a');
});

test('compose(f,g)(x) is equivalent to f(g(x)).', () => {
  const f = a => a + 'f';
  const g = a => a + 'g';
  expect(λ.compose(f, g)('a')).toBe(f(g('a')));
  expect(λ.compose(f, g)('a')).not.toBe(g(f('a')));
});

test('pipe(f,g)(x) is equivalent to g(f(x)).', () => {
  const f = a => a + 'f';
  const g = a => a + 'g';
  expect(λ.pipe(f, g)('a')).toBe(g(f('a')));
  expect(λ.pipe(f, g)('a')).not.toBe(f(g('a')));
});

test('pipe executes functions in reverse order to compose.', () => {
  const f = a => a + 'f';
  const g = a => a + 'g';
  expect(λ.pipe(g, f)('a')).toBe(λ.compose(f, g)('a'));
});

test('map executes input mapper over each member of input array [a] to output new array [b].', () => {
  const mapper = a => a + 'm';
  const list = ['a', 'b', 'c'];
  expect(λ.map(mapper)(list)).toEqual(['am', 'bm', 'cm']);
  expect(list).toEqual(['a', 'b', 'c']);
  expect(λ.map(mapper)(list)).toEqual(λ.map(mapper, list));
});

test('map maps function over inputted functor outputting resulting functor.', () => {
  class Functor {
    constructor(x) {
      this.value = x;
    }
    static of(x) {
      return new Functor(x);
    }
    map(fn) {
      return Functor.of(fn(this.value));
    }
    flatMap(fn) {
      return fn(this.value);
    }
  }
  expect(λ.map(a => a + 's')(Functor.of('7urtle')).value).toBe('7urtles');
  expect(λ.map(a => a + 's')(Functor.of('7urtle')).value).toBe(λ.map(a => a + 's', Functor.of('7urtle')).value);
});

test('flatMap flatMaps function outputting functor over inputted functor outputting resulting functor.', () => {
  class Functor {
    constructor(x) {
      this.value = x;
    }
    static of(x) {
      return new Functor(x);
    }
    map(fn) {
      return Functor.of(fn(this.value));
    }
    flatMap(fn) {
      return fn(this.value);
    }
  }
  expect(λ.flatMap(a => Functor.of(a + 's'))(Functor.of('7urtle')).value).toBe('7urtles');
  expect(λ.flatMap(a => Functor.of(a + 's'))(Functor.of('7urtle')).value).toBe(λ.flatMap(a => Functor.of(a + 's'), Functor.of('7urtle')).value);
});

test('liftA2 provides point-free way of writing calls over applicative functors and functions with arity 2.', () => {
  const add = a => b => a + b;
  class Applicative {
    constructor(x) {
      this.value = x;
    }
    static of(x) {
      return new Applicative(x);
    }
    map(fn) {
      return Applicative.of(fn(this.value));
    }
    ap(f) {
      return f.map(this.value);
    }
  }
  expect(λ.liftA2(add)(Applicative.of(1))(Applicative.of(2)).value).toBe(3);
  expect(λ.liftA2(add)(Applicative.of(1))(Applicative.of(2)).value).toBe(λ.liftA2(add, Applicative.of(1), Applicative.of(2)).value);
});

test('liftA3 provides point-free way of writing calls over applicative functors and functions with arity 3.', () => {
  const add3 = a => b => c => a + b + c;
  class Applicative {
    constructor(x) {
      this.value = x;
    }
    static of(x) {
      return new Applicative(x);
    }
    map(fn) {
      return Applicative.of(fn(this.value));
    }
    ap(f) {
      return f.map(this.value);
    }
  }
  expect(λ.liftA3(add3)(Applicative.of(1))(Applicative.of(2))(Applicative.of(3)).value).toBe(6);
  expect(λ.liftA3(add3)(Applicative.of(1))(Applicative.of(2))(Applicative.of(3)).value).toBe(λ.liftA3(add3, Applicative.of(1), Applicative.of(2), Applicative.of(3)).value);
});

test('contact outputs concatenated inputs of strings, arrays and objects or outputs undefined for other types.', () => {
  expect(λ.concat('cd')('ab')).toBe('abcd');
  expect(λ.concat([3, 4])([1, 2])).toEqual([1, 2, 3, 4]);
  expect(λ.concat({here: 'there'})({hi: 'hello'})).toEqual({hi: 'hello', here: 'there'});
  expect(λ.concat({here: {here: 'there'}})({hi: 'hello'})).toEqual({hi: 'hello', here: {here: 'there'}});
  expect(λ.concat('cd')(1)).toBe(undefined);
  expect(λ.concat('cd')('ab')).toBe(λ.concat('cd', 'ab'));
});

test('includes output is true if b includes a.', () => {
  expect(λ.includes('rt')('7urtle')).toBe(true);
  expect(λ.includes('7urtle')('7urtle')).toBe(true);
  expect(λ.includes('turtle')('7urtle')).toBe(false);
  expect(λ.includes(1)([1, 2, 3])).toBe(true);
  expect(λ.includes(4)([1, 2, 3])).toBe(false);
  expect(λ.includes('rt')('7urtle')).toBe(λ.includes('rt', '7urtle'));
});

test('indexOf outputs position of input a withing input b or undefined if it is not found.', () => {
  expect(λ.indexOf('7')('7urtle')).toBe(0);
  expect(λ.indexOf(7)('7urtle')).toBe(0);
  expect(λ.indexOf('urtle')('7urtle')).toBe(1);
  expect(λ.indexOf('rt')('7urtle')).toBe(2);
  expect(λ.indexOf(2)([1, 2, 3])).toBe(1);
  expect(λ.indexOf('8')('7urtle')).toBe(undefined);
  expect(λ.indexOf(4)([1, 2, 3])).toBe(undefined);
  expect(λ.indexOf('a')('aa')).toBe(0);
  expect(λ.indexOf('a')('aa')).toBe(λ.indexOf('a', 'aa'));
});

test('lastIndexOf outputs position of input a withing input b looking from the end or it retuns undefined if it is not found.', () => {
  expect(λ.lastIndexOf('7')('7urtle')).toBe(0);
  expect(λ.lastIndexOf(7)('7urtle')).toBe(0);
  expect(λ.lastIndexOf('urtle')('7urtle')).toBe(1);
  expect(λ.lastIndexOf('rt')('7urtle')).toBe(2);
  expect(λ.lastIndexOf('8')('7urtle')).toBe(undefined);
  expect(λ.lastIndexOf(2)([1, 2, 3, 2])).toBe(3);
  expect(λ.lastIndexOf(4)([1, 2, 3])).toBe(undefined);
  expect(λ.lastIndexOf('a')('aa')).toBe(1);
  expect(λ.lastIndexOf('a')('aa')).toBe(λ.lastIndexOf('a', 'aa'));
});

test('memoize uses input memory to save output of input function and then uses it to lookup result on a repeated run.', () => {
  const addTwo = a => a + 2;
  let memory = {};
  const memoizedAddTwo = λ.memoize(memory)(addTwo);
  expect(memoizedAddTwo(1)).toBe(3);
  expect(memoizedAddTwo(1)).toBe(3);
  expect(memory[1]).toBe(3);
  expect(λ.memoize(memory)(addTwo)(1)).toBe(λ.memoize(memory, addTwo)(1));
});

test('memo takes input function and returns it enhanced by memoization which ensures that each result is always remembered internally and executed only once.', () => {
  const addTwo = a => a + 2;
  let count = 0;
  const increaseCount = () => ++count;
  const memoAddTwo = λ.memo(addTwo);
  const memoAddThree = λ.memo(a => a + 3);

  expect(memoAddTwo(1)).toBe(3);
  expect(memoAddThree(1)).toBe(4);
  increaseCount();
  increaseCount();
  expect(count).toBe(2);

  const memoIncreaseCount = λ.memo(increaseCount);
  memoIncreaseCount();
  memoIncreaseCount();
  memoIncreaseCount();
  expect(count).toBe(3);
});