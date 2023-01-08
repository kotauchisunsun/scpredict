import { Statics } from "../core/Statics"

const toFixedLocaleString = (n?: number) => {
  if (n == null) {
    return ""
  }

  const a = n?.toFixed(0)
  const b = Number(a)
  return b.toLocaleString()
}

export const StaticsViewer = ({ itemName, statics }: { itemName: string, statics: Statics|null }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>項目</th><th>{itemName}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>平均</td><td>{toFixedLocaleString(statics?.mean)}</td>
        </tr>
        <tr>
          <td>中央値</td><td>{toFixedLocaleString(statics?.median)}</td>
        </tr>
        <tr>
          <td>2.5%</td><td>{toFixedLocaleString(statics?.p95Lower)}</td>
        </tr>
        <tr>
          <td>25%</td><td>{toFixedLocaleString(statics?.p50Lower)}</td>
        </tr>
        <tr>
          <td>75%</td><td>{toFixedLocaleString(statics?.p50Upper)}</td>
        </tr>
        <tr>
          <td>97.5%</td><td>{toFixedLocaleString(statics?.p95Upper)}</td>
        </tr>
      </tbody>
    </table>)
}
