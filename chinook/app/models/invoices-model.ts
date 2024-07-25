import {createSelectSchema} from 'drizzle-zod';
import {invoice_viewInChinook} from '../../drizzle/schema';
import type {z} from 'zod';

const InvoiceSchema = createSelectSchema(invoice_viewInChinook)
export type Invoice = z.infer<typeof InvoiceSchema>
