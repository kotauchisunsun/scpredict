import './App.css'
/*
import { LineCountPredictor } from '../core/LineCountPredictor';
import { Statics } from '../core/Statics';
import {useReducer} from 'react'

const initalLineCount = 800;
const manHourSamplingCount = 10000;
const manHourResamplingCount = 100;
const monthSamplingCount = 1000;
const monthResamplingCount = 10000;

const initialLineCountPredictor = LineCountPredictor.predict(
  initalLineCount,
  manHourSamplingCount,
  manHourResamplingCount,
  monthSamplingCount,
  monthResamplingCount,
  0
);
*/

export const App = () => {
  /*
  const [lineCountPredictor, dispatch] = useReducer(
    (state: LineCountPredictor, action: number) => { 
      return LineCountPredictor.predict(
        action,
        manHourSamplingCount,
        manHourResamplingCount,
        monthSamplingCount,
        monthResamplingCount,
        0
      );
    },
    initialLineCountPredictor
  );

  const renderStatics = (header: string, s: Statics) => { 
    return (
      <div>
        <h2>{header}</h2>
        <div>
          <p>{s.mean}</p>
          <p>{s.median}</p>
          <p>{s.p50Lower}</p>
          <p>{s.p50Upper}</p>
          <p>{s.p95Lower}</p>
          <p>{s.p95Upper}</p>
        </div>
      </div>
    )
  }
  */

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
                <input type="number" />
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
                <input type="number" />
              </li>
              <li>
                <label htmlFor="day">工期(日)</label>
                <input type="number" />
              </li>
              <li>
                <label htmlFor="manDay">工数(人日)</label>
                <input type="number" disabled/>
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
              <input type="date" />
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

  /*
        <div>
        <h2>SLOC</h2>
        <input type="number"
          min={10}
          defaultValue={initalLineCount}
          onChange={(e) => { dispatch(e.target.valueAsNumber) }}>  
        </input>
      </div>
      {renderStatics("ManHour", lineCountPredictor.manHourStatics)}
      <div>
        <h2>DevelopPhase</h2>
        {renderStatics("All[Month]", lineCountPredictor.monthStatics)}
        {renderStatics("BaseDesign[Month]", lineCountPredictor.developStatics.baseDesignStatics)}
        {renderStatics("DetailDesign[Month]", lineCountPredictor.developStatics.detailDesignStatics)}
        {renderStatics("Develop[Month]", lineCountPredictor.developStatics.developStatics)}
        {renderStatics("IntegrationTest[Month]", lineCountPredictor.developStatics.integrationTestStatics)}
        {renderStatics("SystemTest[Month]", lineCountPredictor.developStatics.systemTestStatics)}
      </div>
  */
}