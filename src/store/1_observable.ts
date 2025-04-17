import { Subject } from 'rxjs'

export class StoreObservable extends Subject<any> {
    constructor() {
        super()
    }

    pipe0 = super.pipe

    pipe: any = (piping: any) => {

        let piped: any = this.pipe0(piping)

        piped.subscribe0 = piped.subscribe

        piped.subscribe = (method: any) => {

            if (!method.hasOwnProperty('next'))
                throw('no exist next! in subscribe({ ... })')

            return piped.subscribe0({
                next: (dispatched: any) => method.next(dispatched),
                complete: method.complete || undefined,
                error: method.complete || undefined
            })
        }

        return piped
    }
}