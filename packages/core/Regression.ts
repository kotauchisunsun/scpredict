import * as tf from "@tensorflow/tfjs"

/**
 * y = a*x + b
 */
export function lm(a: number, b: number, x: tf.Tensor1D): tf.Tensor1D {
  return tf.scalar(a).mul(x).add(tf.scalar(b))
}

/**
 * y = a*x + b + z
 */
export const zlm = (a: number, b: number, x: tf.Tensor1D, z: tf.Tensor1D): tf.Tensor1D => {
  return lm(a, b, x).add(z)
}

/**
 * y = exp(a*ln(x) + b + z)
 */
export const lezlm = (a: number, b: number, x: tf.Tensor1D, z: tf.Tensor1D): tf.Tensor1D => {
  return tf.exp(zlm(a, b, tf.log(x), z))
}
