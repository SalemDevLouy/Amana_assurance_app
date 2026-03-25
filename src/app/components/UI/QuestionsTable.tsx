"use client";
import React,{useEffect,useState} from 'react'

import {
  Table,TableHeader,TableColumn,TableBody,TableRow,
  TableCell,Input,Button,DropdownTrigger,
  Dropdown,DropdownMenu,DropdownItem,
  Pagination,Selection,SortDescriptor,
} from '@heroui/react'

import AddModal from './AddModal'
import { FaAngleDown, FaSearch } from 'react-icons/fa'
import { capitalize } from '@/app/utils/capitalize'
import { BmcQuestion } from '@/app/types/types'
import DeleteQuestionModal from './DeleteModale'
//Materialui icons 

const INITIAL_VISIBLE_COLUMNS = ["text", "category", "actions"];


export default function QuestionsTable() {
  //Columns of Questionss Table
  const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "Text", uid: "text", sortable: false},
  {name: "CATEGORY", uid: "category", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];
//fetch Questionss data
  const [questions, setQuestions] = useState<BmcQuestion[]>([])
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('../api/bmc')
        if (response.ok) {
          const data = await response.json()
          setQuestions(data)
        } else {
          console.error('Failed to fetch questions:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching questions data:', error)
      }
    }
    fetchData()
  }, [])

  //handle Deleted Questions
  const deleteQuestionFormTable = React.useCallback((id:string) => {
  const updateQuestions = questions.filter(question => question.id !== id);
  setQuestions(updateQuestions); 
}, [questions]);


  
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
//   const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({ column: "id", direction: "ascending" });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(questions.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredQuestions = [...questions];

    if (hasSearchFilter) {
        filteredQuestions = filteredQuestions.filter((question) =>
        question.questionText.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== questions.length) {
    //     filteredQuestions = filteredQuestions.filter((Questions) =>
    //     Array.from(statusFilter).includes(questions.length),
    //   );
    // }

    return filteredQuestions;
  }, [questions, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: BmcQuestion, b: BmcQuestion) => {
      const first = a[sortDescriptor.column as keyof BmcQuestion] as number;
      const second = b[sortDescriptor.column as keyof BmcQuestion] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((question: BmcQuestion, columnKey: React.Key) => {
      const cellValue = question[columnKey as keyof BmcQuestion];
  
      switch (columnKey) {
        case "id":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{question.id}</p>
            </div>
          );
        case "text":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{question.questionText}</p>
            </div>
          );
        case "phone":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{question.id}</p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-start items-center gap-2">
              {/* <UpdateModal questions={questions} /> */}
              <DeleteQuestionModal questionId={question.id} questionTxt={question.questionText} deleteQuestion={deleteQuestionFormTable}/>
            </div>
          );
        default:
          return Array.isArray(cellValue) ? (
            <span>{cellValue.map((option, index) => <span key={index}>{String(option)}</span>)}</span>
          ) : (
            <span>{String(cellValue)}</span>
          );
      }
    }, []);
  

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1 border-blue-700",
            }}
            placeholder="Search by questions..."
            size="md"
            startContent={<FaSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            
            <Dropdown className="bg-gray-200 text-blue-800 ">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<FaAngleDown className='text-sm' />
                  }
                  size="sm"
                  variant="flat"
                  className='bg-blue-600 text-gray-500 hover:bg-blue-700'
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <AddModal />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {questions.length} questions</span>
          <label className="flex items-center  text-small bg-blue-600 outline-none text-gray-100 p-2 rounded-xl ">
            Rows per page:
            <select
              className="bg-blue-600 outline-none text-gray-100 text-small "
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    questions.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  // table head styling
  
  const classNames = React.useMemo(
    () => ({
      wrapper: [" max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <Table 
      isCompact
      removeWrapper
      aria-label="table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={classNames}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No questions found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
