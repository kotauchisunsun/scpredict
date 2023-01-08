import {render, screen} from "@testing-library/react"
import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-node"
import { Statics } from "../../core/Statics"
import { StaticsViewer } from "../StaticsViewer"

describe("StaticsViewer tsx", () => {
  it("render", () => {
    const s = new Statics(
      tf.tensor1d([1, 2, 3]),
      0,
      1,
      2,
      3,
      4,
      5
    )

    render(<StaticsViewer statics={s} />)
    expect(screen.getByText("0")).toBeTruthy()
    expect(screen.getByText("1")).toBeTruthy()
    expect(screen.getByText("2")).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()
    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
  })

  it("render largeNumber", () => {
    const s = new Statics(
      tf.tensor1d([1, 2, 3]),
      1000,
      1001,
      1002,
      1003,
      1004,
      1005
    )

    render(<StaticsViewer statics={s} />)
    expect(screen.getByText("1,000")).toBeTruthy()
    expect(screen.getByText("1,001")).toBeTruthy()
    expect(screen.getByText("1,002")).toBeTruthy()
    expect(screen.getByText("1,003")).toBeTruthy()
    expect(screen.getByText("1,004")).toBeTruthy()
    expect(screen.getByText("1,005")).toBeTruthy()
  })
})
