import { useEffect, useState } from 'react'
import { User } from '../userCommonTypes/UserCommonTypes'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'

interface Props {
    globalFilter: string
    currentSelectedPage: Record<string, string>
    searchOnEnter: string
    page: number
    pageSize: number
}

export const useUserApi = ({ currentSelectedPage, globalFilter, searchOnEnter, page, pageSize }: Props) => {
    const [data, setData] = useState<User[]>([])
    const [totalData, setTotalData] = useState(0)
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [accessDenied, setAccessDenied] = useState(false)

    useEffect(() => {
        const abortController = new AbortController()
        const fetchData = async () => {
            try {
                let filterParam = ''
                if (globalFilter) {
                    currentSelectedPage?.value === 'name'
                        ? (filterParam = `name=${globalFilter}`)
                        : currentSelectedPage?.value === 'mobile'
                          ? (filterParam = `mobile=${globalFilter}`)
                          : ''
                }

                // const company_id = !globalFilter ? `/${selectedCompany?.id}` : ''

                const response = await axioisInstance.get(`company${selectedCompany?.id}/users?${filterParam}`)
                const data = response.data.data
                const total = response.data.data.length
                if (globalFilter && currentSelectedPage?.value === 'mobile') {
                    setData([data])
                } else {
                    setData(data)
                }
                setTotalData(total)
                setAccessDenied(false)
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if (globalFilter.length > 9 && (error?.response?.status === 403 || error?.response?.status === 401)) {
                        setAccessDenied(true)
                    }
                } else {
                    console.error(error)
                }
            }
        }
        if (selectedCompany?.id) {
            fetchData()
        }

        return () => {
            abortController.abort()
        }
    }, [page, pageSize, selectedCompany.id, searchOnEnter, currentSelectedPage])

    const paginatedData = data?.slice((page - 1) * pageSize, page * pageSize)

    return { paginatedData, totalData, accessDenied }
}
