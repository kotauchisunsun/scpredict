import "./Percentile.css"
import { Tensor1D } from "@tensorflow/tfjs"
import { percentileOfScore } from "../core/StaticsUtil"

type PercentileProps = {
  data: Tensor1D | null;
  score: number | null;
};

export const PercentileViewer = (props: PercentileProps) => {
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
