import { WorkloadTime } from "../WorkloadTime"

describe("人月の計算において", () => {
  test("1時間は1時間", () => {
    const time = WorkloadTime.fromHour(1)
    expect(time.hour).toBe(1)
  })

  test("8時間は1日", () => {
    const time = WorkloadTime.fromHour(8)
    expect(time.day).toBe(1)
  })

  test("1日は8時間", () => {
    const time = WorkloadTime.fromDay(1)
    expect(time.hour).toBe(8)
  })

  test("1か月は20日", () => {
    const time = WorkloadTime.fromMonth(1)
    expect(time.day).toBe(20)
  })

  test("20日は1か月", () => {
    const time = WorkloadTime.fromDay(20)
    expect(time.month).toBe(1)
  })
})
