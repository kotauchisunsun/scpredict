import * as tf from "@tensorflow/tfjs";

export const quantile = (data: tf.Tensor1D, p: tf.Tensor1D): tf.Tensor1D => { 
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

export function resampling(sourceData: tf.Tensor1D, samplingCount: number): tf.Tensor1D {
    return sourceData.gather(tf.randomUniform([samplingCount], 0, sourceData.size, "int32"))
}