import Plot from "react-plotly.js"
import { Statics } from "../core/Statics"

export const DistribitionViewer = ({statics}: { statics: Statics | null}) => {
  if (statics == null) {
    return <></>
  }

  const histogramColor = "#6cd4ff"
  const p50Color = "#8b80f9"
  const p95Color = "#27187E"
  const medianColor = "#353531"
  const meanColor = "#57CC99"

  return < Plot
    data={[
      {
        x: statics?.data.arraySync(),
        type: "histogram",
        name: "開発工数の確率分布",
        marker: { color: histogramColor },
      },
      {
        x: [statics.p50Lower, statics.p50Lower],
        y: [0, 800],
        name: "50%信頼区間の下側",
        mode: "lines",
        line: { color: p50Color }
      },
      {
        x: [statics.p50Upper, statics.p50Upper],
        y: [0, 800],
        name: "50%信頼区間の上側",
        mode: "lines",
        line: { color: p50Color }
      },
      {
        x: [statics.p95Lower, statics.p95Lower],
        y: [0, 800],
        name: "95%信頼区間の下側",
        mode: "lines",
        line: { color: p95Color }
      },
      {
        x: [statics.p95Upper, statics.p95Upper],
        y: [0, 800],
        name: "95%信頼区間の上側",
        mode: "lines",
        line: { color: p95Color }
      },
      {
        x: [statics.median, statics.median],
        y: [0, 800],
        name: "中央値",
        mode: "lines",
        line: { color: medianColor }
      },
      {
        x: [statics.mean, statics.mean],
        y: [0, 800],
        name: "平均値",
        mode: "lines",
        line: { color: meanColor }
      }
    ]}
    layout={
      {
        width: 800,
        xaxis: {
          range: [0, statics.p95Upper * 1.1]
        },
        margin: {
          t: 30
        }
      }
    }
    config={{ displaylogo: false }}
  />
}
