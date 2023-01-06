type WorkloadProps = {
    man: number | null;
    day: number | null;
    manDay: number | null;
    onChangeMan?: (v: number | null) => void;
    onChangeDay?: (v: number | null) => void;
};

export const Workload = ({ man, day, manDay, onChangeMan, onChangeDay}: WorkloadProps) => {
    return (
        <section>
            <h2>人数・工期の調整</h2>
            <form>
                <ul>
                    <li>
                        <label htmlFor="man">人数</label>
                        <input id="man" type="number" min={0} value={man?.toString()} onChange={(e) => { onChangeMan?.(e.target.valueAsNumber); }} />
                    </li>
                    <li>
                        <label htmlFor="day">工期(日)</label>
                        <input id="day" type="number" min={0} value={day?.toString()} onChange={(e) => { onChangeDay?.(e.target.valueAsNumber); }} />
                    </li>
                    <li>
                        <label htmlFor="manDay">工数(人日)</label>
                        <input id="manDay" type="number" value={manDay?.toString()} disabled />
                    </li>
                </ul>
            </form>
        </section>
    );
};
