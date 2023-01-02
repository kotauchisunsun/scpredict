import * as tf from "@tensorflow/tfjs";
import * as fc from 'fast-check';
import * as reg from "../src/reg";

const ce = {
    noNaN: true,
    noDefaultInfinity: true
}

const c = {
    max:    1<<6,
    min: - (1 << 6),
    ...ce
}

const c2 = {
    max:   8,
    min: - 8,
    ...ce
}

describe("Property Based Testing", () => {
    test('a*x+b == a*x+b', () => fc.assert(
        fc.property(
            fc.float(c), fc.float(c), fc.float(c),
            (a, x, b) => {
                const c = a * x + b;
                const d = reg.lm(a, b, tf.tensor1d([x])).arraySync()[0];
                const eps1 = Math.abs(c - d);
                const eps2 = Math.abs(d - c);
                const threshold = 1e-3;
                //console.log(a,x,b, c, d,eps1,eps2,eps1 < threshold, eps2 < threshold);
                return eps1 < threshold || eps2 < threshold;
            }
        )
    ))

    test('a*(x+k)+b == a*x+b+a*k', () => fc.assert(
        fc.property(
            fc.float(c), fc.float(c), fc.float(c),fc.float(c),
            (a, x, b, k) => {
                const c = a * x + b + a*k;
                const d = reg.lm(a, b, tf.tensor1d([x+k])).arraySync()[0];
                const eps1 = Math.abs(c - d);
                const eps2 = Math.abs(d - c);
                const threshold = 1e-3;
                //console.log(a,x,b, c, d,eps1,eps2,eps1 < threshold, eps2 < threshold);
                return eps1 < threshold || eps2 < threshold;
            }
        )
    ))

    test('a*[x]+b == a*[x]+b', () => fc.assert(
        fc.property(
            fc.integer({ min: 1, max: 1000 }),
            (l) => { 
                fc.assert(
                    fc.property(
                        fc.float(c), fc.float32Array({...c,minLength: l}), fc.float(c),
                        (a, x, b) => {
                            const d = reg.lm(a, b, tf.tensor1d(x)).arraySync();
                            const threshold = 1e-3;
                            return d.every((v,i) => {
                                const c = a * x[i] + b;
                                const eps1 = Math.abs(c - v);
                                const eps2 = Math.abs(v - c);
                                //console.log(a,b,x[i],c,v,eps1,eps2,eps1 < threshold, eps2< threshold)
                                return eps1 < threshold || eps2 < threshold;
                            });
                        }
                    )
                )
                return true;
            }
        )
    ))

    test('a*[x+k]+b == a*[x]+b+a*[k]', () => fc.assert(
        fc.property(
            fc.integer({ min: 1, max: 1000}),
            (l) => {
                const ac = {minLength: l, maxLength: l}
                fc.assert(
                    fc.property(
                        fc.float(c), fc.float32Array({ ...c,...ac}), fc.float(c), fc.float32Array({ ...c,...ac}),
                        (a, x, b, k) => {
                            const d = reg.lm(a, b, tf.tensor1d(x).add(tf.tensor1d(k))).arraySync();
                            const threshold = 1e-3;
                            return d.every((v, i) => {
                                const c = a * x[i] + b + a * k[i];
                                const eps1 = Math.abs(c - v);
                                const eps2 = Math.abs(v - c);
                                //console.log(a,b,x[i],c,v,eps1,eps2,eps1 < threshold, eps2< threshold)
                                return eps1 < threshold || eps2 < threshold;
                            });
                        }
                    )
                )
                return true;
            }
        )
    ))

    test('exp(a*log(exp(x))+b+z) == exp(a*x+b+z)', () => fc.assert(
        fc.property(
            fc.integer({min: 1 , max:1000}),
            (l) => {
                const ac = { minLength: l, maxLength: l };
                fc.assert(
                    fc.property(
                        fc.float(c2), fc.float32Array({min:new Float32Array([1e-15])[0], max:c2.max,...ac,...ce}), fc.float(c2), fc.float32Array({...c2,...ac}),
                        (a, x, b, z) => {
                            const tx = tf.tensor1d(x);
                            const ex = tx.exp();
                            const tz = tf.tensor1d(z);

                            const d1 = reg.lezlm(a, b, ex, tz).log();
                            const d2 = reg.zlm(a, b, tx, tz);

                            const d = d1.sub(d2).abs().flatten().arraySync();

                            const ret = d.every(x => x <= 1e-3);
                            if (!ret) {
                                console.log(a, x, b, z,d1.arraySync(),d2.arraySync(), d);
                            }
                            return ret;
                        }
                    ),
                    {verbose:true}
                )
                return true;
            }
        )
    ))
})

describe('線形回帰が', (): void => {
    test('xの引数が1つの要素の時に成功する', (): void => {
        const a = 2.0;
        const b = 5.0;
        const x = tf.tensor1d([3.0]);

        const result = reg.lm(a, b, x);
        expect(result.arraySync()).toEqual([11.0]);
    })

    test('xの引数が3つの要素の時に成功する', (): void => {
        const a = 3.0;
        const b = 2.0;
        const x = tf.tensor1d([0.0,1.0,2.0]);

        const result = reg.lm(a, b, x);
        expect(result.arraySync()).toEqual([2.0,5.0,8.0]);
    })
})

describe('ノイズ項付き線形回帰が', (): void => { 
    test('xの引数が1つの要素の時に成功する', (): void => {
        const a = 2.0;
        const b = 1.0;
        const x = tf.tensor1d([3.0]);
        const z = tf.tensor1d([1.0]);

        const result = reg.zlm(a, b, x, z);
        expect(result.arraySync()).toEqual([8.0]);
    })

    test('xの引数が3つの要素の時に成功する', (): void => {
        const a = 3.0;
        const b = 2.0;
        const x = tf.tensor1d([0.0, 1.0, 2.0]);
        const z = tf.tensor1d([3.0, 3.0, 1.0]);

        const result = reg.zlm(a, b, x, z);
        expect(result.arraySync()).toEqual([5.0,8.0,9.0]);
    })

    test('xの引数が3つの要素で、ノイズ項が2要素の時、失敗する', (): void => {
        const a = 3.0;
        const b = 2.0;
        const x = tf.tensor1d([0.0, 1.0, 2.0]);
        const z = tf.tensor1d([3.0, 3.0]);

        expect(() => { reg.zlm(a, b, x, z); }).toThrowError();
    })
})

describe('対数変換ノイズ項付き線形回帰の指数変換が', (): void => { 
    test('xの引数が1つの要素の時に成功する', (): void => {
        const a = 2.0;
        const b = 1.0;
        const x = tf.tensor1d([3.0]).exp();
        const z = tf.tensor1d([1.0]);

        const result = reg.lezlm(a, b, x, z);
        expect(result.arraySync()).toEqual(tf.tensor1d([8.0]).exp().arraySync());
    })

    test('xの引数が3つの要素の時に成功する', (): void => {
        const a = 2.0;
        const b = 1.0;
        const x = tf.tensor1d([3.0,4.0,2.0]).exp();
        const z = tf.tensor1d([1.0,2.0,1.0]);

        const result = reg.lezlm(a, b, x, z);
        expect(result.arraySync()).toEqual(tf.tensor1d([8.0,11.0,6.0]).exp().arraySync());
    })
})
