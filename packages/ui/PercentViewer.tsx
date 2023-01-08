import "./Percentile.css"

export const PercentViewer = ({ score }: { score: number | null; }) => {
  return (
    <span className="percentile">{score == null ? "--" : (score * 100).toFixed(0)}%</span>
  )
}
