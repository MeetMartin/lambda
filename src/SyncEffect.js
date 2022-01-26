import { deepInspect } from "./utils.js";
import { Maybe, Nothing } from './Maybe.js';
import { Either } from './Either.js';
import { AsyncEffect } from './AsyncEffect.js';

/**
 * SyncEffect is a monad that allows you to safely work with synchronous side effects in JavaScript.
 *
 * SyncEffect expects as its input a function.
 *
 * SyncEffect is evaluated lazily and nothing is executed until a trigger function is called. It does not have any inner error/exception handling
 * mechanism for the effects of the trigger. Consider using the monads Maybe and Either for managing
 * the results of the trigger.
 *
 * In other languages and framework, SyncEffect can be also called the IO monad.
 *
 * @example
 * import {SyncEffect, log, upperCaseOf, liftA2, Either, isNull} from '@7urtle/lambda';
 *
 * // we create SyncEffect that expects a number from 0 to 1
 * // and based on that, it returns a value or throws an error
 * const throwError = () => {throw 'random failure'};
 * const dangerousFunction = value => value > 0.5 ? 'random success' : throwError();
 * const mySyncEffect = SyncEffect.of(dangerousFunction);
 *
 * // when you are ready, you can call trigger to trigger the side effect
 * // nothing is executed until the trigger is called
 * mySyncEffect.trigger(Math.random());
 * // => returns 'random success' or throws 'random failure' depending on Math.random() value
 *
 * // you can inspect SyncEffect by
 * mySyncEffect.inspect(); // => "SyncEffect(function...
 *
 * // as a functor the value inside is safely mappable
 * // map doesn't execute in case of an error and nothing executes until a trigger is called
 * mySyncEffect
 * .map(value => upperCaseOf(value))
 * .trigger(Math.random());
 * // => returns 'RANDOM SUCCESS' or throws 'random failure' depending on Math.random() value
 *
 * // as a monad SyncEffect can be safely flat mapped with other SyncEffects
 * // flatMap doesn't execute in case of an error and nothing executes until a trigger is called
 * SyncEffect.of(() => '7turtle').flatMap(a => SyncEffect.of(() => a + 's')).trigger();
 * // => '7urtles'
 * SyncEffect.of(() => {throw 'error'}).flatMap(a => SyncEffect.of(() => a + 's')).trigger();
 * // => throws 'error'
 *
 * // as an applicative functor you can apply SyncEffects to each other especially using liftA2 or liftA3
 * const add = a => b => a + b;
 * liftA2(add)(SyncEffect.of(() => 1)(SyncEffect.of(() => 2)).trigger(); // => 3
 * SyncEffect.of(() => add).ap(SyncEffect.of(() => 1)).ap(SyncEffect.of(() => 2)).trigger(); // => 3
 *
 * // in practice you can use SyncEffect to work for example with DOM
 * const DOMSyncEffect = SyncEffect.of(targetID => document.querySelector(targetID));
 * const TopOffsetSyncEffect = DOMSyncEffect.map(a => a.offsetTop);
 * const ClientHeightSyncEffect = DOMSyncEffect.map(a => a.clientHeight);
 *
 * TopOffsetSyncEffect.trigger('article'); // 1280
 * Either.try(ClientHeightSyncEffect.trigger('#dontexist')); // Failure('Uncaught TypeError: Cannot read property 'offsetTop' of null')
 */
export const SyncEffect = {
  of: trigger => getSyncEffect(trigger)
};

const getSyncEffect = trigger => ({
  trigger: trigger,
  inspect: () => `SyncEffect(${deepInspect(trigger)})`,
  map: fn => getSyncEffect(a => fn(trigger(a))),
  flatMap: fn => getSyncEffect(() => getSyncEffect(trigger).map(fn).trigger().trigger()),
  ap: f => getSyncEffect(trigger).flatMap(fn => f.map(fn))
});

/**
 * syncEffectToMaybe converts any SyncEffect monad to a Maybe monad with
 * Maybe Nothing if SyncEffect throws an error.
 *
 * @HindleyMilner syncEffectToMaybe :: SyncEffect -> Maybe
 *
 * @pure
 * @param {SyncEffect} syncEffectMonad
 * @return {Maybe}
 *
 * @example
 * import { syncEffectToMaybe, SyncEffect } from '@7urtle/lambda';
 *
 * eitherToMaybe(SyncEffect.of(() => '7urtle')); // => Just('7urtle')
 * eitherToMaybe(SyncEffect.of(() => undefined)); // => Nothing
 * eitherToMaybe(SyncEffect.of(() => { throw 'I am an error.'; }))); // => Nothing
 */
export const syncEffectToMaybe = syncEffectMonad => {
  try {
    return Maybe.of(syncEffectMonad.trigger());
  } catch(error) {
    return Nothing;
  }
};

/**
 * syncEffectToEither converts any SyncEffect monad to an Either monad with
 * Either Failure containing SyncEffect thrown error.
 *
 * @HindleyMilner syncEffectToEither :: SyncEffect -> Either
 *
 * @pure
 * @param {SyncEffect} syncEffectMonad
 * @return {Either}
 *
 * @example
 * import { syncEffectToEither, SyncEffect } from '@7urtle/lambda';
 *
 * syncEffectToEither(SyncEffect.of(() => '7urtle')); // => Success('7urtle')
 * syncEffectToEither(SyncEffect.of(() => { throw 'I am an error.'; })); // => Failure('I am an error.')
 */
export const syncEffectToEither = syncEffectMonad => Either.try(syncEffectMonad.trigger);

/**
 * syncEffectToAsyncEffect converts any SyncEffect monad to a AsyncEffect monad with
 * AsyncEffect rejecting thrown error.
 *
 * @HindleyMilner syncEffectToAsyncEffect :: SyncEffect -> AsyncEffect
 *
 * @pure
 * @param {SyncEffect} syncEffectMonad
 * @return {AsyncEffect}
 *
 * @example
 * import { syncEffectToAsyncEffect, SyncEffect } from '@7urtle/lambda';
 *
 * syncEffectToAsyncEffect(SyncEffect.of(() => '7urtle')); // resolves to '7urtle'
 * syncEffectToAsyncEffect(SyncEffect.of(() => { throw 'I am an error.'; })); // rejects 'I am an error.'
 */
 export const syncEffectToAsyncEffect = syncEffectMonad => 
  AsyncEffect
  .of(_ => resolve =>
    resolve(syncEffectMonad.trigger())
  );