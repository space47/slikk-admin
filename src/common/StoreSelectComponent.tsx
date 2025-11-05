/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'
import React, { useEffect } from 'react'

interface Props {
    label: string
    store: any | any[] // single or multiple selected store(s)
    setStore: (val: any) => void
    customCss?: string
    isSingle?: boolean
}

const StoreSelectComponent = ({ label, store, setStore, customCss, isSingle = false }: Props) => {
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    // selected value logic
    const selectedStores = isSingle
        ? storeResults.find((option) => store?.id === option.id) || null
        : storeResults.filter((option) => store?.some((s: any) => s?.id === option.id))

    return (
        <div>
            <FormContainer>
                <FormItem label={label}>
                    <div className="flex flex-col gap-1 w-full max-w-md">
                        <Select
                            isClearable
                            isMulti={!isSingle}
                            className={customCss ?? 'w-full'}
                            options={storeResults}
                            getOptionLabel={(option) => option.code}
                            getOptionValue={(option) => option.id}
                            value={selectedStores}
                            onChange={(newVal) => {
                                setStore(newVal)
                            }}
                        />
                    </div>
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default StoreSelectComponent
