import { useEffect } from "react"

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  title: React.ReactNode
  children: React.ReactNode
}

const Modal = ({ isOpen, setIsOpen, title, children }: Props) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)

    if (isOpen) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }

    ;() => {
      document.removeEventListener("keydown", handleEscape)
      document.body.classList.remove("overflow-hidden")
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div className="absolute left-0 top-0 z-50 h-screen w-full backdrop-blur-sm">
          <div
            className="absolute left-0 right-0 top-0 z-50 flex h-1/2 max-h-full w-full justify-center overflow-hidden md:inset-0"
            aria-modal="true"
            role="dialog"
          >
            <div className="relative max-h-full w-full max-w-2xl p-4">
              <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
                <div className="flex items-center justify-between rounded-t border-b p-4 md:p-5 dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <button
                    type="button"
                    className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg
                      className="h-3 w-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div>{children}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
