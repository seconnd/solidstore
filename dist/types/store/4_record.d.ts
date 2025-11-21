import { Parameter, CustomStore } from './0_types';
import { SetMiddleware } from './3_middleware';
export declare class Record extends SetMiddleware {
    #private;
    protected record: CustomStore;
    protected store: CustomStore;
    constructor();
    setRecord: () => void;
    createRecordState: (parameter: Parameter) => void;
}
