import { WorkloadTime } from "./WorkloadTime"

export class Workload {
  public constructor(private readonly man: number, private readonly workloadTime: WorkloadTime) {
  }

  get manHour() {
    return this.man * this.workloadTime.hour
  }

  get manDay() {
    return this.man * this.workloadTime.day
  }

  get manMonth() {
    return this.man * this.workloadTime.month
  }

  public calcMan(workloadTime: WorkloadTime): number {
    return this.manHour / workloadTime.hour
  }

  public static fromManHour(value: number) {
    return new Workload(value, WorkloadTime.fromHour(1))
  }

  public static fromManDay(value: number) {
    return new Workload(value, WorkloadTime.fromDay(1))
  }

  public static fromManMonth(value: number) {
    return new Workload(value, WorkloadTime.fromMonth(1))
  }
}
