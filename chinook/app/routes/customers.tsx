import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { db } from '~/db.server'
import { Link, Outlet, useLoaderData, useNavigate } from '@remix-run/react'
import { useMemo } from 'react'
import {
  MantineReactTable,
  type MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table'
import { customer_viewInChinook } from '../../drizzle/schema'
import { createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { ActionIcon, Box, Button, Group, Text } from '@mantine/core'
import { IconEdit, IconInvoice, IconTrash } from '@tabler/icons-react'

const CustomerSchema = createSelectSchema(customer_viewInChinook)
type Customer = z.infer<typeof CustomerSchema>

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const customers = await db.query.customer_viewInChinook.findMany()
  return json({ customers })
}

export default function Customers() {
  const { customers } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const columns = useMemo<MRT_ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'customer_name',
        header: 'Customer Name',
      },
      {
        accessorKey: 'company',
        header: 'Company',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'support_rep_name',
        header: 'Support Rep',
      },
    ],
    [],
  )
  const table = useMantineReactTable({
    columns,
    data: customers,
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
      density: 'xs',
    },
    renderDetailPanel: ({ row }) => (
      <Box
        style={{
          display: 'grid',
          margin: 'auto',
          gridTemplateColumns: '1fr 1fr',
          width: '50%',
        }}
      >
        <Text>Address: {row.original.address}</Text>
        <Text>City: {row.original.city}</Text>
        <Text>Postal Code: {row.original.postal_code}</Text>
        <Text>State: {row.original.state}</Text>
        <Text>Country: {row.original.country}</Text>
        <Text>Fax: {row.original.fax}</Text>
        <Text>Phone: {row.original.phone}</Text>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Button onClick={() => navigate('/customers/create')}>
          Create Customer
        </Button>
      )
    },
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => {
      return (
        <Group grow>
          <ActionIcon
            component={Link}
            to={`/customers/edit/${row.original.customer_id}`}
            prefetch={'intent'}
          >
            <IconEdit />
          </ActionIcon>
          <ActionIcon
            component={Link}
            to={`/customers/delete/${row.original.customer_id}`}
            prefetch={'intent'}
          >
            <IconTrash />
          </ActionIcon>
          <ActionIcon
            component={Link}
            to={`/invoices?customerId=${row.original.customer_id}`}
            prefetch={'intent'}
          >
            <IconInvoice />
          </ActionIcon>
        </Group>
      )
    },
    defaultColumn: {
      maxSize: 300,
      minSize: 80,
      size: 80,
    },
  })
  return (
    <div>
      <h1>Customers</h1>
      <p>This is the page where you can view all the customers.</p>
      <MantineReactTable table={table} />
      <Outlet />
    </div>
  )
}
