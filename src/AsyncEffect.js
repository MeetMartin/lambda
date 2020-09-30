import {deepInspect} from "./utils";
import {nary} from "./arity";
import {isFunction} from "./conditional";

/**
 * AsyncEffect is a monad that allows you to safely work with asynchronous side effects in JavaScript.
 *
 * AsyncEffect expects as its input a function that takes three inputs of a reject function, a resolve function,
 * and a value. Reject function is called on failure, resolve function is called on success, and
 * value is used as an input for calculation.
 *
 * AsyncEffect is evaluated lazily and nothing is executed until a trigger function is called.
 *
 * @example
 * import {AsyncEffect, log, upperCaseOf, liftA2, liftA3} from '@7urtle/lambda';
 *
 * // we create AsyncEffect that expects a number from 0 to 1
 * // and based on that, it resolve or rejects 10 milliseconds after it is triggered
 * const myAsyncEffect = AsyncEffect
 * .of(reject => resolve => value =>
 *     setTimeout(() => value > 0.5 ? resolve('random success') : reject('random failure'), 10)
 * );
 *
 * // you can inspect AsyncEffect by
 * myAsyncEffect.inspect(); // => "AsyncEffect(function...
 *
 * // when you are ready, you can call trigger to trigger the side effect
 * // nothing is executed until the trigger is called
 * myAsyncEffect
 * .trigger
 * (error => log(error))
 * (result => log(result))
 * (Math.random());
 * // => logs 'random success' or 'random failure' depending on Math.random() value
 *
 * // you can also turn AsyncEffect into a JavaScript Promise
 * myAsyncEffect
 * .promise(Math.random())
 * .then(result => log(result), error => log(error));
 * // => logs 'random success' or 'random failure' depending on Math.random() value
 *
 * // thrown exceptions lead AsyncEffect to reject
 * AsyncEffect
 * .of(() => {
 *     throw 'error';
 * })
 * .trigger(log)(log)();
 * // => logs 'error'
 *
 * // as a functor the value inside is safely mappable
 * // map doesn't execute in case of an error and nothing executes until a trigger is called
 * myAsyncEffect
 * .map(value => upperCaseOf(value))
 * .trigger(log)(log)(Math.random());
 * // => logs 'RANDOM SUCCESS' or 'random failure' depending on Math.random() value
 *
 * // as a monad AsyncEffect can be safely flat mapped with other AsyncEffects
 * // flatMap doesn't execute in case of an error and nothing executes until a trigger is called
 * AsyncEffect
 * .of(reject => resolve => value => resolve(value))
 * .flatMap(a => AsyncEffect.of(reject => resolve => value => resolve(a + 's')))
 * .trigger(log)(log)('7urtle');
 * // => logs '7urtles'
 *
 * // as an applicative functor you can apply AsyncEffects to each other especially using liftA2 or liftA3
 * const add = a => b => a + b;
 * const AS1 = AsyncEffect.of(reject => resolve => value => resolve(1));
 * const AS2 = AsyncEffect.of(reject => resolve => value => resolve(2));
 * liftA2(add)(AS1)(AS2); // => resolve(3)
 *
 * const ASFail = AsyncEffect.of(() => throw 'error');
 * liftA3(add)(ASFail)(AS1)(AS2); // => reject('error')
 *
 * // AsyncEffect.of as well as AsyncEffect.trigger accept both curried and ternary functions
 * AsyncEffect.of((reject, resolve, value) => resolve(value)).trigger(log, log, '7urtle'); // logs '7urtle'
 *
 * // as an example you can use AsyncEffect to help you work with axios
 * AsyncEffect
 * .of(reject => resolve => value => axios.get(value).then(resolve, reject))
 * .map(toUpperCaseOf)
 * .trigger
 * (error => log(error))
 * (result => log(response.data))
 * ('/my/ajax/url');
 */
export const AsyncEffect = {
  of: trigger => getAsyncEffect(nary(reject => resolve => value => {
    try {
      const result = trigger(reject, resolve, value);
      return isFunction(result) ? result(resolve)(value) : result;
    } catch(error) {
      reject(error);
    }
  }))
};

const getAsyncEffect = trigger => ({
  trigger: trigger,
  inspect: () => `AsyncEffect(${deepInspect(trigger)})`,
  promise: value => new Promise((resolve, reject) => trigger(reject)(resolve)(value)),
  map: fn => getAsyncEffect(nary(reject => resolve => value => trigger(reject)(a => resolve(fn(a)))(value))),
  flatMap: fn => getAsyncEffect(nary(reject => resolve => value => trigger(reject)(x => fn(x).trigger(reject)(resolve)(value))(value))),
  ap: f => getAsyncEffect(trigger).flatMap(fn => f.map(fn))
});