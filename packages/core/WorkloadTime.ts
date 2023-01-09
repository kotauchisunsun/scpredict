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
}
