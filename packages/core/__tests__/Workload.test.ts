import { Workload } from "../Workload"
import { WorkloadTime } from "../WorkloadTime"

describe("人月計算において", () => {
  test("1人時は1人時", () => {
    const workload = Workload.fromManHour(1)
    expect(workload.manHour).toBe(1)
  })

  test("1人日は1人日", () => {
    const workload = Workload.fromManDay(1)
    expect(workload.manDay).toBe(1)
  })

  test("1人月は1人月", () => {
    const workload = Workload.fromManMonth(1)
    expect(workload.manMonth).toBe(1)
  })

  test("1人日は8人時", () => {
    const workload = Workload.fromManDay(1)
    expect(workload.manHour).toBe(8)
  })

  test("1人月は20人日", () => {
    const workload = Workload.fromManMonth(1)
    expect(workload.manDay).toBe(20)
  })

  test("10人月を5か月で作業するには2人必要である", () => {
    const workload = Workload.fromManMonth(10)
    const workloadTime = WorkloadTime.fromMonth(5)
    const man = workload.calcMan(workloadTime)

    expect(man).toBe(2)
  })
})
