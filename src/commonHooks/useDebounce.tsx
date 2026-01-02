import debounce from 'lodash/debounce'
import { useEffect, useMemo } from 'react'

export const useDebounce = <T,>(setter: (value: T) => void, d: number) => {
    const debouncedFn = useMemo(() => debounce((value: T) => setter(value), d), [setter, d])

    useEffect(() => {
        return () => {
            debouncedFn.cancel()
        }
    }, [debouncedFn])

    return debouncedFn
}
