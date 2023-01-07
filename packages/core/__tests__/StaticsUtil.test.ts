import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-node';
import { quantile,percentileOfScore } from "../StaticsUtil"

describe("quantileの計算", () => { 
  test("パターン1", () => { 
    const data = tf.tensor1d([1, 2])
    const p = tf.tensor1d([0.0]);
    expect(quantile(data, p).arraySync()[0]).toBe(1);
  })

  test("パターン2", () => { 
    const data = tf.tensor1d([2,1])
    const p = tf.tensor1d([0.0]);
    expect(quantile(data, p).arraySync()[0]).toBe(1);
  })    

  test("パターン3", () => { 
    const data = tf.tensor1d([1, 2])
    const p = tf.tensor1d([1.0]);
    expect(quantile(data, p).arraySync()[0]).toBe(2);
  })

  test("パターン4", () => { 
    const data = tf.tensor1d([2,1])
    const p = tf.tensor1d([1.0]);
    expect(quantile(data, p).arraySync()[0]).toBe(2);
  })    

  test("パターン5", () => { 
    const data = tf.tensor1d([2,1,0])
    const p = tf.tensor1d([0.25]);
    expect(quantile(data, p).arraySync()[0]).toBe(0.5);
  })
})

describe("percentileOfScoreが", () => { 
  test("0.5になる", () => { 
    const data = tf.tensor1d([0, 1])
    const score = 0.5

    expect(percentileOfScore(data,score)).toBeCloseTo(0.5,3)
  })

  test("0.0になる", () => { 
    const data = tf.tensor1d([1,2])
    const score = 0.0

    expect(percentileOfScore(data,score)).toBeCloseTo(0.0,3)
  })

  test("1.0になる", () => { 
    const data = tf.tensor1d([1,2])
    const score = 3.0

    expect(percentileOfScore(data,score)).toBeCloseTo(1.0,3)
  })
})