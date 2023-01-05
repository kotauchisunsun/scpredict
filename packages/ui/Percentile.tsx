import * as tf from "@tensorflow/tfjs";
import { percentileOfScore } from '../core/StaticsUtil';

type PercentileProps = {
  data: tf.Tensor1D;
  score: number;
};

export const Percentile = (props: PercentileProps) => {
  return (
    <div>
      <h1>工数の分位数</h1>
      <span>{(percentileOfScore(props.data, props.score) * 100).toFixed(0)}%</span>
    </div>
  );
};
