import { ReactNode } from "react"
import {Grid, Typography} from "@mui/material"

export const Panel = (props: { title: string, sm?: number, md?:number, children?: ReactNode; }) => {
  return (
    <Grid item xs={12} sm={12} md={props.md ?? 3}>
      <Typography variant="h5">{props.title}</Typography>
      {props.children ?? <p>{ props.children }</p>}
    </Grid>
  )
}
