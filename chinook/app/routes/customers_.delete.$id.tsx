import {ActionFunctionArgs, json, LoaderFunctionArgs, redirect} from '@remix-run/node'
import {customer_viewInChinook, customerInChinook, invoice_lineInChinook, invoiceInChinook,} from '../../drizzle/schema'
import {eq, inArray} from 'drizzle-orm'
import {db} from '~/db.server'
import {Form, useLoaderData} from '@remix-run/react';
import {Button} from '@mantine/core';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.id === undefined) {
    return new Response('Missing id', { status: 400 })
  }
  const customer = await db.query.customerInChinook.findFirst({
    where: eq(customerInChinook.customer_id, parseInt(params.id)),
    with: {
      invoiceInChinooks: true,
    }
  })
  return json({ customer })
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (params.id === undefined) {
    return new Response('Missing id', { status: 400 })
  }
  if (request.method === 'DELETE') {
    const customerId = parseInt(params.id)
    await db.transaction(async (tx) => {
      const invoices = await tx.query.invoiceInChinook.findMany({
        where: eq(invoiceInChinook.customer_id, customerId),
      })
      await tx.delete(invoice_lineInChinook).where(
        inArray(
          invoice_lineInChinook.invoice_id,
          invoices.map((i) => i.invoice_id),
        ),
      )
      await tx.delete(invoiceInChinook).where(eq(invoiceInChinook.customer_id, customerId))
      await tx
        .delete(customerInChinook)
        .where(eq(customerInChinook.customer_id, customerId))
    })
  }
  return redirect('/customers')
}

export default function CustomerDelete() {
  const { customer } = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>Delete Customer</h1>
      <p>Are you sure you want to delete {customer.customer_name}?</p>
      {JSON.stringify(customer, null, 2)}
      <Form method="delete">
        <Button type="submit">Delete</Button>
      </Form>
    </div>
  )
}
