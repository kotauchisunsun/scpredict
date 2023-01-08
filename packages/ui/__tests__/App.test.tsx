import { App } from "../App"
import {render, screen} from "@testing-library/react"
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
        expect(screen.getByText("2,011")).toBeTruthy()
        expect(screen.getByText("1,303")).toBeTruthy()
        expect(screen.getByText("197")).toBeTruthy()
        expect(screen.getByText("669")).toBeTruthy()
        expect(screen.getByText("2,445")).toBeTruthy()
        expect(screen.getByText("8,055")).toBeTruthy()

        //開発工数の妥当性
        expect(screen.getByText("73%")).toBeTruthy()
    })
})