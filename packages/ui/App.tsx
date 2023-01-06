import './App.css'
import {useEffect, useReducer, useState} from 'react'
import { LineCountPredictor } from '../core/LineCountPredictor';
import * as tf from "@tensorflow/tfjs";
import { Percentile } from './Percentile';

const manHourSamplingCount = 10000;
const manHourResamplingCount = 100;
const monthSamplingCount = 1000;
const monthResamplingCount = 10000;

const dumpDateStr = (date: Date): string => { 
  const yyyy = date.getFullYear();
  const mm = ("0" + (date.getMonth() + 1)).slice(-2);
  const dd = ("0" + date.getDate()).slice(-2);
  return yyyy + '-' + mm + '-' + dd;
}

type AppProps = {
  lineCount : number
}

export const App = (props : AppProps) => {
  const [people, setPeople] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);

  const [workloadManDayDistribution,setWorkloadManDayDistribution] = useState<tf.Tensor1D | null>(null)
  const [workloadManDay, setWorkloadManDay] = useState<number | null>(null)

  const estimateWorkload = (people: number|null, day: number| null) => { 
    setPeople(people)
    setDay(day)

    if (people == null || day === null) { 
      return
    }
    setWorkloadManDay(people * day)

    const endDate = new Date(Date.parse(startDateStr))
    endDate.setDate(endDate.getDate() + day);
    setEndDateStr(dumpDateStr(endDate))
  }

  const [startDateStr, setStartDateStr] = useState(dumpDateStr(new Date())); 
  const [endDateStr, setEndDateStr] = useState<string | null>(null)

  const [lineCount, dispatch] = useReducer(
    (state: number | null, action: number | null) => {
      if (action === null)
        return state
      
      const linePredictor = LineCountPredictor.predict(
        action,
        manHourSamplingCount,
        manHourResamplingCount,
        monthSamplingCount,
        monthResamplingCount,
        0
      );

      const workloadManDayDistribution = linePredictor.manHourStatics.data.div(8).as1D()
      setWorkloadManDayDistribution(workloadManDayDistribution)

      const manHour = linePredictor.manHourStatics.mean;
      const manDay = manHour / 8;
      const month = linePredictor.monthStatics.mean;
      const day = Math.ceil(20 * month);
      const people = Math.ceil(manDay / day);
  
      estimateWorkload(people,day)

      return action;
    },
    null
  );

  useEffect(
    () => { dispatch(props.lineCount) },
    []
  )

  return (
    <article className="App" onLoad={() => dispatch(props.lineCount)}>
      <section>
        <h1>工数の予測</h1>
        <section>
          <h2>SLOCから工数の予測</h2>
          <form>
            <ul>
              <li>
                <label htmlFor="SLOC">SLOC</label>
                <input type="number" value={lineCount?.toString()} onChange={(e) => { dispatch(e.target.valueAsNumber) } } />
              </li>
            </ul>
          </form>
        </section>
        <section>
          <h2>人数・工期の調整</h2>
          <form>
            <ul>
              <li>
                <label htmlFor="man">人数</label>
                <input type="number" min={0} value={people?.toString()} onChange={(e) => { estimateWorkload(e.target.valueAsNumber,day) }} />
              </li>
              <li>
                <label htmlFor="day">工期(日)</label>
                <input type="number" min={0} value={day?.toString()} onChange={(e) => { estimateWorkload(people,e.target.valueAsNumber) }} />
              </li>
              <li>
                <label htmlFor="manDay">工数(人日)</label>
                <input type="number" value={ workloadManDay?.toString() } disabled/>
              </li>
            </ul>
          </form>
        </section>
      </section>
      <section>
        <h1>工数の確率分布</h1>
      </section>
      <Percentile data={workloadManDayDistribution} score={workloadManDay}/>
      <section>
        <h1>リリース完了の予測</h1>
        <form>
          <ul>
            <li>
              <label htmlFor="startDate">開始日</label>
              <input type="date" value={startDateStr} onChange={(e) => { setStartDateStr(e.target.value) }} />
            </li>
            <li>
              <label htmlFor="endDate">締切日</label>
              <input type="date" value={endDateStr?.toString()} onChange={(e) => { setEndDateStr(e.target.value) }} />
            </li>
          </ul>
        </form>
      </section>
      <section>
        <h1>工期の確率分布</h1>
      </section>
      <section>
        <h1>締め切り完了確率</h1>
        <span>92%</span>
      </section>
    </article>
  )
}