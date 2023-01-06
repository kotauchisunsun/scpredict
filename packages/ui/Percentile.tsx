import './Percentile.css'
import * as tf from "@tensorflow/tfjs";
import { percentileOfScore } from '../core/StaticsUtil';

type PercentileProps = {
  data: tf.Tensor1D;
  score: number;
};

export const Percentile = (props: PercentileProps) => {
  return (
    <section>
      <h1>工数の分位数</h1>
      <span className="percentile">{(percentileOfScore(props.data, props.score) * 100).toFixed(0)}%</span>
    </section>
  );
};
