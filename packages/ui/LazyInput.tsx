import { useRef, useState } from "react"

export const LazyInput = ({ id, initialValue, step, onChange }: { id: string; initialValue: number | null; step: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => {

  const [startTime, setStartTime] = useState(new Date())
  const startTimeRef = useRef(startTime)
  startTimeRef.current = startTime
  const [value, setValue] = useState(initialValue)

  function apply(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isNaN(e.target.valueAsNumber) && e.target.valueAsNumber >= 0) {
      setValue(e.target.valueAsNumber)
      const registerTime = new Date()
      setStartTime(registerTime)

      setTimeout(() => {
        if (startTimeRef.current.getTime() != registerTime.getTime()) {
          return
        }

        onChange(e)
      }, 1000)
    }
  }

  return <input
    id={id}
    type="number"
    value={value?.toString()}
    step={step}
    onChange={apply} />
}
