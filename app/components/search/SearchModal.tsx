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
          <DialogTitle>Search by location, tag, or keyword...</DialogTitle>

          <Form
            className="flex gap-4"
            method="post"
            action="/resource/search"
            reloadDocument
          >
            <input
              name="search"
              type="search"
              autoFocus
              className="sm:text-md block w-9/12 rounded-md border border-zinc-300 bg-zinc-50 p-4 text-zinc-900 outline-brand dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400"
            />
            <div className="w-3/12">
              <button
                type="submit"
                onClick={() => {
                  setModalOpen(false)
                }}
                className="flex w-full items-center justify-center gap-1 rounded-md bg-brand p-4 text-center text-white hover:bg-brandHover dark:bg-zinc-800"
              >
                <Search size={16} /> Search
              </button>
            </div>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default SearchModal
