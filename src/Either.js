import {deepInspect} from "./utils";
import {nary} from "./arity";

/**
 * Either is an excellent monad for handling error states and it is fairly similar to our monad Maybe. Either.Failure
 * represents an error state and Either.Success represents a success state.
 *
 * Either.of expects a value as its input. Either.of is the same as Either.Success. You can initiate Either
 * in its error state by Either.Failure.
 *
 * You can also initiate it using Either.try which expects a function as an input. It is Failure if an error
 * or exception is thrown. It is Success if there are no errors or exceptions.
 *
 * Either is called Either because it allows you to branch based on an error state. You want to use Either
 * for situations when you don't know whether there might be an error. It makes the very visible that an error
 * can occur and it forces the consumer to handle the situation.
 *
 * @example
 * import {either, Either, upperCaseOf, liftA2} from '@7urtle/lambda';
 *
 * // in the example we randomly give Either a value or throw an error. Either.try() outputs an instance of Either.
 * const myEither = Either.try(() => Math.random() > 0.5 ? 'random success' : throw 'random failure');
 *
 * // you can also return Either.Failure or Either.Success based on a function logic
 * const myFunction = Math.random() > 0.5 ? Either.Success('random success') : Either.Failure('random failure');
 *
 * // you could access the actual value like this
 * myEither.value; // => 'random success' or 'random failure'
 *
 * // you can also inspect it by
 * myEither.inspect(); // => "Success('random success')" or Failure('random failure')
 *
 * // Either.of and Either.Success both represent success states
 * Either.of('some value').inspect() === Either.Success('some value').inspect(); // => true
 *
 * // you can check if the value is Failure
 * myEither.isFailure(); // => true or false
 * Either.of('abc').isFailure(); // => false
 * Either.Success('anything').isFailure(); // => false
 * Either.Failure('anything').isFailure(); // => true
 * Either.try(() => throw 'error').isFailure(); // => true
 *
 * // you can check if the value is Success
 * myEither.isSuccess(); // => true or false
 * Either.of('abc').isSuccess(); // => true
 * Either.Success('anything').isSuccess(); // => true
 * Either.Failure('anything').isSuccess(); // => false
 * Either.try(() => throw 'error').isSuccess(); // => false
 *
 * // as a functor the value inside is safely mappable (map doesn't execute over Failure)
 * myEither.map(value => upperCaseOf(value));
 * myEither.inspect(); // => "Success('RANDOM SUCCESS')" or "Failure('random failure')"
 *
 * // as a monad Either can be safely flat mapped with other Eithers (flatMap doesn't execute over Failure)
 * Either.of(3).flatMap(a => Either.of(a + 2)).inspect(); // => 'Success(5)'
 * Either.Failure(3).flatMap(a => Either.of(null)).inspect(); // => 'Failure(3)'
 * Either.of(3).flatMap(a => a + 2); // => 5
 *
 * // as an applicative functor you can apply Eithers to each other especially using liftA2 or liftA3
 * const add = a => b => a + b;
 * liftA2(add)(Either.of(2))(Either.of(3)); // => Success(5)
 * Either.of(1).map(add).ap(Either.of(2)).inspect(); // => 'Success(3)'
 * Either.Failure(1).map(add).ap(Either.of(2)).inspect(); // => 'Failure(1)'
 * Either.of(add).ap(Either.of(1)).ap(Either.of(2)).inspect(); // => 'Success(3)'
 */
export const Either = {
  of: value => Success(value),
  Success: value => Success(value),
  Failure: value => Failure(value),
  try: fn => {
    try {
      return Success(fn());
    } catch(e) {
      return Failure(e.message);
    }
  }
};

const Failure = value => ({
  value: value,
  inspect: () => `Failure(${deepInspect(value)})`,
  isFailure: () => true,
  isSuccess: () => false,
  map: () => Failure(value),
  flatMap: () => Failure(value),
  ap: () => Failure(value)
});

const Success = value => ({
  value: value,
  inspect: () => `Success(${deepInspect(value)})`,
  isFailure: () => false,
  isSuccess: () => true,
  map: fn => Either.of(fn(value)),
  flatMap: fn => fn(value),
  ap: f => f.map(value)
});

/**
 * either outputs result of a function onRight if input Either is Success or outputs result of a function onLeft if input Either is Failure.
 *
 * either can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner either :: (a -> b) -> (b -> c) -> Either
 *
 * @pure
 * @param {function} onFailure
 * @param {function} onSuccess
 * @param {Either} functorEither
 * @return {*}
 *
 * @example
 * import {either, Either} from '@7urtle/lambda';
 *
 * either(a => 'error ' + a)(a => 'success ' + a)(Either.of('abc')); // => 'success abc'
 * either(a => 'error ' + a)(a => 'success ' + a)(Either.Failure('failure')); // => 'error failure'
 * either(a => 'error ' + a)(a => 'success ' + a)(Either.try(() => throw 'failure')); // => 'error failure'
 *
 * // either can be called both as a curried unary function or as a standard ternary function
 * either(a => 'error ' + a)(a => 'success ' + a)(Either.of('abc')) === either(a => 'error ' + a, a => 'success ' + a, Either.of('abc'));
 */
export const either = nary(onFailure => onSuccess => functorEither =>
  functorEither.isFailure()
    ? onFailure(functorEither.value)
    : onSuccess(functorEither.value));