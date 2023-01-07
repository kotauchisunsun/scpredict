import { Tensor1D, randomUniform } from "@tensorflow/tfjs"

export const quantile = (data: Tensor1D, p: Tensor1D): Tensor1D => {
  const sorted = data.topk(data.size).values.reverse()

  const np = p.mul(data.size-1)

  const floor = np.floor().cast("int32")
  const ceil = np.ceil().cast("int32")

  const p0 = floor.div(sorted.size-1)
  const p1 = ceil.div(sorted.size-1)

  const d0 = sorted.gather(floor)
  const d1 = sorted.gather(ceil)

  const r = (p.sub(p0)).div(p1.sub(p0))
  const s = d1.sub(d0)

  const k = d0.add(s.mul(r))

  return k.where(k.isNaN().logicalNot(), d0)
}

export const percentileOfScore = (data: Tensor1D, score: number) => {
  const less = data.less([score]).sum().as1D().arraySync()[0]
  return less/data.size
}


export function resampling(sourceData: Tensor1D, samplingCount: number, seed?: number): Tensor1D {
  return sourceData.gather(randomUniform([samplingCount], 0, sourceData.size, "int32", seed))
}
