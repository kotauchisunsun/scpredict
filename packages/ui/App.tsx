import "./App.css"
import { useMemo, useState} from "react"
import { WorkloadPanel } from "./WorkloadPanel"
import { Panel } from "./Panel"
import { PredictConfig } from "./PredictConfig"
import { Statics } from "../core/Statics"
import { tensor, tensor1d } from "@tensorflow/tfjs"
import { defaultManHourData, defaultLineCount } from "./defaultData"
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

function precachedDecorator<K, V>(f: (args: K) => V, preCache : Map<K, V>) {
  function g(args: K): V {
    if (preCache.has(args)) {
      console.log("hit")
      return preCache.get(args) as V
    }
    return f(args)
  }
  return g
}

export const App = ({ predictConfig }: AppProps) => {

  const [lineCount, applyLineCount] = useState<number>(defaultLineCount)
  const [man, setMan] = useState<number | null>(null)
  const [workloadTime, setWorkloadTime] = useState<WorkloadTime | null>(null)

  const [startDateStr, setStartDateStr] = useState(dumpDateStr(new Date()))
  const [endDateStr, setEndDateStr] = useState<string | null>(null)

  const cacheResult = {
    manHourData:  tensor1d(defaultManHourData),
    manHourStaticsMean: 2010.5684814453125,
    monthStaticsMean: 4.79464054107666
  }

  const calcMeanFromLineCount = precachedDecorator((lineCount: number) => {
    const manHourStatics = predictManHour(lineCount, predictConfig.manHourSamplingCount, predictConfig.seed)
    const manHourResamples = resampling(manHourStatics.data, predictConfig.manHourResamplingCount, predictConfig.seed)
    const monthStatics = predictMonth(manHourResamples, predictConfig.monthSamplingCount, predictConfig.seed)

    return {
      manHourData: manHourStatics.data,
      manHourStaticsMean: manHourStatics.mean,
      monthStaticsMean: monthStatics.mean
    }
  }, new Map([[800, cacheResult]]))

  const manHourDistribution = useMemo(() => {
    const result = calcMeanFromLineCount(lineCount)

    const meanWorkload = Workload.fromManHour(result.manHourStaticsMean)
    const meanWorkloadTime = WorkloadTime.fromMonth(result.monthStaticsMean)
    const man = Math.ceil(meanWorkload.calcMan(meanWorkloadTime))
    const workloadTime = WorkloadTime.fromDay(Math.ceil(meanWorkloadTime.day))

    applyWorkload(man, workloadTime)
    return result.manHourData
  }, [lineCount])

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

    const endDate = workloadTime.calcDateWithoutWeekend(new Date(Date.parse(startDateStr)))
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

  function applyStartDate(dateStr: string) {
    setStartDateStr(dateStr)
    applyWorkload(man, workloadTime)
  }

  function applyEndDate(dateStr: string) {
    setEndDateStr(dateStr)

    const endDate = new Date(Date.parse(dateStr))
    const startDate = new Date(Date.parse(startDateStr))

    const workloadTime = WorkloadTime.diffWithoutWeekend(startDate, endDate)
    setWorkloadTime(workloadTime)
  }

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
