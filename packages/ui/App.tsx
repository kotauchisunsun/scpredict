import "./App.css"
import { useEffect, useMemo, useReducer, useState} from "react"
import { WorkloadPanel } from "./WorkloadPanel"
import { Panel } from "./Panel"
import { PredictConfig } from "./PredictConfig"
import { Statics } from "../core/Statics"
import { tensor, Tensor1D, tensor1d } from "@tensorflow/tfjs"
import { defaultManHourData, defaultMan, defaultDay, defaultLineCount } from "./defaultData"
import { predictManHour } from "../core/predictManHour"
import { percentileOfScore, resampling } from "../core/StaticsUtil"
import { predictMonth } from "../core/predictMonth"
import { StaticsViewer } from "./StaticsViewer"
import { PercentViewer } from "./PercentViewer"
import { WorkloadTime } from "../core/WorkloadTime"
import { Workload } from "../core/Workload"

const dumpDateStr = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = ("0" + (date.getMonth() + 1)).slice(-2)
  const dd = ("0" + date.getDate()).slice(-2)
  return yyyy + "-" + mm + "-" + dd
}

type AppProps = {
  predictConfig: PredictConfig
}

export const App = ({ predictConfig }: AppProps) => {

  const [manHourDistribution, setManHourDistribution] = useState<Tensor1D|null>(tensor1d(defaultManHourData))

  const [man, setMan] = useState<number | null>(defaultMan)
  const [workloadTime, setWorkloadTime] = useState<WorkloadTime | null>(WorkloadTime.fromDay(defaultDay))

  const workload = useMemo(() => (man != null && workloadTime != null ? new Workload(man, workloadTime) : null), [man, workloadTime])

  const manDayStatics = useMemo(() => {
    if (manHourDistribution == null) {
      return null
    }
    return Statics.build(manHourDistribution.div(8).as1D())
  }, [manHourDistribution])

  const manDayPercentile = useMemo(
    () => {
      if (workload == null || manHourDistribution == null) {
        return null
      }

      return percentileOfScore(manHourDistribution, workload.manHour)
    },
    [workload, manHourDistribution]
  )

  const monthDistribution = useMemo(() => {
    if (workload == null || manHourDistribution==null) {
      return null
    }

    const filteredManHourDistribution = manHourDistribution.arraySync().filter((x) => x < workload.manHour)
    const target = resampling(tensor(filteredManHourDistribution), 1000, predictConfig.seed)
    return predictMonth(target, 100, predictConfig.seed).data
  }, [workload, manHourDistribution])

  const dayStatics = useMemo(() => {
    if (monthDistribution == null) {
      return null
    }

    //1人月は20人日
    return Statics.build(monthDistribution.mul(20))
  },
  [monthDistribution])

  const monthPercentile = useMemo(
    () => {
      if (workloadTime == null || monthDistribution == null) {
        return null
      }
      return percentileOfScore(monthDistribution, workloadTime.month)
    },
    [workloadTime, monthDistribution]
  )

  const completeProbability = useMemo(
    () => {
      if (manDayPercentile == null || monthPercentile == null) {
        return null
      }
      return manDayPercentile * monthPercentile
    },
    [manDayPercentile, monthPercentile]
  )

  function applyEndDateByWorkloadTime(workloadTime: WorkloadTime | null) {
    if (workloadTime == null) {
      return
    }

    const endDate = new Date(Date.parse(startDateStr))
    endDate.setDate(endDate.getDate() + workloadTime.day)
    setEndDateStr(dumpDateStr(endDate))
  }

  function applyWorkload(man: number | null, workloadTime: WorkloadTime | null) {
    setMan(man)
    setWorkloadTime(workloadTime)

    if (workloadTime === null) {
      return
    }

    applyEndDateByWorkloadTime(workloadTime)
  }

  function applyDay(inputDay: number | null) {
    applyWorkload(man, inputDay == null ? null :WorkloadTime.fromDay(inputDay))
  }

  function applyMan(inputMan: number | null) {
    applyWorkload(inputMan, workloadTime)
  }

  const [startDateStr, setStartDateStr] = useState(dumpDateStr(new Date()))
  const [endDateStr, setEndDateStr] = useState<string | null>(null)

  function applyStartDate(dateStr: string) {
    setStartDateStr(dateStr)
    applyWorkload(man, workloadTime)
  }

  function applyEndDate(dateStr: string) {
    setEndDateStr(dateStr)

    const endDate = new Date(Date.parse(dateStr))
    const startDate = new Date(Date.parse(startDateStr))

    const diffTime = endDate.getTime() - startDate.getTime()

    //差がmsで来るので、時間へ変換
    const diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    setWorkloadTime(WorkloadTime.fromDay(diffDay))
  }

  const [lineCount, applyLineCount] = useReducer(
    (state: number | null, action: number | null) => {
      if (action == null) {
        return state
      }

      const manHourStatics = predictManHour(action, predictConfig.manHourSamplingCount, predictConfig.seed)
      const manHourResamples = resampling(manHourStatics.data, predictConfig.manHourResamplingCount, predictConfig.seed)
      const monthStatics = predictMonth(manHourResamples, predictConfig.monthSamplingCount, predictConfig.seed)

      setManHourDistribution(manHourStatics.data)

      const meanWorkload = Workload.fromManHour(manHourStatics.mean)
      const meanWorkloadTime = WorkloadTime.fromMonth(monthStatics.mean)
      const man = Math.ceil(meanWorkload.calcMan(meanWorkloadTime))
      const workloadTime = WorkloadTime.fromDay(Math.ceil(meanWorkloadTime.day))

      applyWorkload(man, workloadTime)

      return action
    },
    defaultLineCount
  )

  useEffect(() => {
    applyEndDateByWorkloadTime(workloadTime)
  }, [])

  return (
    <article className="App">
      <Panel title="開発規模と開発工数">
        <section>
          <h2>開発規模から開発工数の予測</h2>
          <form>
            <ul>
              <li>
                <label htmlFor="SLOC">開発規模(SLOC)</label>
                <input id="SLOC" type="number" value={lineCount?.toString()} onChange={(e) => { applyLineCount(e.target.valueAsNumber) } } />
              </li>
            </ul>
          </form>
        </section>
        <WorkloadPanel
          man={man}
          day={workloadTime == null ? null : workloadTime.day}
          manDay={workload == null ? null: workload.manDay}
          onChangeMan={applyMan}
          onChangeDay={applyDay}
        />
      </Panel>
      <Panel title="開発工数の確率分布の統計量">
        <StaticsViewer statics={manDayStatics} itemName="工数(人日)"/>
      </Panel>
      <Panel title="開発工数の妥当性">
        <PercentViewer score={manDayPercentile} />
      </Panel>
      <Panel title="開発スケジュール" >
        <form>
          <ul>
            <li>
              <label htmlFor="startDate">開始日</label>
              <input type="date" value={startDateStr ?? ""} onChange={(e) => { applyStartDate(e.target.value) }} disabled={ startDateStr === null } />
            </li>
            <li>
              <label htmlFor="endDate">締切日</label>
              <input type="date" value={endDateStr==null ? "" : endDateStr?.toString()} onChange={(e) => { applyEndDate(e.target.value) }} disabled={ endDateStr === null } />
            </li>
          </ul>
        </form>
      </Panel>
      <Panel title="工期の確率分布の統計量">
        <StaticsViewer statics={dayStatics} itemName="工期(日)"/>
      </Panel>
      <Panel title="締切前完了確率" >
        <PercentViewer score={completeProbability} />
      </Panel>
    </article>
  )
}
