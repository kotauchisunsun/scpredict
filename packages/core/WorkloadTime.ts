export class WorkloadTime {

  private constructor(private readonly hourValue: number) {}

  get hour() {
    return this.hourValue
  }

  get day() {
    return this.hourValue / 8
  }

  get month() {
    return this.day / 20
  }

  public static fromHour(hour: number) {
    return new WorkloadTime(hour)
  }

  public static fromDay(day: number) {
    return new WorkloadTime(day*8)
  }

  public static fromMonth(month: number) {
    return new WorkloadTime(month*20*8)
  }

  public calcDate(startDate: Date): Date {
    const result = new Date(startDate.getTime())
    result.setDate(result.getDate() + this.day)
    return result
  }

  public calcDateWithoutWeekend(startDate: Date): Date {
    const endDate = new Date(startDate.getTime())
    endDate.setDate(endDate.getDate() + Math.floor(7 / 5 * this.day))
    while (WorkloadTime.diffWithoutWeekend(startDate, endDate).day != this.day) {
      endDate.setDate(endDate.getDate() - 1)
    }
    return endDate
  }

  public static diff(startDate: Date, endDate: Date, filter = (d: Date) => true): WorkloadTime {
    let dayCount = 0
    const date = new Date(startDate.getTime())

    while (endDate.getTime() > date.getTime()) {
      if (filter(date)) {
        dayCount++
      }
      date.setDate(date.getDate()+1)
    }

    return WorkloadTime.fromDay(dayCount)
  }

  public static diffWithoutWeekend(startDate: Date, endDate: Date): WorkloadTime {
    return WorkloadTime.diff(startDate, endDate, (d) => d.getDay()!=0 && d.getDay()!=6)
  }
}
