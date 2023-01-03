import './App.css'
import { LineCountPredictor } from '../core/LineCountPredictor';
import { Statics } from '../core/Statics';

function App() {
  const lineCount = 4081;

  const manHourSamplingCount = 10000;
  const manHourResamplingCount = 100;
  const monthSamplingCount = 1000;
  const monthResamplingCount = 10000;

  const lineCountPredictor = LineCountPredictor.predict(
    lineCount,
    manHourSamplingCount,
    manHourResamplingCount,
    monthSamplingCount,
    monthResamplingCount,
    0
  );

  const renderStatics = (header: string, s: Statics) => { 
    return (<div>
      <h2>{header}</h2>
        <p>{s.mean}</p>
        <p>{s.median}</p>
        <p>{s.p50Lower}</p>
        <p>{s.p50Upper}</p>
        <p>{s.p95Lower}</p>
        <p>{s.p95Upper}</p>
      </div>
    )
  }

  return (
    <div className="App">
      <div>
        <input type="text" value="781"></input>
        <input type="button" value="計算"></input>
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

export default App
