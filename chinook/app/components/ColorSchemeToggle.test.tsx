import {fireEvent, render, screen} from 'test-utils'
import {describe, expect, it, vi} from 'vitest'

import {useMantineColorScheme} from '@mantine/core'
import {ColorSchemeToggle} from './ColorSchemeToggle'

// Mock useMantineColorScheme
vi.mock('@mantine/core', async (importOriginal) => {
  const actual = await importOriginal()
  const useMantineColorScheme= vi.fn()
  // @ts-ignore
  return { ...actual, useMantineColorScheme }
})

describe('ColorSchemeToggle', () => {
  it('toggles color scheme correctly', () => {
    const setColorScheme = vi.fn()
    useMantineColorScheme.mockImplementation(() => ({
      setColorScheme,
    }))

    render(<ColorSchemeToggle />)

    const lightButton = screen.getByRole('button', { name: 'Light' })
    const darkButton = screen.getByRole('button', { name: 'Dark' })
    const autoButton = screen.getByRole('button', { name: 'Auto' })

    fireEvent.click(lightButton)
    expect(setColorScheme).toHaveBeenCalledWith('light')

    fireEvent.click(darkButton)
    expect(setColorScheme).toHaveBeenCalledWith('dark')

    fireEvent.click(autoButton)
    expect(setColorScheme).toHaveBeenCalledWith('auto')
  })
})
