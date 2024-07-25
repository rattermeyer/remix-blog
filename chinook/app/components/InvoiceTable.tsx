import {useMemo} from 'react'
import {MantineReactTable, MRT_ColumnDef, MRT_TableState, useMantineReactTable} from 'mantine-react-table'
import {Box, Button, Text} from '@mantine/core'
import {Invoice} from '~/models/invoices-model'
import {useNavigate} from '@remix-run/react'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'

type InvoicesTableProps = {
  invoices: Invoice[]
  initialState?: Partial<MRT_TableState<Invoice>>
}
dayjs.extend(calendar)

export const InvoiceTable = ({
  invoices,
  initialState,
}: InvoicesTableProps) => {
  const navigate = useNavigate()
  const columns = useMemo<MRT_ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: 'invoice_date',
        header: 'Invoice Date',
        Cell: ({ cell }) => {
          const date = cell.getValue<string>()
          const formattedDate = dayjs(date).calendar()
          return <>{formattedDate}</>
        },
        enableColumnFilter: false,
      },
      {
        accessorKey: 'customer_name',
        header: 'Customer Name',
      },
      {
        accessorKey: 'total',
        header: 'Total',
        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
      },
    ],
    [],
  )
  const table = useMantineReactTable({
    columns,
    data: invoices,
    renderDetailPanel: ({ row }) => (
      <Box
        style={{
          display: 'grid',
          margin: 'auto',
          gridTemplateColumns: '1fr 1fr',
          width: '50%',
        }}
      >
        <Text>Address: {row.original.billing_address}</Text>
        <Text>City: {row.original.billing_city}</Text>
        <Text>Postal Code: {row.original.billing_postal_code}</Text>
        <Text>State: {row.original.billing_state}</Text>
        <Text>Country: {row.original.billing_country}</Text>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Button
          onClick={() => {
            navigate('/invoices/create#create')
          }}
        >
          Create Invoice
        </Button>
      )
    },
    initialState: initialState ? initialState : undefined,
  })

  return <MantineReactTable table={table} />
}
