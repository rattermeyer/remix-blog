import '@mantine/core/styles.css'
import '@mantine/dates/styles.css' //if using mantine date picker features
import 'mantine-react-table/styles.css' //make sure MRT styles were imported in your app root (once)
import '@mantine/notifications/styles.css';
import {AppShell, Burger, ColorSchemeScript, Flex, List, MantineProvider,} from '@mantine/core'
import {Link, Links, Meta, Outlet, Scripts, ScrollRestoration,} from '@remix-run/react'
import {theme} from '~/theme'
import {useDisclosure} from '@mantine/hooks'
import {ColorSchemeToggle} from '~/components/ColorSchemeToggle';
import {Notifications} from '@mantine/notifications';

export function Layout() {
  const [opened, { toggle }] = useDisclosure()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications position={'top-right'} />
          <AppShell
            header={{ height: 60 }}
            navbar={{
              width: 300,
              breakpoint: 'sm',
              collapsed: { mobile: !opened },
            }}
            padding="md"
          >
            <AppShell.Header>
              <Flex gap={'md'} justify={'flex-start'} direction={'row'}>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
                <div>Logo</div>
                <Flex
                  gap={'md'}
                  justify={'flex-end'}
                  direction={'row'}
                  flex={1}
                >
                  <ColorSchemeToggle />
                </Flex>
              </Flex>
            </AppShell.Header>

            <AppShell.Navbar p={'md'}>
              <h2>App</h2>
              <List>
                <List.Item>
                  <Link to={'/albums'} prefetch={'intent'}>
                    Albums
                  </Link>
                </List.Item>
                <List.Item>
                  <Link to={'/customers'} prefetch={'intent'}>
                    Customers
                  </Link>{' '}
                </List.Item>
                <List.Item>
                  <Link to={'/invoices'} prefetch={'intent'}>
                    Invoices
                  </Link>
                </List.Item>
              </List>
              <h2>Docs</h2>
              <List>
                <List.Item>
                  <Link to={'https://remix.run/docs/en/main'}>Remix Docs</Link>
                </List.Item>
                <List.Item>
                  <Link to={'https://mantine.dev/docs/getting-started/'}>
                    Mantine Docs
                  </Link>
                </List.Item>
                <List.Item>
                  <Link to={'https://www.mantine-react-table.com'}>Mantine React Table</Link>
                </List.Item>
                <List.Item>
                  <Link to={'https://github.com/forge42dev/remix-hook-form'}>
                    Remix Hook Form
                  </Link>
                </List.Item>
                <List.Item>
                  <Link to={'https://react-hook-form.com'}>
                    React Hook Form
                  </Link>
                </List.Item>
                <List.Item>
                    <Link to={'https://orm.drizzle.team/docs/overview'}>Drizzle ORM</Link>
                </List.Item>
                <List.Item>
                    <Link to={'https://zod.dev'}>Zod</Link>
                </List.Item>
                <List.Item>
                  <Link to={'https://www.typescriptlang.org'}>Typescript</Link>
                  <List.Item>
                    <Link to={'https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring'}>Destructuring</Link>
                  </List.Item>
                </List.Item>
              </List>
            </AppShell.Navbar>
            <AppShell.Main>
              <Outlet />
            </AppShell.Main>
          </AppShell>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Layout />
}
