import { ReactNode } from "react"

export const Panel = ({
  children,
  header,
  footer,
}: {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
}) => {
  return (
    <div className="ais-Panel">
      {header && <div className="ais-Panel-header">{header}</div>}
      <div className="ais-Panel-body">{children}</div>
      {footer && <div className="ais-Panel-footer">{footer}</div>}
    </div>
  )
}
