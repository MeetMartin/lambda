import { deepInspect } from './utils';
import { nary } from './arity';
import { isNothing } from './conditional';
import { reduce } from './list';
import { Either } from './Either';
import { SyncEffect } from './SyncEffect';
import { AsyncEffect } from './AsyncEffect';

/**
 * Maybe is one of the simplest and well known monads. Maybe is also quite similar to our monad Either.
 *
 * Maybe expects a value as its input. It is Nothing if the value is null, undefined, or empty. It returns
 * Just for all other cases.
 *
 * Maybe is called Maybe because it maybe holds a value. You want to use Maybe for situations when you don't
 * know whether there is going to be an input. For example for your API endpoint, it makes it very obvious
 * that you service may not receive a value by mistake and forces the consumer of Maybe to safely deal with it.
 *
 * In other languages, Maybe monad can also be called Option monad or Nullable monad.
 *
 * @example
 * import {maybe, Maybe, upperCaseOf, liftA2} from '@7urtle/lambda';
 *
 * // in the example we randomly give Maybe a value or undefined. Maybe.of() outputs an instance of Maybe.
 * const myMaybe = Maybe.of(Math.random() > 0.5 ? 'random success' : undefined);
 *
 * // you could access the actual value like this
 * myMaybe.value; // => 'random success' or undefined
 *
 * // you can also inspect it by
 * myMaybe.inspect(); // => "Just('random success')" or "Nothing"
 *
 * // you can check if the value is Nothing
 * myMaybe.isNothing(); // => true or false
 * Maybe.of('abc').isNothing(); // => false
 * Maybe.of([]).isNothing(); // => true
 *
 * // you can check if the value is Just
 * myMaybe.isJust(); // => true or false
 * Maybe.of(123).isJust(); // => true
 * Maybe.of(null).isJust(); // => false
 *
 * // as a functor the value inside is safely mappable (map doesn't execute over Nothing)
 * myMaybe.map(value => upperCaseOf(value));
 * myMaybe.inspect(); // => "Just('RANDOM SUCCESS')" or "Nothing"
 *
 * // as a monad Maybe can be safely flat mapped with other Maybes (flatMap doesn't execute over Nothing)
 * Maybe.of(3).flatMap(a => Maybe.of(a + 2)).inspect(); // => 'Just(5)'
 * Maybe.of(3).flatMap(a => Maybe.of(null)).inspect(); // => 'Nothing'
 * Maybe.of(3).flatMap(a => a + 2); // => 5
 *
 * // as an applicative functor you can apply Maybes to each other especially using liftA2 or liftA3
 * const add = a => b => a + b;
 * liftA2(add)(Maybe.of(2))(Maybe.of(3)); // => Just(5)
 * Maybe.of(1).map(add).ap(Maybe.of(2)).inspect(); // => 'Just(3)'
 * Maybe.of(1).map(add).ap(Maybe.of(null)).inspect(); // => 'Nothing'
 * Maybe.of(add).ap(Maybe.of(1)).ap(Maybe.of(2)).inspect(); // => 'Just(3)'
 *
 * // as an example you can use Maybe to help you work with DOM like this
 * Maybe.of(document.querySelector('#iexist')).map(a => a.offsetTop); // => Just(1240)
 * Maybe.of(document.querySelector('#idontexist')).map(a => a.offsetTop); // => Nothing
 * maybe
 * (() => 'error: the object doesnt exist')
 * (a => 'offset from top is ' + a)
 * (Maybe.of(document.querySelector('#iexist')).map(a => a.offsetTop));
 * 
 * // to read API request you can use Maybe this way
 * const getQuery = body =>
 *   Maybe
 *   .of(body.queryResult)
 *   .flatMap(a => Maybe.of(a.queryText));
 */
export const Maybe = {
  of: value => isNothing(value) ? Nothing(value) : Just(value),
  Just: value => Just(value),
  Nothing: value => Nothing(value),
};

const Nothing = value => ({
  value: value,
  inspect: () => 'Nothing',
  isNothing: () => true,
  isJust: () => false,
  map: () => Nothing(value),
  flatMap: () => Nothing(value),
  ap: () => Nothing(value)
});

const Just = value => ({
  value: value,
  inspect: () => `Just(${deepInspect(value)})`,
  isNothing: () => false,
  isJust: () => true,
  map: fn => Maybe.of(fn(value)),
  flatMap: fn => fn(value),
  ap: f => f.map(value)
});

/**
 * maybe outputs result of a function onJust if input Maybe is Just or outputs input error if input Maybe is Nothing.
 *
 * maybe can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner maybe :: (a -> b) -> (c -> d) -> Maybe -> e
 *
 * @pure
 * @param {functioon} onNothing
 * @param {function} onJust
 * @param {Maybe} functorMaybe
 * @return {*}
 *
 * @example
 * import {maybe, Maybe} from '@7urtle/lambda';
 *
 * maybe(() => 'error')(value => value)(Maybe.of('abc')); // => 'abc'
 * maybe(() => 'error')(value => value)(Maybe.of(undefined)); // => 'error'
 * maybe(() => 'error')(() => 'not error)(Maybe.of(undefined)) === Maybe.of(undefined).isNothing() ? 'error' ? 'not error';
 *
 * // maybe can be called both as a curried unary function or as a standard ternary function
 * maybe(() => 'error')(value => value)(Maybe.of('abc')) === maybe('error', value => value, Maybe.of('abc'));
 */
export const maybe = nary(onNothing => onJust => functorMaybe =>
  functorMaybe.isNothing()
    ? onNothing()
    : onJust(functorMaybe.value));

/**
 * mergeMaybes outputs Maybe of array with all Maybe values depending whether they are Nothing or Just.
 *
 * @HindleyMilner mergeMaybes :: ([Maybe]) -> Maybe
 *
 * @pure
 * @param {Maybe} maybes
 * @return {Maybe}
 *
 * @example
 * import { mergeMaybes, Either } from '@7urtle/lambda';
 *
 * mergeMaybes(Maybe.of('abc'), Maybe.of('def')); //  => Just(['abc', 'def'])
 * mergeMaybes(Maybe.of('abc'), Maybe.Nothing()); // => Nothing
 * mergeMaybes(Maybe.Nothing(), Maybe.of('def')); // => Nothing
 * mergeMaybes(Maybe.Nothing(), Maybe.Nothing()); // => Nothing
 */
export const mergeMaybes = (...maybes) =>
  reduce
  (Maybe.Just([]))
  ((accumulator, current) =>
    current.isNothing()
    ? Maybe.Nothing()
    : accumulator.isNothing()
      ? Maybe.Nothing()
      : Maybe.Just([...accumulator.value, current.value])
  )
  (maybes);

/**
 * maybeToEither converts any Maybe monad to an Either monad with
 * 'Maybe is Nothing.' Failure if the Maybe is Nothing.
 *
 * @HindleyMilner maybeToEither :: Maybe -> Either
 *
 * @pure
 * @param {Maybe} maybeMonad
 * @return {Either}
 *
 * @example
 * import { maybeToEither, Maybe } from '@7urtle/lambda';
 *
 * maybeToEither(Maybe.of('7urtle')); // => Success('7urtle')
 * maybeToEither(Maybe.of(undefined)); // => Failure('Maybe is Nothing.')
 */
export const maybeToEither = maybeMonad =>
  maybe
  (() => Either.Failure('Maybe is Nothing.'))
  (value => Either.Success(value))
  (maybeMonad);

/**
 * maybeToSyncEffect converts any Maybe monad to an SyncEffect monad with
 * 'Maybe is Nothing.' thrown error if the Maybe is Nothing.
 *
 * @HindleyMilner maybeToSyncEffect :: Maybe -> SyncEffect
 *
 * @pure
 * @param {Maybe} maybeMonad
 * @return {SyncEffect}
 *
 * @example
 * import { maybeToSyncEffect, Maybe } from '@7urtle/lambda';
 *
 * maybeToSyncEffect(Maybe.of('7urtle')).trigger(); // => '7urtle'
 * maybeToSyncEffect(Maybe.of(undefined)).trigger(); // throws 'Maybe is Nothing.'
 */
export const maybeToSyncEffect = maybeMonad =>
  maybe
  (() => SyncEffect.of(() => { throw 'Maybe is Nothing.' }))
  (value => SyncEffect.of(() => value))
  (maybeMonad);

/**
 * maybeToAsyncEffect converts any Maybe monad to an AsyncEffect monad with
 * 'Maybe is Nothing.' reject if the Maybe is Nothing.
 *
 * @HindleyMilner maybeToAsyncEffect :: Maybe -> AsyncEffect
 *
 * @pure
 * @param {Maybe} maybeMonad
 * @return {AsyncEffect}
 *
 * @example
 * import { maybeToAsyncEffect, Maybe } from '@7urtle/lambda';
 *
 * maybeToAsyncEffect(Maybe.of('7urtle')); // resolves to '7urtle'
 * maybeToAsyncEffect(Maybe.of(undefined)); // rejects 'Maybe is Nothing.'
 */
export const maybeToAsyncEffect = maybeMonad =>
  maybe
  (() => AsyncEffect.of(reject => _ => reject('Maybe is Nothing.')))
  (value => AsyncEffect.of(_ => resolve => resolve(value)))
  (maybeMonad);