import * as λ from '../src';

test('Case.of([]).inspect() outputs string Case(a -> b).', () => {
  expect(λ.Case.of([['_', '7turtle']]).inspect().includes('Case(function')).toBe(true);
});

test('Case.of([]).match(a) matches input a against map provided as input of Case.', () => {
  const types = {
    DISPATCH: 'DISPATCH'
  };
  const caseExpression = λ.Case.of([
    [1, 'one'],
    [types.DISPATCH, 'dispatch'],
    ['_', '7turtle']
  ]);
  expect(caseExpression.match(1)).toBe('one');
  expect(caseExpression.match(types.DISPATCH)).toBe('dispatch');
  expect(caseExpression.match(3)).toBe('7turtle');
});

test('Case.of([]).match(a) outputs undefined if no matching case is found.', () => {
  expect(λ.Case.of([]).match(1)).toBe(undefined);
  expect(λ.Case.of([[1, 'one']]).match(2)).toBe(undefined);
  expect(λ.Case.of([['_', 'one']]).match('x')).toBe('one');
  expect(λ.Case.of([['a', 'one']]).match('b')).toBe(undefined);
  expect(λ.Case.of([]).match('b')).toBe(undefined);
});

test('Case.of([]).map(a -> b) composes function over Case match function.', () => {
  expect(λ.Case.of([[1, '7turtle']]).map(a => a + 's').match(1)).toBe('7turtles');
  expect(λ.Case.of([[1, '7turtle']]).map(a => a + 's').match(2)).toBe(undefined);
});

test('Case.of([]).map(a -> Case) outputs Case(Case).', () => {
  expect(λ.Case.of([[1, '7turtle']]).map(a => λ.Case.of([[1, a + 's']])).match(1).match(1)).toBe('7turtles');
});

test('Case.of([]).flatMap(a -> Case) outputs Case.', () => {
  expect(λ.Case.of([['_', '7urtle']]).flatMap(a => λ.Case.of([['_', a + 's']])).match('_')).toBe('7urtles');
  expect(λ.Case.of([['_', '7urtle']]).flatMap(a => λ.Case.of([['x', a + 's']])).match('x')).toBe('7urtles');
  expect(λ.Case.of([[1, 'I am']]).flatMap(a => λ.Case.of([[1, a + ' happy']])).match(1)).toBe('I am happy');
  expect(λ.Case.of([[1, 'I am']]).flatMap(a => λ.Case.of([])).match(1)).toBe(undefined);
  expect(λ.Case.of([]).flatMap(a => λ.Case.of([])).match(1)).toBe(undefined);
});

test('Case.of([]).map(a -> b).ap(Case) provides applicative ability to apply functors to each other.', () => {
  const add = a => b => a + b;
  expect(λ.Case.of([[1, 'I am']]).map(add).ap(λ.Case.of([[1, ' happy']])).match(1)).toBe('I am happy');
})

test('Case.of(Case -> Case -> c).ap(Case).ap(Case) provides applicative interface for a functor of a function.', () => {
  const add = a => b => a + b;
  expect(λ.Case.of([[1, add]]).ap(λ.Case.of([[1, 'I am']])).ap(λ.Case.of([[1, ' happy']])).match(1)).toBe('I am happy');
  expect(λ.Case.of([[1, add]]).ap(λ.Case.of([])).ap(λ.Case.of([[1, 'I am']])).match(1)).toBe(undefined);
});