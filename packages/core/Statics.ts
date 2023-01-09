import { Tensor1D, tensor1d } from "@tensorflow/tfjs"
import { quantile } from "./StaticsUtil"

export class Statics {
  public constructor(
        public readonly data: Tensor1D,
        public readonly mean: number,
        public readonly median: number,
        public readonly p50Lower: number,
        public readonly p50Upper: number,
        public readonly p95Lower: number,
        public readonly p95Upper: number
  ) { }

  public static build(data: Tensor1D): Statics {
    const percentile = tensor1d([0.025, 0.25, 0.5, 0.75, 0.975])

    const m = data.mean().as1D().arraySync()[0]
    const p = quantile(data, percentile).as1D().arraySync()

    return new Statics(
      data,
      m,
      p[2],
      p[1],
      p[3],
      p[0],
      p[4]
    )
  }

  public print() {
    console.log(
      `mean:   ${this.mean}\n` +
      `median: ${this.median}\n` +
      `50%:    ${this.p50Lower} - ${this.p50Upper}\n` +
      `95%:    ${this.p95Lower} - ${this.p95Upper}`
    )
  }
}
