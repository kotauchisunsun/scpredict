import type { Meta, StoryObj } from "@storybook/react"
import { PercentViewer } from "../PercentViewer"

const meta = {
  title: "PercentViewer",
  component: PercentViewer,
} satisfies Meta<typeof PercentViewer>

export default meta

type Story = StoryObj<typeof meta>

export const Sample: Story = {
  render: () => <PercentViewer score={0.5} />,
}
