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

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
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
            <Input name="search" type="search" autoFocus />
            <div className="w-3/12">
              <Button
                type="submit"
                className="gap-2 bg-brand hover:bg-brandHover dark:bg-brand dark:text-white dark:hover:bg-brandHover"
              >
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
