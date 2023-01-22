import { ReactNode } from "react"
import {Grid} from "@mui/material"

export const Panel = (props: { title: string, sm?: number, md?:number, children?: ReactNode; }) => {
  return (
    <Grid item xs={12} sm={12} md={props.md ?? 3}>
      <h1>{props.title}</h1>
      {props.children ?? <p>{ props.children }</p>}
    </Grid>
  )
}
