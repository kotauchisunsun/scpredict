import {render, screen} from "@testing-library/react"
import { PercentViewer } from "../PercentViewer"

describe("PercentViewer2 tsx", () => {
  it("show 50%", () => {
    render(<PercentViewer score={0.5} />)
    expect(screen.getByText("50%")).toBeTruthy()
  })

  it("show null", () => {
    render(<PercentViewer score={null} />)
    expect(screen.getByText("--%")).toBeTruthy()
  })
})
