import { Subject } from 'rxjs';
import { CustomStore, Parameter, Reducers, Method } from './0_types';
import './1_observable';
export declare class Field {
    protected store: CustomStore | undefined;
    protected record: CustomStore | undefined;
    protected reducers: Reducers;
    protected recordReducers: Reducers;
    protected actions: Map<string, any>;
    protected recordActions: Map<string, any>;
    protected observables: Map<string, Subject<any>>;
    protected methods: Map<string, Method>;
    protected parameters: Map<string, Parameter>;
}
