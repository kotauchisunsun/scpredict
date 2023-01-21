import { App } from "../App"
import {render, screen, fireEvent} from "@testing-library/react"
import { config } from "../PredictConfig"
import * as tf from "@tensorflow/tfjs"

tf.setBackend("cpu")

const getSLOCInput = () => {
  return screen.getByRole("spinbutton", { name: "開発規模(SLOC)" }) as HTMLInputElement
}

const getManInput = () => {
  return screen.getByRole("spinbutton", { name: "人数" }) as HTMLInputElement
}

const getDayInput = () => {
  return screen.getByRole("spinbutton", {name:"工期(日)"}) as HTMLInputElement
}

const getManDayInput = () => {
  return screen.getByRole("spinbutton", { name: "工数(人日)" }) as HTMLInputElement
}

describe("App tsx", () => {
  it("show initial", () => {
    render(<App predictConfig={config} startDate={new Date()} />)

    //開発規模から開発工数の予測
    expect(getSLOCInput().value).toBe("800")

    //想定の開発工数
    expect(getManInput().value).toBe("3")
    expect(getDayInput().value).toBe("96")
    expect(getManDayInput().value).toBe("288")

    //開発工数の妥当性
    expect(screen.getAllByText("73%")).toBeTruthy()

    //締め切り前完了確率
    expect(screen.getAllByText("54%")).toBeTruthy()
  })

  it("show transition", () => {
    render(<App predictConfig={config} startDate={new Date()} />)
    fireEvent.input(getSLOCInput(), { target: { value: "900" } })

    //開発規模から開発工数の予測
    expect(getSLOCInput().value).toBe("900")

    //想定の開発工数
    expect(getManInput().value).toBe("3")
    expect(getDayInput().value).toBe("98")
    expect(getManDayInput().value).toBe("294")

    //開発工数の妥当性
    expect(screen.getAllByText("72%")).toBeTruthy()

    //締め切り前完了確率
    expect(screen.getAllByText("53%")).toBeTruthy()
  })

  it("set endDate", () => {
    const startDate = new Date("2022-01-30")
    render(<App predictConfig={config} startDate={startDate} />)
    const element = screen.getByLabelText("締切日", { selector: "input" }) as HTMLInputElement
    fireEvent.input(element, { target: { value: "2022-02-06" } })
    expect(getDayInput().value).toBe("5")
  })
})
