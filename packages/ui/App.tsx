import './App.css'
import {useReducer, useState} from 'react'
import { LineCountPredictor } from '../core/LineCountPredictor';

const initalLineCount = 800;
const initialPeople = 2.7;
const initialDay = 97.3;
const manHourSamplingCount = 10000;
const manHourResamplingCount = 100;
const monthSamplingCount = 1000;
const monthResamplingCount = 10000;

export const App = () => {
  const [people, setPeople] = useState(initialPeople);
  const [day, setDay] = useState(initialDay);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = ("0" + (today.getMonth() + 1)).slice(-2);
  const dd = ("0" + today.getDate()).slice(-2);
  const dateStr = yyyy + '-' + mm + '-' + dd;
  const [startDate, setStartDate] = useState(dateStr); 

  const [lineCount, dispatch] = useReducer(
    (state: number, action: number) => {
      const linePredictor = LineCountPredictor.predict(
        action,
        manHourSamplingCount,
        manHourResamplingCount,
        monthSamplingCount,
        monthResamplingCount,
        0
      );
  
      const manHour = linePredictor.manHourStatics.mean;
      const manDay = manHour / 8;
      const month = linePredictor.monthStatics.mean;
      const day = 20 * month;
      const people = manDay / day;
  
      setPeople(Number(people.toFixed(1)));
      setDay(Number(day.toFixed(1)));

      return action;
    },
    initalLineCount
  );

  return (
    <article className="App">
      <section>
        <h1>工数の予測</h1>
        <section>
          <h2>SLOCから工数の予測</h2>
          <form>
            <ul>
              <li>
                <label htmlFor="SLOC">SLOC</label>
                <input type="number" defaultValue={lineCount} onChange={(e) => { dispatch(e.target.valueAsNumber) } } />
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
                <input type="number" value={people} onChange={(e) => { setPeople(e.target.valueAsNumber) }} />
              </li>
              <li>
                <label htmlFor="day">工期(日)</label>
                <input type="number" value={day} onChange={(e) => { setDay(e.target.valueAsNumber) }} />
              </li>
              <li>
                <label htmlFor="manDay">工数(人日)</label>
                <input type="number" value={ (people * day).toFixed(2) } disabled/>
              </li>
            </ul>
          </form>
        </section>
      </section>
      <section>
        <h1>工数の確率分布</h1>
      </section>
      <section>
        <h1>工数の分位数</h1>
        <span>85%</span>
      </section>
      <section>
        <h1>リリース完了の予測</h1>
        <form>
          <ul>
            <li>
              <label htmlFor="startDate">開始日</label>
              <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value) }} />
            </li>
            <li>
              <label htmlFor="endDate">締切日</label>
              <input type="date" />
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