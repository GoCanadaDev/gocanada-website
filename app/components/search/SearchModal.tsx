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
          <DialogTitle>Search</DialogTitle>

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
              placeholder="Search by location, tag, or keyword..."
              className="sm:text-md block w-9/12 rounded-md border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
            <div className="w-3/12">
              <button
                type="submit"
                onClick={() => {
                  setModalOpen(false)
                }}
                className="flex w-full items-center justify-center gap-1 rounded-md bg-slate-100 p-4 text-center dark:bg-slate-800"
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
