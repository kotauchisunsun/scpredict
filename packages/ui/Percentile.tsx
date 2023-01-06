import './Percentile.css'
import * as tf from "@tensorflow/tfjs";
import { percentileOfScore } from '../core/StaticsUtil';

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
    <section>
      <h1>工数の分位数</h1>
      <span className="percentile">{ render() }%</span>
    </section>
  );
};
