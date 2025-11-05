/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { companyStore } from '@/store/types/companyStore.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React, { useEffect } from 'react'

interface props {
    storePicker: (string | number)[]
    setStorePicker: (x: (string | number)[]) => void
    mobile: string | undefined
    profile?: USER_PROFILE_DATA['store']
    customClass?: string
    isAfter?: boolean
}

const StoreAssignComponent = ({ setStorePicker, storePicker, mobile, profile, customClass, isAfter }: props) => {
    console.log('mobile Number is ', mobile)
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        if (profile && profile.length > 0) {
            const initialStoreIds = profile.map((store) => store.id)
            setStorePicker(initialStoreIds)
        }
    }, [profile, setStorePicker])

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const selectedCompanies = storeResults?.filter((option) => storePicker?.includes(option.id))

    const handleStorePicker = async (selectedOptions: any[]) => {
        const idsArray = selectedOptions.map((opt) => opt.id)
        setStorePicker(idsArray)

        const body = {
            mobile: mobile,
            store: idsArray.join(','),
        }
        try {
            const response = await axioisInstance.post(`/merchant/store/user`, body)
            notification.success({
                message: response?.data?.data?.message || 'Store(s) Assigned Successfully',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to assign store(s)',
            })
            console.error(error)
        }
    }

    return (
        <div className={`${customClass ? customClass : 'mb-6 mt-10 xl:ml-20'}`}>
            <FormItem label="">
                <div className="text-xl font-bold mb-2">Store Assign</div>
                <div>
                    <div className="flex flex-col gap-1 w-full max-w-md">
                        <Select
                            isClearable
                            isMulti
                            className="w-3/4"
                            options={storeResults}
                            getOptionLabel={(option) => option.code}
                            getOptionValue={(option) => option.id}
                            value={selectedCompanies}
                            onChange={(newVals) => {
                                isAfter ? setStorePicker(newVals.map((opt) => opt.id)) : handleStorePicker(newVals || [])
                            }}
                        />
                    </div>
                </div>
            </FormItem>
        </div>
    )
}

export default StoreAssignComponent
