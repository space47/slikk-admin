/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { FormItem, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { SINGLE_COMPANY_DATA, USER_PROFILE_DATA } from '@/store/types/company.types'
import { companyStore } from '@/store/types/companyStore.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

interface props {
    mobile: string | undefined
    customClass?: string
}

const AssignStoreToUser = ({ mobile, customClass }: props) => {
    const [storePicker, setStorePicker] = useState<(string | number)[]>([])
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)
    const currentCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

    const query = useMemo(() => {
        if (mobile) {
            return `/company/${currentCompany.id}/users?mobile=${mobile}`
        } else {
            return []
        }
    }, [currentCompany.id, mobile])

    const { data: userData } = useFetchSingleData<USER_PROFILE_DATA>({ url: query as string })

    useEffect(() => {
        if (userData && userData?.store?.length > 0) {
            const initialStoreIds = userData?.store?.map((store) => store.id)
            setStorePicker(initialStoreIds)
        }
    }, [userData, setStorePicker])

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const selectedCompanies = storeResults.filter((option) => storePicker.includes(option.id))

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
                <div className="text-xl font-bold mb-2">Store Assign To Picker</div>
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
                            onChange={(newVals) => handleStorePicker(newVals || [])}
                        />
                    </div>
                </div>
            </FormItem>
        </div>
    )
}

export default AssignStoreToUser
