import { Statics } from "./Statics"
import { Tensor1D, randomNormal } from "@tensorflow/tfjs"
import { lezlm } from "./Regression"
import * as c from "./config.json"

export const predictMonth = (manHour: Tensor1D, resamplingCount: number, seed?: number): Statics => {
  const monthSampling = lezlm(
    c.man_hour_month.coefficient,
    c.man_hour_month.intercept,
    manHour.tile([resamplingCount]),
    randomNormal(
      [resamplingCount * manHour.size],
      c.man_hour_month.mean,
      c.man_hour_month.std,
      "float32",
      seed
    )
  )

  return Statics.build(monthSampling)
}
