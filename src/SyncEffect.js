import {deepInspect} from "./utils";
import {isUndefined} from "./conditional";

/**
 * SyncEffect is a monad that allows you to safely work with synchronous side effects in JavaScript.
 *
 * SyncEffect expects as its input a function.
 *
 * SyncEffect is evaluated lazily and nothing is executed until a trigger function is called. It does not have any inner error/exception handling
 * mechanism for the effects of the trigger. Consider using the monads Maybe and Either for managing
 * the results of the trigger.
 *
 * @example
 * import {SyncEffect, log, upperCaseOf, liftA2, Either, isNull} from '@7urtle/lambda';
 *
 * // we create SyncEffect that expects a number from 0 to 1
 * // and based on that, it returns a value or throws an error
 * const mySyncEffect = SyncEffect.of(value => value > 0.5 ? 'random success' : throw 'random failure');
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
 * // => returns 'random success' or throws 'random failure' depending on Math.random() value
 *
 * // as a monad SyncEffect can be safely flat mapped with other SyncEffects
 * // flatMap doesn't execute in case of an error and nothing executes until a trigger is called
 * SyncEffect.of(() => '7turtle').flatMap(a => SyncEffect.of(() => a + 's')).trigger();
 * // => '7urtles'
 * SyncEffect.of(() => throw 'error').flatMap(a => SyncEffect.of(() => a + 's')).trigger();
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
  of: trigger => getSyncEffect(trigger),
  wrap: value => getSyncEffect(() => value)
};

const getSyncEffect = trigger => ({
  trigger: trigger,
  inspect: () => `SyncEffect(${deepInspect(trigger)})`,
  map: fn => getSyncEffect(a => fn(trigger(a))),
  flatMap: fn => getSyncEffect(() => getSyncEffect(trigger).map(fn).trigger().trigger()),
  ap: f => getSyncEffect(trigger).flatMap(fn => f.map(fn))
});