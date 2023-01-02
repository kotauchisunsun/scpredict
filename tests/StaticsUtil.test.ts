import * as tf from "@tensorflow/tfjs";
import * as q from "../src/StaticsUtil"

describe("quantileの計算", () => { 
    test("パターン1", () => { 
        const data = tf.tensor1d([1, 2])
        const p = tf.tensor1d([0.0]);
        expect(q.quantile(data, p).arraySync()[0]).toEqual(1);
    })

    test("パターン2", () => { 
        const data = tf.tensor1d([2,1])
        const p = tf.tensor1d([0.0]);
        expect(q.quantile(data, p).arraySync()[0]).toEqual(1);
    })    

    test("パターン3", () => { 
        const data = tf.tensor1d([1, 2])
        const p = tf.tensor1d([1.0]);
        expect(q.quantile(data, p).arraySync()[0]).toEqual(2);
    })

    test("パターン4", () => { 
        const data = tf.tensor1d([2,1])
        const p = tf.tensor1d([1.0]);
        expect(q.quantile(data, p).arraySync()[0]).toEqual(2);
    })    

    test("パターン5", () => { 
        const data = tf.tensor1d([2,1,0])
        const p = tf.tensor1d([0.25]);
        expect(q.quantile(data, p).arraySync()[0]).toEqual(0.5);
    })
})
