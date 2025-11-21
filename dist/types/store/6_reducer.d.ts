import { Parameter, isSilent } from './0_types';
import { Store } from './5_store';
export declare class Reducer extends Store {
    #private;
    constructor();
    setReducer: () => void;
    setValueState: (parameter: Parameter, isSilent?: isSilent) => void;
}
