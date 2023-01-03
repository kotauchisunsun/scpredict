import './App.css'
import { LineCountPredictor } from '../core/LineCountPredictor';
import { Statics } from '../core/Statics';
import {useReducer} from 'react'

export const App = () => {

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

  return (
    <div className="App">
      <div>
        <h2>SLOC</h2>
        <input type="number"
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
    </div>
  )
}