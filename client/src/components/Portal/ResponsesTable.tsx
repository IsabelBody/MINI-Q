import { useState, useEffect } from 'react'
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Button } from '../ui/button'
import { Input } from "@/components/ui/input"
import DOBPicker from './DOBPicker'
import { searchResponses, updateResponseToActioned } from '@/apiService'
import clsx from 'clsx';

interface RowData {
  nhi: string;
  first_name: string;
  last_name: string;
  dateofbirth: string;
  actioned: boolean;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};


const ResponsesTable = <TData, TValue>({
  columns,
  data: initialData,
}: DataTableProps<TData, TValue>) => {
  const navigate = useNavigate();
  const { toast } = useToast()
  const [sorting, setSorting] = useState<SortingState>(() => {
    const savedSorting = localStorage.getItem("tableSorting");
    return savedSorting ? JSON.parse(savedSorting) : [];
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const savedFilters = localStorage.getItem("tableFilters");
    return savedFilters ? JSON.parse(savedFilters) : [];
  });
  const [globalFilterInput, setGlobalFilterInput] = useState(() => {
    return localStorage.getItem("globalFilter") || "";
  });
  const [data, setData] = useState([])
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showActioned, setShowActioned] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("showActioned") || "false");
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const savedDate = localStorage.getItem("selectedDate");
    return savedDate ? new Date(savedDate) : null;
  });

   const [pageIndex, setPageIndex] = useState<number>(() => {
    return JSON.parse(localStorage.getItem("pageIndex") || "0");
  });

  const [pageSize, setPageSize] = useState<number>(() => {
    return JSON.parse(localStorage.getItem("pageSize") || "12"); 
  });
  

  useEffect(() => {
    fetchData()
  }, [initialData]);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / pageSize),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: { pageIndex, pageSize },
    },
    /* Separate state for pagination management due to unique react table requirements */
    onPaginationChange: (updater) => {
      const newPaginationState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newPaginationState.pageIndex);  
      setPageSize(newPaginationState.pageSize);  
    },
    /* This flag stops the index from being overwritten */
    autoResetPageIndex: false, 
  })

  const saveTableState = () => {
    localStorage.setItem("tableSorting", JSON.stringify(sorting));
    localStorage.setItem("tableFilters", JSON.stringify(columnFilters));
    localStorage.setItem("globalFilter", globalFilterInput);
    localStorage.setItem("showActioned", JSON.stringify(showActioned));
    localStorage.setItem("selectedDate", selectedDate ? selectedDate.toISOString() : "");
    localStorage.setItem("pageIndex", JSON.stringify(pageIndex));
  };



  const fetchData = async () => {
    setLoading(true);
    try {
      const searchData = await searchResponses(globalFilterInput, showActioned, selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined);
      setData(searchData);
    } catch (err) {
      setError('No results found.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = debounce(fetchData, 300);



  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setGlobalFilterInput(value);
    setPageIndex(0)
  };


  const handleSearchClick = async () => {
    const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined;
    
    const searchData = await searchResponses(globalFilterInput, showActioned, formattedDate);
    setData(searchData);
    setPageIndex(0)
  
  };

  useEffect(() => {
    debouncedFetchData();
  }, [showActioned, globalFilterInput, selectedDate]);

  useEffect(() => {
    saveTableState(); 
  }, [sorting, columnFilters, globalFilterInput, showActioned, selectedDate, pageIndex]);

  

  const handleClearSearch = async () => {
    setGlobalFilterInput(''); 
    setSelectedDate(null); 
    await fetchData(); 
  };


  const handleDateSelect = async (date: Date | null) => {
    /* Temporary date checking to prevent search being done for 
    every character. Remove if doing dynamic searching by dates.  
    */
    const formattedDate = date ? format(date, 'dd/MM/yyyy') : "";
  
    if (formattedDate.length === 10) {
      setSelectedDate(date);
      setPageIndex(0)
    } else {
      setSelectedDate(null); 
    }
  };
  

  const handleActionClick = async (
    rowIndex: number,
    nhi: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    actioned: boolean,
  ) => {
    toast({
      title: actioned ? "Marked as actioned" : "Marked as not actioned",
      description: `Patient: ${firstName} ${lastName}`,
      action: (
        <ToastAction altText="Undo action" className="hover:bg-accent-5" onClick={() => updateActioned(rowIndex, nhi, firstName, lastName, dateOfBirth, !actioned, true)}>Undo</ToastAction>
      ),
    })

    updateActioned(rowIndex, nhi, firstName, lastName, dateOfBirth, actioned, false)
  }

  const updateActioned = async (
    rowIndex: number,
    nhi: string,
    first_name: string,
    last_name: string,
    dateofbirth: string,
    actioned: boolean,
    undo: boolean,
  ) => {
    try {
      const params = nhi
        ? { nhi, actioned }
        : { first_name, last_name, dateofbirth, actioned };
        
      await updateResponseToActioned(params);
      const newRowToUpdate = data[rowIndex]
  
      if (!undo) {
        setData(prevData =>
          prevData.filter(response =>
            nhi
              ? (response as RowData).nhi !== nhi
              : (response as RowData).first_name !== first_name ||
                (response as RowData).last_name !== last_name ||
                (response as RowData).dateofbirth !== dateofbirth
          )
        );
      } else {
        setData(prevData => {
          const newData = [...prevData];
          newData.splice(rowIndex, 0, newRowToUpdate);
          return newData;
        });
        
      }
    } catch (err) {
      console.error("Error updating actioned status", err);
    }
  };


  const handleSelectDropdown = async (value: string) => {
    setPageIndex(0)
    setShowActioned(value === 'actioned');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        {/* Search bar */}
        <div className="flex w-full md:w-96">
          <div className="relative w-full">
            <Input
              placeholder="Search by Patient name or NHI"
              value={globalFilterInput} 
              onChange={handleSearchInputChange} 
              className="pl-3 sm:pl-4 pr-7 sm:pr-8 sm:h-10 text-xs rounded-r-none border-none"
            />
            {globalFilterInput != "" && <button className="absolute right-2 my-auto top-1/2 -translate-y-1/2" onClick={handleClearSearch}>
              <X className="text-destructive/80 w-4 h-4 sm:w-5 sm:h-5"/>
            </button>}

          </div>
          <Button 
            className="bg-accent-100 h-8 sm:h-10 hover:bg-accent-25 text-white hover:text-accent-110 sm:px-4 rounded-l-none"
            onClick={handleSearchClick} 
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex w-full md:w-[calc(100%-21rem)] gap-2 flex-wrap items-center justify-between">
          <DOBPicker onDateSelect={handleDateSelect} />

          {/* Actioned / Not actioned toggle */}
          <div className="flex gap-2 sm:gap-4 items-center">
            <p className="text-white text-mobile-sm sm:text-h6">Show</p>
            <Select value={showActioned ? 'actioned' : 'notActioned'} onValueChange={(value) => handleSelectDropdown(value)}>
              <SelectTrigger className="w-28 sm:w-32 h-8 sm:h-10 text-mobile-sm sm:text-p font-medium bg-white hover:bg-white px-2 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notActioned" className="text-mobile-sm sm:text-p py-1 sm:py-1.5 pl-6 sm:pl-8">Not actioned</SelectItem>
                <SelectItem value="actioned" className="text-mobile-sm sm:text-p py-1 sm:py-1.5 pl-6 sm:pl-8">Actioned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <hr />
      {/* Responses Table */}
      <div className="rounded-md border overflow-clip">
        <Table className="md:table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={clsx("px-2 bg-accent-75 text-primary py-0 h-0 sm:h-10 text-mobile-p sm:text-h6", {"w-24 text-center": header.id=="actioned"})}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const nhi = (row.original as RowData).nhi
                const firstName = (row.original as RowData).first_name
                const lastName = (row.original as RowData).last_name
                const dateOfBirth = (row.original as RowData).dateofbirth
                const patientDetails = (nhi === "") ? {firstName: firstName, lastName: lastName, DOB: dateOfBirth} : {NHI: nhi}
                
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={clsx("bg-primary-5 hover:bg-secondary-25", {"bg-secondary-5/90": (row.original as RowData).actioned})}
                  >
                    {row.getVisibleCells().map((cell) => (           
                      <TableCell key={cell.id} className="text-primary p-0 text-nowrap">
                        {/* Every column except Action */}
                        {(cell.column.id != "actioned") &&
                          <div onClick={() => {
                            saveTableState(); 
                            navigate("/patient-response", { state: patientDetails });
                          }} className={clsx("block py-1 sm:py-1.5 px-2 sm:px-6 text-mobile-sm sm:text-sm cursor-pointer", {"text-secondary-50": (row.original as RowData).actioned})}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        }
                        {/* Action column */}
                        {(cell.column.id == "actioned") &&
                          <Button
                            onClick={() => handleActionClick( row.index, nhi, firstName, lastName, dateOfBirth, !(row.original as RowData).actioned)}
                            className="px-0 sm:px-2 bg-transparent hover:bg-transparent text-secondary-50 h-6 py-0 group block mx-auto"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Button>
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className={clsx("h-24 text-center bg-primary-5 text-mobile-sm sm:text-p", {"bg-secondary-5/90 text-secondary-50": showActioned})}>
                  {/* No results. */}
                  <div className='mb-56 sm:mb-80'>
                    {loading ? 'Loading...' : error ? error : 'No results found.'}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-start justify-between">
        <div className="text-white text-mobile-p sm:text-h6">Showing {data.length} results</div>
        <div className="flex justify-end space-x-2 sm:py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-1 sm:px-2 h-7 sm:h-9 text-mobile-sm sm:text-p"
          >
            <ChevronLeft className="h-4 sm:h-6"/>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-1 sm:px-2 h-7 sm:h-9 text-mobile-sm sm:text-p"
          >
            <ChevronRight className="h-4 sm:h-6"/>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResponsesTable