import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { ChevronDown, ChevronUp, Square, SquareCheckBig } from "lucide-react"
import { formatSubmissionTime, formatDateOfBirth } from "@/utils/dateUtils"
import clsx from "clsx"

export type Responses = {
  nhi: string
  name: string
  dateofbirth?: Date
  submission_time?: Date
}

export const columns: ColumnDef<Responses>[] = [
  {
    accessorKey: "nhi",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 sm:px-4 py-0 h-6 sm:h-10 text-mobile-p sm:text-h6 hover:no-underline"
        >
          NHI
          <ChevronUp className={clsx("ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4", {"invisible": column.getIsSorted() === false, "hidden": column.getIsSorted() === "desc"})} />
          <ChevronDown className={clsx("ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4", {"hidden": column.getIsSorted() === "asc" || column.getIsSorted() === false})} />
        </Button>
      )
    },
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 sm:px-4 py-0 h-0 sm:h-10 text-mobile-p sm:text-h6 hover:no-underline"
        >
          First Name
          <ChevronUp className={clsx("ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4", {"invisible": column.getIsSorted() === false, "hidden": column.getIsSorted() === "desc"})} />
          <ChevronDown className={clsx("ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4", {"hidden": column.getIsSorted() === "asc" || column.getIsSorted() === false})} />
        </Button>
      )
    },
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 sm:px-4 py-0 h-0 sm:h-10 text-mobile-p sm:text-h6 hover:no-underline"
        >
          Last Name
          <ChevronUp className={clsx("ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4", {"invisible": column.getIsSorted() === false, "hidden": column.getIsSorted() === "desc"})} />
          <ChevronDown className={clsx("ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4", {"hidden": column.getIsSorted() === "asc" || column.getIsSorted() === false})} />
        </Button>
      )
    },
  },
  {
    accessorKey: "dateofbirth",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 sm:px-4 py-0 h-0 sm:h-10 text-mobile-p sm:text-h6 hover:no-underline"
        >
          Date of Birth
          <ChevronUp className={clsx("ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4", {"invisible": column.getIsSorted() === false, "hidden": column.getIsSorted() === "desc"})} />
          <ChevronDown className={clsx("ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4", {"hidden": column.getIsSorted() === "asc" || column.getIsSorted() === false})} />
        </Button>
      )
    },
    cell: ({ row }) => {
      return formatDateOfBirth(row.getValue("dateofbirth"))
    },
    
    enableGlobalFilter: false,
  },
  {
    accessorKey: "submission_time",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 sm:px-4 py-0 h-0 sm:h-10 text-mobile-p sm:text-h6 hover:no-underline"
        >
          Submission Time
          <ChevronUp className={clsx("ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4", {"invisible": column.getIsSorted() === false, "hidden": column.getIsSorted() === "desc"})} />
          <ChevronDown className={clsx("ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4", {"hidden": column.getIsSorted() === "asc" || column.getIsSorted() === false})} />
        </Button>
      )
    },
    cell: ({ row }) => {
      return formatSubmissionTime(row.getValue("submission_time"))
    },
    enableGlobalFilter: false,
  },
  {
    accessorKey: "actioned",
    header: "Actioned",
    cell: ({ row }) => {
      return (
        <>
          {/* Logic to render icon based on state and hover */}
          <span className="group-hover:hidden">
            {row.getValue("actioned") ? <SquareCheckBig className="w-3 h-3 sm:w-5 sm:h-5"/> : <Square className="w-3 h-3 sm:w-5 sm:h-5"/>}
          </span>
          <span className="hidden group-hover:inline">
            {row.getValue("actioned") ? <Square className="w-3 h-3 sm:w-5 sm:h-5"/> : <SquareCheckBig className="w-3 h-3 sm:w-5 sm:h-5"/>}
          </span>
        </>
      )},
    enableGlobalFilter: false,
  },
]