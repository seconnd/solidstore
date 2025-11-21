import { Subject } from 'rxjs';
export declare class BasketObservable extends Subject<any> {
    constructor();
    pipe0: {
        (): import("rxjs").Observable<any>;
        <A>(op1: import("rxjs").OperatorFunction<any, A>): import("rxjs").Observable<A>;
        <A, B>(op1: import("rxjs").OperatorFunction<any, A>, op2: import("rxjs").OperatorFunction<A, B>): import("rxjs").Observable<B>;
        <A, B, C>(op1: import("rxjs").OperatorFunction<any, A>, op2: import("rxjs").OperatorFunction<A, B>, op3: import("rxjs").OperatorFunction<B, C>): import("rxjs").Observable<C>;
        <A, B, C, D>(op1: import("rxjs").OperatorFunction<any, A>, op2: import("rxjs").OperatorFunction<A, B>, op3: import("rxjs").OperatorFunction<B, C>, op4: import("rxjs").OperatorFunction<C, D>): import("rxjs").Observable<D>;
        <A, B, C, D, E>(op1: import("rxjs").OperatorFunction<any, A>, op2: import("rxjs").OperatorFunction<A, B>, op3: import("rxjs").OperatorFunction<B, C>, op4: import("rxjs").OperatorFunction<C, D>, op5: import("rxjs").OperatorFunction<D, E>): import("rxjs").Observable<E>;
        <A, B, C, D, E, F>(op1: import("rxjs").OperatorFunction<any, A>, op2: import("rxjs").OperatorFunction<A, B>, op3: import("rxjs").OperatorFunction<B, C>, op4: import("rxjs").OperatorFunction<C, D>, op5: import("rxjs").OperatorFunction<D, E>, op6: import("rxjs").OperatorFunction<E, F>): import("rxjs").Observable<F>;
        <A, B, C, D, E, F, G>(op1: import("rxjs").OperatorFunction<any, A>, op2: import("rxjs").OperatorFunction<A, B>, op3: import("rxjs").OperatorFunction<B, C>, op4: import("rxjs").OperatorFunction<C, D>, op5: import("rxjs").OperatorFunction<D, E>, op6: import("rxjs").OperatorFunction<E, F>, op7: import("rxjs").OperatorFunction<F, G>): import("rxjs").Observable<G>;
        <A, B, C, D, E, F, G, H>(op1: import("rxjs").OperatorFunction<any, A>, op2: import("rxjs").OperatorFunction<A, B>, op3: import("rxjs").OperatorFunction<B, C>, op4: import("rxjs").OperatorFunction<C, D>, op5: import("rxjs").OperatorFunction<D, E>, op6: import("rxjs").OperatorFunction<E, F>, op7: import("rxjs").OperatorFunction<F, G>, op8: import("rxjs").OperatorFunction<G, H>): import("rxjs").Observable<H>;
        <A, B, C, D, E, F, G, H, I>(op1: import("rxjs").OperatorFunction<any, A>, op2: import("rxjs").OperatorFunction<A, B>, op3: import("rxjs").OperatorFunction<B, C>, op4: import("rxjs").OperatorFunction<C, D>, op5: import("rxjs").OperatorFunction<D, E>, op6: import("rxjs").OperatorFunction<E, F>, op7: import("rxjs").OperatorFunction<F, G>, op8: import("rxjs").OperatorFunction<G, H>, op9: import("rxjs").OperatorFunction<H, I>): import("rxjs").Observable<I>;
        <A, B, C, D, E, F, G, H, I>(op1: import("rxjs").OperatorFunction<any, A>, op2: import("rxjs").OperatorFunction<A, B>, op3: import("rxjs").OperatorFunction<B, C>, op4: import("rxjs").OperatorFunction<C, D>, op5: import("rxjs").OperatorFunction<D, E>, op6: import("rxjs").OperatorFunction<E, F>, op7: import("rxjs").OperatorFunction<F, G>, op8: import("rxjs").OperatorFunction<G, H>, op9: import("rxjs").OperatorFunction<H, I>, ...operations: import("rxjs").OperatorFunction<any, any>[]): import("rxjs").Observable<unknown>;
    };
    pipe: any;
}
