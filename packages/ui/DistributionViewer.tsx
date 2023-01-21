import Plot from "react-plotly.js"
import { Statics } from "../core/Statics"

export const DistribitionViewer = ({xaxisTitle, ulimt, statics}: { xaxisTitle: string, ulimt: number, statics: Statics | null}) => {
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
        histnorm: "probability",
        marker: { color: histogramColor },
      },
      {
        x: [statics.p50Lower, statics.p50Lower],
        y: [0, ulimt],
        name: "50%信頼区間の下側",
        mode: "lines",
        line: { color: p50Color }
      },
      {
        x: [statics.p50Upper, statics.p50Upper],
        y: [0, ulimt],
        name: "50%信頼区間の上側",
        mode: "lines",
        line: { color: p50Color }
      },
      {
        x: [statics.p95Lower, statics.p95Lower],
        y: [0, ulimt],
        name: "95%信頼区間の下側",
        mode: "lines",
        line: { color: p95Color }
      },
      {
        x: [statics.p95Upper, statics.p95Upper],
        y: [0, ulimt],
        name: "95%信頼区間の上側",
        mode: "lines",
        line: { color: p95Color }
      },
      {
        x: [statics.median, statics.median],
        y: [0, ulimt],
        name: "中央値",
        mode: "lines",
        line: { color: medianColor }
      },
      {
        x: [statics.mean, statics.mean],
        y: [0, ulimt],
        name: "平均値",
        mode: "lines",
        line: { color: meanColor }
      }
    ]}
    layout={
      {
        width: 800,
        xaxis: {
          title: xaxisTitle,
          range: [0, statics.p95Upper * 1.1]
        },
        yaxis: {
          title: "生起確率"
        },
        margin: {
          t: 30
        }
      }
    }
    config={{ displaylogo: false }}
  />
}
