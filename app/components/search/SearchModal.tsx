import { Search } from "lucide-react"
import { Form } from "@remix-run/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const SearchModal = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Blur active element so keyboard dismisses and viewport restores before unmount.
      // Prevents wrong centering/zoom when reopening on mobile.
      if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }
    setModalOpen(open)
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className="focus:outline-none" aria-label="Search">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-1">
                <Search className="inline" />
              </div>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">
            Search by location, tag, or keyword...
          </DialogTitle>

          <Form
            className="flex gap-4"
            method="post"
            action="/resource/search"
            reloadDocument
          >
            <Input
              name="search"
              type="search"
              autoFocus
              className="text-base min-[480px]:text-sm"
            />
            <div className="w-3/12">
              <Button type="submit" className="gap-2" variant="default">
                <Search size={16} /> Search
              </Button>
            </div>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default SearchModal
