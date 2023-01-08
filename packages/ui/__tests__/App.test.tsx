import { App } from "../App"
import {render, screen, fireEvent} from "@testing-library/react"
import { config } from "../PredictConfig"

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
    render(<App predictConfig={config} />)

    //開発規模から開発工数の予測
    expect(getSLOCInput().value).toBe("800")

    //想定の開発工数
    expect(getManInput().value).toBe("3")
    expect(getDayInput().value).toBe("96")
    expect(getManDayInput().value).toBe("288")

    //開発工数の確率分布の統計量
    expect(screen.getByText("251")).toBeTruthy()
    expect(screen.getByText("163")).toBeTruthy()
    expect(screen.getByText("25")).toBeTruthy()
    expect(screen.getByText("84")).toBeTruthy()
    expect(screen.getByText("306")).toBeTruthy()
    expect(screen.getByText("1,007")).toBeTruthy()

    //開発工数の妥当性
    expect(screen.getAllByText("73%")).toBeTruthy()
  })

  it("show transition", () => {
    render(<App predictConfig={config} />)
    fireEvent.input(getSLOCInput(), { target: { value: "900" } })

    //開発規模から開発工数の予測
    expect(getSLOCInput().value).toBe("900")

    //想定の開発工数
    expect(getManInput().value).toBe("3")
    expect(getDayInput().value).toBe("98")
    expect(getManDayInput().value).toBe("294")

    //開発工数の確率分布の統計量
    expect(screen.getByText("269")).toBeTruthy()
    expect(screen.getByText("174")).toBeTruthy()
    expect(screen.getAllByText("26")).toBeTruthy()
    expect(screen.getByText("89")).toBeTruthy()
    expect(screen.getByText("327")).toBeTruthy()
    expect(screen.getByText("1,076")).toBeTruthy()

    //開発工数の妥当性
    expect(screen.getAllByText("72%")).toBeTruthy()
  })
})
