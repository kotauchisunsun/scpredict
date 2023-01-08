import "./App.css"
import { useEffect, useMemo, useReducer, useState} from "react"
import { Workload } from "./Workload"
import { Panel } from "./Panel"
import { PredictConfig } from "./PredictConfig"
import { Statics } from "../core/Statics"
import { tensor1d } from "@tensorflow/tfjs"
import { defaultManHourData, defaultLineCountParameter, defaultMan, defaultDay, defaultLineCount } from "./defaultData"
import { predictManHour } from "../core/predictManHour"
import { percentileOfScore, resampling } from "../core/StaticsUtil"
import { predictMonth } from "../core/predictMonth"
import { StaticsViewer } from "./StaticsViewer"
import { PercentViewer } from "./PercentViewer"

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

  const defaultManHourStatics = new Statics(tensor1d(defaultManHourData), defaultLineCountParameter.mean, defaultLineCountParameter.median, defaultLineCountParameter.p50Lower, defaultLineCountParameter.p50Upper, defaultLineCountParameter.p95Lower, defaultLineCountParameter.p95Upper)
  const [manHourStatics, setManHourStatics] = useState<Statics|null>(defaultManHourStatics)

  const [man, setMan] = useState<number | null>(defaultMan)
  const [day, setDay] = useState<number | null>(defaultDay)
  const month = useMemo(() => day == null ? null : day / 20, [day])

  const workloadManDayDistribution = useMemo(()=>( manHourStatics == null ? null : manHourStatics.data.div(8).as1D()), [manHourStatics])
  const workloadManDay = useMemo(() => (man != null && day != null ? man * day : null), [man, day])

  const workloadPercentile = useMemo(
    () => {
      if (workloadManDay == null || workloadManDayDistribution == null) {
        return null
      }

      return percentileOfScore(workloadManDayDistribution, workloadManDay)
    },
    [workloadManDay, workloadManDayDistribution]
  )

  const workloadMonthDistribution = useMemo(() => {
    if (workloadManDay == null) {
      return null
    }
    return predictMonth(tensor1d([workloadManDay / 8]), 1000, predictConfig.seed).data
  }, [workloadManDay])


  const monthPercentile = useMemo(
    () => {
      if (month == null || workloadMonthDistribution == null) {
        return null
      }
      return percentileOfScore(workloadMonthDistribution, month)
    },
    [month, workloadMonthDistribution]
  )

  function applyWorkload(man: number | null, day: number | null) {
    setMan(man)
    setDay(day)

    if (man == null || day === null) {
      return
    }

    const endDate = new Date(Date.parse(startDateStr))
    endDate.setDate(endDate.getDate() + day)
    setEndDateStr(dumpDateStr(endDate))
  }

  function applyDay(inputDay: number | null) {
    applyWorkload(man, inputDay)
  }

  function applyMan(inputMan: number | null) {
    applyWorkload(inputMan, day)
  }

  const [startDateStr, setStartDateStr] = useState(dumpDateStr(new Date()))
  const [endDateStr, setEndDateStr] = useState<string | null>(null)

  function applyStartDate(dateStr: string) {
    setStartDateStr(dateStr)
    applyWorkload(man, day)
  }

  function applyEndDate(dateStr: string) {
    setEndDateStr(dateStr)

    const endDate = new Date(Date.parse(dateStr))
    const startDate = new Date(Date.parse(startDateStr))

    const diffTime = endDate.getTime() - startDate.getTime()
    const diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    setDay(diffDay)
  }

  const [lineCount, applyLineCount] = useReducer(
    (state: number | null, action: number | null) => {
      if (action == null) {
        return state
      }

      const manHourStatics = predictManHour(action, predictConfig.manHourSamplingCount, predictConfig.seed)
      const manHourResamples = resampling(manHourStatics.data, predictConfig.manHourResamplingCount, predictConfig.seed)
      const monthStatics = predictMonth(manHourResamples, predictConfig.monthSamplingCount, predictConfig.seed)

      setManHourStatics(manHourStatics)

      const manHour = manHourStatics.mean
      const manDay = manHour / 8
      const month = monthStatics.mean
      const day = Math.ceil(20 * month)
      const man = Math.ceil(manDay / day)

      applyWorkload(man, day)

      return action
    },
    defaultLineCount
  )

  useEffect(() => { applyWorkload(defaultMan, defaultDay) }, [])

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
        <Workload
          man={man}
          day={day}
          manDay={workloadManDay}
          onChangeMan={applyMan}
          onChangeDay={applyDay}
        />
      </Panel>
      <Panel title="開発工数の確率分布の統計量">
        <StaticsViewer statics={manHourStatics} />
      </Panel>
      <Panel title="開発工数の妥当性">
        <PercentViewer score={workloadPercentile} />
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
      <Panel title="工期の確率分布" />
      <Panel title="締切前完了確率" >
        <PercentViewer score={monthPercentile} />
      </Panel>
    </article>
  )
}
