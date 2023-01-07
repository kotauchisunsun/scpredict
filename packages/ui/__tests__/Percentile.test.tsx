  
import {render, screen} from '@testing-library/react';
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-node';
import { Percentile } from '../Percentile';

describe("Percentile tsx", () => { 
  it("renders 50%", () => { 
    const data = tf.tensor1d([0, 1])
    const score = 0.5

    render(<Percentile data={data} score={score} />)
    expect(screen.getByText("50%")).toBeTruthy();
  })

  it("renders 0%", () => { 
    const data = tf.tensor1d([1, 2])
    const score = 0.5

    render(<Percentile data={data} score={score} />)
    expect(screen.getByText("0%")).toBeTruthy();
  })

  it("renders 100%", () => { 
    const data = tf.tensor1d([1, 2])
    const score = 3.0

    render(<Percentile data={data} score={score} />)
    expect(screen.getByText("100%")).toBeTruthy();
  })

  it("renders undefined with unknown distribution", () => { 
    const data = null
    const score = 3.0

    render(<Percentile data={data} score={score} />)
    expect(screen.getByText("--%")).toBeTruthy();
  })

  it("renders undefined with unknown score", () => { 
    const data = tf.tensor1d([1, 2])
    const score = null

    render(<Percentile data={data} score={score} />)
    expect(screen.getByText("--%")).toBeTruthy();
  })

  it("renders transition from 0% to 100%", () => { 
    const data = tf.tensor1d([1, 2])
    
    const { rerender } = render(<Percentile data={data} score={0.0} />)
    expect(screen.getByText("0%")).toBeTruthy();
    rerender(<Percentile data={data} score={1.5} />)
    expect(screen.getByText("50%")).toBeTruthy();
    rerender(<Percentile data={data} score={3.0} />)
    expect(screen.getByText("100%")).toBeTruthy();
    rerender(<Percentile data={data} score={1.5} />)
    expect(screen.getByText("50%")).toBeTruthy();
  })
})