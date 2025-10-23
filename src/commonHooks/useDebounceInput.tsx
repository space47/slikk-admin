import { useEffect, useMemo, useState } from 'react'
import debounce from 'lodash/debounce'

interface props {
    globalFilter: string
    delay: number
}

export const useDebounceInput = ({ globalFilter, delay }: props) => {
    const [debounceFilter, setDebounceFilter] = useState('')

    const debouncedSetFilter = useMemo(
        () =>
            debounce((value: string) => {
                setDebounceFilter(value)
            }, delay),
        [],
    )

    useEffect(() => {
        debouncedSetFilter(globalFilter as string)
        return () => {
            debouncedSetFilter.cancel()
        }
    }, [globalFilter, debouncedSetFilter])
    return { debounceFilter }
}
