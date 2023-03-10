import "./App.css"
import { useMemo, useState} from "react"
import { WorkloadPanel } from "./WorkloadPanel"
import { Panel } from "./Panel"
import { PredictConfig } from "./PredictConfig"
import { Statics } from "../core/Statics"
import { tensor, tensor1d } from "@tensorflow/tfjs"
import { defaultManHourData, defaultLineCount, defaultManMonthCost } from "./defaultData"
import { predictManHour } from "../core/predictManHour"
import { percentileOfScore, resampling } from "../core/StaticsUtil"
import { predictMonth } from "../core/predictMonth"
import { PercentViewer } from "./PercentViewer"
import { WorkloadTime } from "../core/WorkloadTime"
import { Workload } from "../core/Workload"
import { toFixedLocaleString } from "./toFixedLocaleString"
import { DistribitionViewer } from "./DistributionViewer"
import { Grid, Container, AppBar, Typography, Toolbar, IconButton } from "@mui/material"
import GitHubIcon from "@mui/icons-material/GitHub"
import { LazyInput } from "./LazyInput"

const dumpDateStr = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = ("0" + (date.getMonth() + 1)).slice(-2)
  const dd = ("0" + date.getDate()).slice(-2)
  return yyyy + "-" + mm + "-" + dd
}

type AppProps = {
  predictConfig: PredictConfig
  startDate: Date
}

function precachedDecorator<K, V>(f: (args: K) => V, preCache : Map<K, V>) {
  function g(args: K): V {
    if (preCache.has(args)) {
      return preCache.get(args) as V
    }
    return f(args)
  }
  return g
}

export const App = ({ startDate, predictConfig }: AppProps) => {

  const [lineCount, applyLineCount] = useState<number>(defaultLineCount)
  const [man, setMan] = useState<number | null>(null)
  const [workloadTime, setWorkloadTime] = useState<WorkloadTime | null>(null)

  const [startDateStr, setStartDateStr] = useState(dumpDateStr(startDate))
  const [endDateStr, setEndDateStr] = useState<string>()

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
  }, new Map([[defaultLineCount, cacheResult]]))

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
      if (workload == null) {
        return null
      }

      return percentileOfScore(manHourDistribution, workload.manHour)
    },
    [workload, manHourDistribution]
  )

  const monthDistribution = useMemo(() => {
    if (workload == null) {
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

    //1?????????20??????
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

  const [manMonthCost, setManMonthCost] = useState<number>(defaultManMonthCost)
  const totalCost = useMemo(() => workload == null ? 0 : manMonthCost * workload.manMonth, [workload, manMonthCost])
  const breakEvenProfit = useMemo(()=>completeProbability == null || completeProbability == 0 ? 0 : totalCost/completeProbability, [totalCost, completeProbability])

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
    applyWorkload(man, WorkloadTime.fromDay( inputDay == null || isNaN(inputDay) || inputDay < 0 ? 0 :  inputDay))
  }

  function applyMan(inputMan: number | null) {
    applyWorkload((inputMan == null || isNaN(inputMan) || inputMan < 0) ? 0 : inputMan, workloadTime)
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
    <Container maxWidth={false} disableGutters>
      <AppBar position="static">
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Typography variant="h4" component="h1" noWrap sx={{flexGrow:1}}>?????????????????????</Typography>
            <IconButton
              size="large"
              aria-label="Github Link"
              onClick={()=>{ window.open("https://github.com/kotauchisunsun/scpredict", "_blank", "noreferrer noopener")}}
            >
              <GitHubIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Grid container spacing={1} p={3}>
        <Panel title="???????????????????????????">
          <section>
            <Typography variant="h6" component="h1">???????????????????????????????????????</Typography>
            <form onSubmit={(e) => e.preventDefault()}>
              <ul>
                <li>
                  <label htmlFor="SLOC" title="???????????????????????????">????????????(SLOC)</label>
                  <LazyInput
                    id="SLOC"
                    initialValue={lineCount}
                    step={100}
                    onChange={(e) => { applyLineCount(e.target.valueAsNumber) }}
                  />
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
        <Panel md={6} title="???????????????????????????">
          <DistribitionViewer legend="???????????????????????????" xaxisTitle="??????(??????)" yUpperLimit={0.1} statics={manDayStatics} />
        </Panel>
        <Panel title="????????????????????????">
          <PercentViewer score={manDayPercentile} />
        </Panel>
        <Panel title="??????????????????????????????">
          <section>
            <Typography variant="h6" component="h1">????????????????????????</Typography>
            <form>
              <ul>
                <li>
                  <label htmlFor="startDate" title="????????????????????????????????????">?????????</label>
                  <input id="startDate" type="date" value={startDateStr} onChange={(e) => { applyStartDate(e.target.value) }}/>
                </li>
                <li>
                  <label htmlFor="endDate" title="????????????????????????????????????">?????????</label>
                  <input id="endDate" type="date" value={endDateStr} onChange={(e) => { applyEndDate(e.target.value) }}/>
                </li>
              </ul>
            </form>
          </section>
          <section>
            <Typography variant="h6" component="h1">???????????????</Typography>
            <form>
              <ul>
                <li>
                  <label htmlFor="manMonthCost" title="?????????????????????????????? \373,500">?????????(???/??????)</label>
                  <LazyInput
                    id="manMonthCost"
                    initialValue={manMonthCost}
                    step={500}
                    onChange={(e) => { setManMonthCost(e.target.valueAsNumber) }} />
                </li>
                <li>
                  <label htmlFor="totalCost" title="????????? ?? ??????">??????????????????</label>
                  <input id="totalCost" value={toFixedLocaleString(totalCost)} disabled/>
                </li>
                <li>
                  <label htmlFor="breakEvenProfit" title="???????????????????????? ?? ??????????????????????????? = ???????????????">????????????????????????</label>
                  <input id="breakEvenProfit" value={toFixedLocaleString(breakEvenProfit)} disabled/>
                </li>
              </ul>
            </form>
          </section>
        </Panel>
        <Panel md={6} title="?????????????????????">
          <DistribitionViewer legend="?????????????????????" xaxisTitle="??????(???)" yUpperLimit={0.015} statics={dayStatics} />
        </Panel>
        <Panel title="?????????????????????" >
          <PercentViewer score={completeProbability} />
        </Panel>
      </Grid>
    </Container>
  )
}
