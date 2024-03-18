import { RefinementList } from "react-instantsearch"
import { Panel } from "./Panel"

export const FallbackComponent = ({ attribute }: { attribute: string }) => {
  return (
    <Panel header={attribute}>
      <RefinementList attribute={attribute} />
    </Panel>
  )
}
