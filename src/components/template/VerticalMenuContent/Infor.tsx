/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown from '@/components/ui/Dropdown'
import { useAppDispatch, useAppSelector } from '@/store'
import { setDefaultCompanyId } from '@/store/action/company.action'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { useMemo, useState } from 'react'

const Infor = () => {
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)

    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA | null>((state) => state.company.currCompany)

    const [brandSearch, setBrandSearch] = useState<string>('')

    const dispatch = useAppDispatch()

    const onDropdownItemClick = (id: number) => {
        const company = companyList?.find((item) => item.id === id)
        if (company) {
            dispatch(setDefaultCompanyId(company))
        }
    }

    const handleOption = () => {
        console.log('object')
    }

    const filteredData = useMemo(() => {
        if (!companyList?.length) return []

        return companyList
            .filter((item) => item?.name?.toLowerCase().includes(brandSearch.toLowerCase()))
            .sort((a, b) => a?.name.localeCompare(b?.name))
    }, [companyList, brandSearch])

    if (!selectedCompany?.id) return null

    return (
        <div className="text-[14px] max-h-[140px] xl:text-[18px]  font-bold">
            <Dropdown key={selectedCompany.id} title={` ${selectedCompany.name || '🚫..No Data'}`}>
                <div className="mb-5 mt-2 flex items-center">
                    <input
                        className="flex items-center rounded-xl"
                        placeholder="Search by Brand Name"
                        type="search"
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide xl:h-[600px] xl:overflow-y-scroll font-bold ">
                    {filteredData
                        .sort((a, b) => a?.name.localeCompare(b?.name))
                        .map((item) => (
                            <Dropdown.Item key={item?.id} eventKey={item?.id?.toString()} onSelect={() => onDropdownItemClick(item?.id)}>
                                <div
                                    className="text-[12px] capitalize whitespace-break-spaces  min-w-[250px] xl:w-[500px] xl:text-[14px]"
                                    onClick={handleOption}
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
