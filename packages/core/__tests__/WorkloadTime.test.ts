import * as fc from "fast-check"
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

describe("日付の差の計算において", () => {
  describe("月をまたがない", () => {
    const startDate = new Date(Date.parse("2023-01-16"))
    const endDate = new Date(Date.parse("2023-01-23"))

    it("2023/01/16～2023/01/23の間は7日間である", () => {
      const time = WorkloadTime.diff(startDate, endDate)
      expect(time.day).toBe(7)
    })

    it("2023/01/16～2023/01/23の間は土日を除くと5日間である", () => {
      const time = WorkloadTime.diffWithoutWeekend(startDate, endDate)
      expect(time.day).toBe(5)
    })
  })

  describe("月をまたぐ", () => {
    const startDate = new Date(Date.parse("2023-01-30"))
    const endDate = new Date(Date.parse("2023-02-06"))

    it("月跨ぎする2023/01/30～2023/02/6の間は7日間である", () => {
      const time = WorkloadTime.diff(startDate, endDate)
      expect(time.day).toBe(7)
    })

    it("月跨ぎする2023/01/30～2023/02/6の間は土日を除くと5日間である", () => {
      const time = WorkloadTime.diffWithoutWeekend(startDate, endDate)
      expect(time.day).toBe(5)
    })
  })
})

describe("工数から終了日時を計算するとき", () => {
  const startDate = new Date(Date.parse("2023-01-16"))
  const endDate = Date.parse("2023-01-23")

  test("2023/01/16から7日後は2023/01/23である", () => {
    const workloadTime = WorkloadTime.fromDay(7)

    const result = workloadTime.calcDate(startDate)
    expect(result.getTime()).toBe(endDate)
  })

  test("2023/01/16から稼働5日後は2023/01/23である", () => {
    const workloadTime = WorkloadTime.fromDay(5)

    const result = workloadTime.calcDateWithoutWeekend(startDate)
    expect(result.getTime()).toBe(endDate)
  })

  // eslint-disable-next-line jest/expect-expect
  test("網羅チェック", () => fc.assert(
    fc.property(
      fc.integer({min: 0, max:365*3}),
      (n) => {
        const workloadTime = WorkloadTime.fromDay(n)

        const result = workloadTime.calcDateWithoutWeekend(startDate)
        const diffWorkloadTIme = WorkloadTime.diffWithoutWeekend(startDate, result)

        return n === diffWorkloadTIme.day
      }
    )
  ))
})
