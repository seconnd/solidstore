import { Basket } from '../2_register';
import { BasketObservable } from '../1_observable';
// 필요시 import { BasketObservable } from './basket';
import { performance } from 'perf_hooks';

const COUNT = 100_000;

// 타이밍 메서드 검사용
function timingMock(...args: any[]) {}

// 복잡한 객체
function generateLargeObject(n: number) {
    const obj: any = {};
    for (let i = 0; i < n; ++i) { obj['key' + i] = i; }
    return obj;
}

function bench(label: string, f: () => void) {
    const t0 = performance.now();
    f();
    const t1 = performance.now();
    console.log(`${label}: ${(t1 - t0).toFixed(2)} ms`);
}

// 벤치마크: 생성, 읽기, 반복 수정, 삭제 등
function main() {
    const r$ = Basket.getNewRegister();

    // 1. 기초 set/읽기 벤치마크
    bench('set N개의 프로퍼티', () => {
        for(let i=0; i<COUNT; i++) {
            r$['val' + i] = i;
        }
    });

    bench('get N개의 프로퍼티', () => {
        let acc = 0;
        for(let i=0; i<COUNT; i++) {
            acc += r$['val' + i];
        }
        if (acc < 0) throw new Error('should not happen');
    });

    // 2. 업뎃 벤치
    bench('update N개의 프로퍼티', () => {
        for(let i=0; i<COUNT; i++) {
            r$['val' + i] = i * 2;
        }
    });

    // 3. 대량 삭제
    bench('delete N개의 프로퍼티', () => {
        for(let i=0; i<COUNT; i++) {
            r$['val' + i + '_delete'];
        }
    });

    // 4. 커스텀 config(타이밍 hook) 대량 부여
    bench('config+before/afterSet 타이밍 부여', () => {
        for(let i=0; i<1000; i++) {
            r$['c' + i + '_config'] = {
                value: i,
                beforeSet: timingMock,
                afterSet: timingMock
            };
        }
    });

    // 5. 대량 Import/Export(bulk load)
    const bigData = generateLargeObject(100_000);

    bench('import_object 대량(10만개)', () => {
        r$.import_object = { ...bigData };
    });

    bench('export_object 대량(10만개)', () => {
        const obj = r$.export_object;
        if (Object.keys(obj).length !== 100_000) throw 'Failed!';
    });

    bench('export_json 대량(10만개)', () => {
        const json = r$.export_json;
        if (!json.startsWith('{')) throw 'Failed!';
    });

    // 6. 타이밍 method를 실제로 매우 많이 발동 (beforeSet)
    r$['zoo_config'] = {
        value: 1,
        beforeSet: timingMock,
        afterSet: timingMock
    };
    bench('timing method flooding (100만번 beforeSet)', () => {
        for(let i=0; i<1000000; i++) {
            r$['zoo_before'] = i;
            r$['zoo_after'] = i;
        }
    });

    // 7. Observable 활용(예시: 1000회 트리거)
    let obs_triggered = 0;
    
    r$['obs_config'] = {
        value: 1,
        beforeGet: new BasketObservable().subscribe({
            next: () => { ++obs_triggered; }
        })
    };
    bench('Observable beforeGet 1000회 호출', () => {
        for(let i=0; i<1000; i++) { r$['obs_before']; }
    });
    if (obs_triggered != 1000) throw new Error('Observable not triggered as expected');

    console.log('All benchmarks passed!');
}

main();