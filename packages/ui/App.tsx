import "./App.css"
import { useEffect, useMemo, useReducer, useState} from "react"
import { Workload } from "./Workload"
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
  const manDayDistribution = useMemo(()=>( manHourDistribution == null ? null : manHourDistribution.div(8).as1D()), [manHourDistribution])

  const [man, setMan] = useState<number | null>(defaultMan)
  const [day, setDay] = useState<number | null>(defaultDay)
  const month = useMemo(() => day == null ? null : day / 20, [day])

  const manDay = useMemo(() => (man != null && day != null ? man * day : null), [man, day])

  const manDayStatics = useMemo(() => {
    if (manHourDistribution == null) {
      return null
    }
    return Statics.build(manHourDistribution.div(8).as1D())
  }, [manHourDistribution])

  const manDayPercentile = useMemo(
    () => {
      if (manDay == null || manDayDistribution == null) {
        return null
      }

      return percentileOfScore(manDayDistribution, manDay)
    },
    [manDay, manDayDistribution]
  )

  const monthDistribution = useMemo(() => {
    if (manDay == null || manHourDistribution==null) {
      return null
    }

    const filteredManHourDistribution = manHourDistribution.arraySync().filter((x) => x < manDay * 8)
    const target = resampling(tensor(filteredManHourDistribution), 1000, predictConfig.seed)
    return predictMonth(target, 100, predictConfig.seed).data
  }, [manDay, manHourDistribution])

  const dayStatics = useMemo(() => {
    if (monthDistribution == null) {
      return null
    }

    return Statics.build(monthDistribution.mul(20))
  },
  [monthDistribution])

  const monthPercentile = useMemo(
    () => {
      if (month == null || monthDistribution == null) {
        return null
      }
      return percentileOfScore(monthDistribution, month)
    },
    [month, monthDistribution]
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

      setManHourDistribution(manHourStatics.data)

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
          manDay={manDay}
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
