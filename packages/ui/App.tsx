import "./App.css"
import {useEffect, useMemo, useReducer, useState} from "react"
import { LineCountPredictor } from "../core/LineCountPredictor"
import * as tf from "@tensorflow/tfjs"
import { Percentile } from "./Percentile"
import { Workload } from "./Workload"
import { Panel } from "./Panel"

const manHourSamplingCount = 10000
const manHourResamplingCount = 100
const monthSamplingCount = 1000
const monthResamplingCount = 10000

const dumpDateStr = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = ("0" + (date.getMonth() + 1)).slice(-2)
  const dd = ("0" + date.getDate()).slice(-2)
  return yyyy + "-" + mm + "-" + dd
}

type AppProps = {
  initialLineCount : number
}

export const App = (props: AppProps) => {
  const [lineCountPredictor, setLineCountPredictor] = useState<LineCountPredictor|null>(null)
  const [man, setMan] = useState<number | null>(null)
  const [day, setDay] = useState<number | null>(null)

  const [workloadManDayDistribution, setWorkloadManDayDistribution] = useState<tf.Tensor1D | null>(null)
  const workloadManDay = useMemo(() => (man != null && day != null ? man * day : null), [man, day])

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

  const [lineCount, applyLineCount] = useReducer(
    (state: number | null, action: number | null) => {
      if (action == null) {
        return state
      }

      const linePredictor = LineCountPredictor.predict(
        action,
        manHourSamplingCount,
        manHourResamplingCount,
        monthSamplingCount,
        monthResamplingCount,
        0
      )

      setLineCountPredictor(linePredictor)

      const workloadManDayDistribution = linePredictor.manHourStatics.data.div(8).as1D()
      setWorkloadManDayDistribution(workloadManDayDistribution)

      const manHour = linePredictor.manHourStatics.mean
      const manDay = manHour / 8
      const month = linePredictor.monthStatics.mean
      const day = Math.ceil(20 * month)
      const man = Math.ceil(manDay / day)

      applyWorkload(man, day)

      return action
    },
    props.initialLineCount
  )

  useEffect(
    () => { applyLineCount(props.initialLineCount) },
    [props.initialLineCount]
  )

  const dumpManDay = (n?: number) => {
    if (n == null) {
      return ""
    }

    const a = n?.toFixed(0)
    const b = Number(a)
    return b.toLocaleString()
  }

  return (
    <article className="App">
      <Panel title="開発規模と開発工数">
        <section>
          <h2>SLOCから開発工数の予測</h2>
          <form>
            <ul>
              <li>
                <label htmlFor="SLOC">SLOC</label>
                <input type="number" value={lineCount?.toString()} onChange={(e) => { applyLineCount(e.target.valueAsNumber) } } />
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
        <table>
          <thead>
            <tr>
              <th>項目</th><th>工数(人日)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>平均</td><td>{dumpManDay(lineCountPredictor?.manHourStatics.mean)}</td>
            </tr>
            <tr>
              <td>中央値</td><td>{dumpManDay(lineCountPredictor?.manHourStatics.median)}</td>
            </tr>
            <tr>
              <td>2.5%</td><td>{dumpManDay(lineCountPredictor?.manHourStatics.p95Lower)}</td>
            </tr>
            <tr>
              <td>25%</td><td>{dumpManDay(lineCountPredictor?.manHourStatics.p50Lower)}</td>
            </tr>
            <tr>
              <td>75%</td><td>{dumpManDay(lineCountPredictor?.manHourStatics.p50Upper)}</td>
            </tr>
            <tr>
              <td>97.5%</td><td>{dumpManDay(lineCountPredictor?.manHourStatics.p95Upper)}</td>
            </tr>
          </tbody>
        </table>
      </Panel>
      <Panel title="開発工数の妥当性">
        <Percentile data={workloadManDayDistribution} score={workloadManDay}/>
      </Panel>
      <Panel title="開発予定" >
        <form>
          <ul>
            <li>
              <label htmlFor="startDate">開始日</label>
              <input type="date" value={startDateStr ?? ""} onChange={(e) => { applyStartDate(e.target.value) }} disabled={ startDateStr === null } />
            </li>
            <li>
              <label htmlFor="endDate">締切日</label>
              <input type="date" value={endDateStr==null ? "" : endDateStr?.toString()} onChange={(e) => { setEndDateStr(e.target.value) }} disabled={ endDateStr === null } />
            </li>
          </ul>
        </form>
      </Panel>
      <Panel title="工期の確率分布" />
      <Panel title="締切前完了確率" >
        <Percentile data={null} score={null} />
      </Panel>
    </article>
  )
}
