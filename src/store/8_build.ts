import { Wrapper } from './7_register'

export class Build extends Wrapper {

    constructor() {

        super()

        this.setRecord()
        this.setStore()
        this.setReducer()

        return this.wrapping()
    }

}