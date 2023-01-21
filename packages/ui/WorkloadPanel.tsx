type WorkloadPanelProps = {
    man: number | null;
    day: number | null;
    manDay: number | null;
    onChangeMan?: (v: number | null) => void;
    onChangeDay?: (v: number | null) => void;
};

export const WorkloadPanel = ({ man, day, manDay, onChangeMan, onChangeDay}: WorkloadPanelProps) => {
  return (
    <section>
      <h1>想定の開発工数</h1>
      <form>
        <ul>
          <li>
            <label htmlFor="man">人数</label>
            <input id="man" type="number" min={0} value={man == null ? "" : man.toString()}  onChange={(e) => { onChangeMan?.(e.target.valueAsNumber) }} disabled={ man===null } />
          </li>
          <li>
            <label htmlFor="day" title="土日を除く、基礎設計・詳細設計・製作・結合テスト・総合テスト　５工程の合計の日数">工期(日)</label>
            <input id="day" type="number" min={0} value={day == null ? "": day.toString()} onChange={(e) => { onChangeDay?.(e.target.valueAsNumber) }} disabled={ day===null } />
          </li>
          <li>
            <label htmlFor="manDay">工数(人日)</label>
            <input id="manDay" type="number" value={manDay == null ? "": manDay.toString()} disabled />
          </li>
        </ul>
      </form>
    </section>
  )
}
