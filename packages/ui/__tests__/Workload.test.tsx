import {render, screen, fireEvent} from "@testing-library/react"
import { Workload } from "../Workload"

const getManInput = () => {
  return screen.getByRole("spinbutton", { name: "人数" }) as HTMLInputElement
}

const getDayInput = () => {
  return screen.getByRole("spinbutton", {name:"工期(日)"}) as HTMLInputElement
}

const getManDayInput = () => {
  return screen.getByRole("spinbutton", { name: "工数(人日)" }) as HTMLInputElement
}

describe("Workloadのセクションで", () => {
  it("初期化時に初期値を入力する", () => {
    const man = 10
    const day = 20
    const manDay = man * day

    render(<Workload man={man} day={day} manDay={manDay}/>)

    expect(getManInput().value).toBe("10")
    expect(getDayInput().value).toBe("20")
    expect(getManDayInput().value).toBe("200")
  })

  it("初期化時に初期値としてNullを入力する", () => {
    render(<Workload man={null} day={null} manDay={null} />)

    expect(getManInput().value).toBe("")
    expect(getDayInput().value).toBe("")
    expect(getManDayInput().value).toBe("")
  })

  it("人数を変更する", async () => {
    let man: number | null = null

    render(<Workload man={man} day={null} manDay={null} onChangeMan={(v) => { man = v }} />)
    fireEvent.input(getManInput(), {target: {value : "20"}})
    expect(man).toBe(20)
  })

  it("日数を変更する", async () => {
    let day: number | null = null

    render(<Workload man={null} day={day} manDay={null} onChangeDay={(v) => {day = v}} />)
    fireEvent.input(getDayInput(), {target: {value : "10"}})
    expect(day).toBe(10)
  })
})
