import { Tensor1D, scalar, exp, log } from "@tensorflow/tfjs"

/**
 * y = a*x + b
 */
export function lm(a: number, b: number, x: Tensor1D): Tensor1D {
  return scalar(a).mul(x).add(scalar(b))
}

/**
 * y = a*x + b + z
 */
export const zlm = (a: number, b: number, x: Tensor1D, z: Tensor1D): Tensor1D => {
  return lm(a, b, x).add(z)
}

/**
 * y = exp(a*ln(x) + b + z)
 */
export const lezlm = (a: number, b: number, x: Tensor1D, z: Tensor1D): Tensor1D => {
  return exp(zlm(a, b, log(x), z))
}
