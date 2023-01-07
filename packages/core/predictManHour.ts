import { lezlm } from "./Regression"
import { Statics } from "./Statics"
import { tensor1d, randomNormal } from "@tensorflow/tfjs"
import * as c from "./config.json"

export const predictManHour = (lineCount: number, manHourSamplingCount: number, seed?: number): Statics => {
  const manHourSamples = lezlm(
    c.loc_man_hour.coefficient,
    c.loc_man_hour.intercept,
    tensor1d([lineCount]),
    randomNormal(
      [manHourSamplingCount],
      c.loc_man_hour.mean,
      c.loc_man_hour.std,
      "float32",
      seed
    )
  )

  return Statics.build(manHourSamples)
}
