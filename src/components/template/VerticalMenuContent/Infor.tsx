import Dropdown from '@/components/ui/Dropdown'
import { useAppDispatch, useAppSelector } from '@/store'
import { setDefaultCompanyId } from '@/store/action/company.action'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import type { SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Users {
    id: number
    name: string
    registered_name: string
}

const Infor = () => {
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>(
        (state) => state.company.company,
    )
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>(
        (state) => state.company.currCompany,
    )
    const dispatch = useAppDispatch()

    const onDropdownItemClick = (index: string) => {
        dispatch(setDefaultCompanyId(companyList[parseInt(index)]))
    }

    const onDropdownClick = (e: SyntheticEvent) => {
        console.log('Dropdown Clicked', e)
    }

    const navigate = useNavigate()

    const handleOption = () => {
        console.log('object')
    }

    if (!selectedCompany) {
        return
    }

    return (
        <div className="text-[14px] max-h-[200px]">
            <Dropdown
                key={selectedCompany.id}
                title={` ${selectedCompany.name}`}
                onClick={onDropdownClick}
            >
                <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide ">
                    {companyList.map((item, i) => (
                        <Dropdown.Item
                            key={i}
                            eventKey={i.toString()}
                            onSelect={onDropdownItemClick}
                        >
                            <div
                                onClick={handleOption}
                                className="text-[12px] capitalize whitespace-break-spaces w-full min-w-[250px]"
                            >
                                {item.name}, {item.registered_name}
                            </div>
                        </Dropdown.Item>
                    ))}
                </div>
            </Dropdown>
        </div>
    )
}

export default Infor
