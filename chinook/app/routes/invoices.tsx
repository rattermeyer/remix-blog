import {json, type LoaderFunctionArgs} from '@remix-run/node'
import {Outlet, useLoaderData, useNavigate} from '@remix-run/react'
import {createSelectSchema} from 'drizzle-zod'
import type {z} from 'zod'
import {db} from '~/db.server'
import {invoice_viewInChinook} from '../../drizzle/schema'
import {useMemo} from 'react'
import {MantineReactTable, type MRT_ColumnDef, useMantineReactTable,} from 'mantine-react-table'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import {Box, Button, Text} from '@mantine/core'
import {eq} from 'drizzle-orm'

const InvoiceSchema = createSelectSchema(invoice_viewInChinook)
type Invoice = z.infer<typeof InvoiceSchema>

dayjs.extend(calendar)

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')
  const invoices = await db
    .select()
    .from(invoice_viewInChinook)
    .where(
      customerId
        ? eq(invoice_viewInChinook.customer_id, parseInt(customerId))
        : undefined,
    );
  return json({ invoices })
}

export default function Invoices() {
  const { invoices } = useLoaderData<typeof loader>()
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
        filterFn: 'betweenInclusive',
        filterVariant: 'range',
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
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
      showGlobalFilter: true,
    },
    enableFullScreenToggle: false,
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
  })

  return (
    <>
      <h1>Invoices</h1>
      <MantineReactTable table={table} />
    </>
  )
}
