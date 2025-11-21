import { Middleware } from 'redux';
import { Field } from './2_field';
export declare class SetMiddleware extends Field {
    #private;
    constructor();
    setMiddleware: () => Middleware | void;
}
