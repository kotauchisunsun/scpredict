import "./Percentile.css"
import * as tf from "@tensorflow/tfjs"
import { percentileOfScore } from "../core/StaticsUtil"

type PercentileProps = {
  data: tf.Tensor1D | null;
  score: number | null;
};

export const Percentile = (props: PercentileProps) => {
  const render = () => {
    if (props.data === null || props.score === null) {
      return "--"
    }

    return (percentileOfScore(props.data, props.score) * 100).toFixed(0)
  }

  return (
    <span className="percentile">{render()}%</span>
  )
}
