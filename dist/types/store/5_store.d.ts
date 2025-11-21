import { Parameter, isSilent } from './0_types';
import { Record } from './4_record';
export declare class Store extends Record {
    #private;
    constructor();
    setStore: () => import("./0_types").CustomStore;
    setValueState: (_parameter: Parameter, _isSilent?: isSilent) => void;
}
