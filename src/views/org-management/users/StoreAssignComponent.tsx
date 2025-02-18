import { FormItem, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React, { useEffect } from 'react'

interface props {
    storePicker: string | number
    setStorePicker: (x: string | number) => void
    mobile: string | undefined
}

const StoreAssignComponent = ({ setStorePicker, storePicker, mobile }: props) => {
    console.log('mobile Numver is ', mobile)
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const selectedCompany = storeResults.find((option) => option.id === storePicker)

    const handleStorePicker = async (id: number | undefined) => {
        setStorePicker(id)

        const body = {
            mobile: mobile,
            store: id,
        }

        try {
            const response = await axioisInstance.post(`/merchant/store/user`, body)
            notification.success({
                message: response?.data?.data?.message || 'Store Assigned Successfully',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to assign store',
            })
            console.error(error)
        }
    }

    return (
        <div className="mb-6 mt-10 xl:ml-20">
            <FormItem label="">
                <div className="text-xl font-bold mb-2">Store Assign To Picker</div>
                <div>
                    <div className="flex flex-col gap-1  w-full max-w-md">
                        <Select
                            isClearable
                            className="w-3/4"
                            options={storeResults}
                            getOptionLabel={(option) => option.code}
                            getOptionValue={(option) => option.id}
                            value={selectedCompany || null}
                            onChange={(newVal) => handleStorePicker(newVal?.id)}
                        />
                    </div>
                </div>
            </FormItem>
        </div>
    )
}

export default StoreAssignComponent
