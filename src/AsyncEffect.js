import { deepInspect, lengthOf } from "./utils";
import { nary } from "./arity";
import { isEqual, isFalse, isFunction } from "./conditional";
import { map } from "./core";

/**
 * AsyncEffect is a monad that allows you to safely work with asynchronous side effects in JavaScript.
 *
 * AsyncEffect expects as its input a function that takes two inputs of a reject function, and a resolve
 * function. Reject function is called on failure and resolve function is called on success. It is similar
 * to using JavaScript Promise and AsyncEffect can be directly created from a Promise turning it into a monad.
 *
 * AsyncEffect is evaluated lazily and nothing is executed until a trigger function is called.
 *
 * AsyncEffect can also be called Future monad in other libraries or languages.
 *
 * @example
 * import {AsyncEffect, log, upperCaseOf, liftA2, liftA3} from '@7urtle/lambda';
 *
 * // we create AsyncEffect that expects a number from 0 to 1
 * // and based on that, it resolve or rejects 10 milliseconds after it is triggered
 * const myAsyncEffect = AsyncEffect
 * .of(reject => resolve =>
 *     setTimeout(() => Math.random() > 0.5 ? resolve('random success') : reject('random failure'), 10)
 * );
 *
 * // we could also create AsyncEffect from a function returning JavaScript Promise
 * const myPromise = () => new Promise((resolve, reject) =>
 *     setTimeout(() => Math.random() > 0.5 ? resolve('random success') : reject('random failure'), 10)
 * );
 * const promiseAsyncEffect = AsyncEffect.ofPromise(myPromise);
 *
 * // you can inspect AsyncEffect by
 * myAsyncEffect.inspect(); // => "AsyncEffect(function...
 *
 * // when you are ready, you can call trigger to trigger the side effect
 * // nothing is executed until the trigger is called
 * myAsyncEffect
 * .trigger
 * (error => log(error))
 * (result => log(result));
 * // => logs 'random success' or 'random failure' depending on Math.random() value
 *
 * // you can also turn AsyncEffect into a JavaScript Promise
 * myAsyncEffect
 * .promise()
 * .then(result => log(result), error => log(error));
 * // => logs 'random success' or 'random failure' depending on Math.random() value
 *
 * // thrown exceptions lead AsyncEffect to reject
 * AsyncEffect
 * .of(() => {
 *     throw 'error';
 * })
 * .trigger(log)(log);
 * // => logs 'error'
 *
 * // as a functor the value inside is safely mappable
 * // map doesn't execute in case of an error and nothing executes until a trigger is called
 * myAsyncEffect
 * .map(value => upperCaseOf(value))
 * .trigger(log)(log);
 * // => logs 'RANDOM SUCCESS' or 'random failure' depending on Math.random() value
 *
 * // as a monad AsyncEffect can be safely flat mapped with other AsyncEffects
 * // flatMap doesn't execute in case of an error and nothing executes until a trigger is called
 * AsyncEffect
 * .of(reject => resolve => resolve('7urtle'))
 * .flatMap(a => AsyncEffect.of(reject => resolve => resolve(a + 's')))
 * .trigger(log)(log);
 * // => logs '7urtles'
 *
 * // as an applicative functor you can apply AsyncEffects to each other especially using liftA2 or liftA3
 * const add = a => b => a + b;
 * const AS1 = AsyncEffect.of(reject => resolve => resolve(1));
 * const AS2 = AsyncEffect.of(reject => resolve => resolve(2));
 * liftA2(add)(AS1)(AS2); // => resolve(3)
 *
 * const ASFail = AsyncEffect.of(() => {throw 'error'});
 * liftA3(add)(ASFail)(AS1)(AS2); // => reject('error')
 *
 * // AsyncEffect.of as well as AsyncEffect.trigger accept both curried and binary functions
 * AsyncEffect.of((reject, resolve) => resolve('7urtle')).trigger(log, log); // logs '7urtle'
 *
 * // as an example you can use AsyncEffect to help you work with axios or fs
 *
 * // axios example
 * import axios from 'axios';
 * const getFromURL = url => AsyncEffect.ofPromise(() => axios.get(url));
 *
 * getFromURL('/my/ajax/url')
 * .trigger
 * (error => log(error))
 * (result => log(result.data));
 *
 * // reading file example
 * import fs from 'fs';
 * const readFile => input =>
 *     AsyncEffect
 *     .of(reject => resolve =>
 *         fs.readFile(input, (err, data) =>
 *             err ? reject(err) : resolve(data)
 *         )
 *     );
 *
 * readFile('./file.txt')
 * .trigger
 * (error => log(error))
 * (result => log(result));;
 */
export const AsyncEffect = {
  of: trigger => getAsyncEffect(nary(reject => resolve => {
    try {
      const result = trigger(reject, resolve);
      return isFunction(result) ? result(resolve) : result;
    } catch(error) {
      reject(error);
    }
  })),
  ofPromise: promise => AsyncEffect.of(reject => resolve =>
      promise().then(resolve).catch(reject)
  )
};

const getAsyncEffect = trigger => ({
  trigger: trigger,
  inspect: () => `AsyncEffect(${deepInspect(trigger)})`,
  promise: () => new Promise((resolve, reject) => trigger(reject)(resolve)),
  map: fn => getAsyncEffect(nary(reject => resolve => trigger(reject)(a => resolve(fn(a))))),
  flatMap: fn => getAsyncEffect(nary(reject => resolve => trigger(reject)(x => fn(x).trigger(reject)(resolve)))),
  ap: f => getAsyncEffect(trigger).flatMap(fn => f.map(fn))
});

/**
 * mergeAsyncEffects outputs AsyncEffect which resolves with array of all input AsyncEffects or rejects with the first effect rejected.
 *
 * @HindleyMilner mergeAsyncEffects :: ([AsyncEffect]) -> AsyncEffect
 *
 * @pure
 * @param {AsyncEffect} asyncEffects
 * @return {AsyncEffect}
 *
 * @example
 * import { mergeAsyncEffects, AsyncEffect } from '@7urtle/lambda';
 * 
 * const resolvingOne = AsyncEffect.of(_ => resolve => resolve('Resolving One'));
 * const resolvingTwo = AsyncEffect.of(_ => resolve => resolve('Resolving Two'));
 *
 * mergeAsyncEffects(resolvingOne, resolvingTwo)
 * .trigger(console.log)(console.log);
 * // => logs ['Resolving One', 'Resolving Two']
 * 
 * const rejectingOne = AsyncEffect.of(reject => _ => reject('Rejecting One'));
 * const rejectingTwo = AsyncEffect.of(reject => _ => reject('Rejecting Two'));
 * 
 * mergeAsyncEffects(resolvingOne, rejectingOne, rejectingTwo, resolvingTwo)
 * .trigger(console.log)(console.log);
 * // => logs 'Rejecting One'
 */
export const mergeAsyncEffects = (...asyncEffects) =>
  AsyncEffect
  .ofPromise(
      () => Promise.all(map(a => a.promise())(asyncEffects))
  );