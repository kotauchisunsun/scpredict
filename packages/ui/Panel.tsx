import { ReactNode } from "react"

export const Panel = (props: { title: string; children?: ReactNode; }) => {
  return (
    <section>
      <h1>{props.title}</h1>
      {props.children ?? <p>{ props.children }</p>}
    </section>
  )
}
