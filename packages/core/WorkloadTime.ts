export class WorkloadTime {
  //public readonly hour: number
  //public readonly day: number
  //public readonly month: number

  private constructor(private readonly hourValue: number) {
    //this.hour = hourValue
    //this.day = this.hour / 8
    //this.month = this.day / 20
  }

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
