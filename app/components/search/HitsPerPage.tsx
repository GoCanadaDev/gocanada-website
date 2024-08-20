import { useHitsPerPage } from "react-instantsearch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export const HitsPerPage = () => {
  const { items, refine } = useHitsPerPage({
    items: [
      { label: "Show 1 per page", value: 1 },
      { label: "Show 10 per page", value: 10, default: true },
      { label: "Show 25 per page", value: 25 },
      { label: "Show 50 per page", value: 50 },
    ],
  })
  const { value: currentValue } = items.find(({ isRefined }) => isRefined) || {}

  return (
    <>
      <Select
        onValueChange={(val) => refine(Number(val))}
        defaultValue={String(currentValue)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={String(currentValue)} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={String(item.value)}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
