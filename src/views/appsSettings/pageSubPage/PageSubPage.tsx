/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useAppDispatch, useAppSelector } from '@/store'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { pageNamesRequiredType, setPageNamesData, setSubPageNamesData } from '@/store/slices/pageSettingsSlice/pageNames.slice'
import React, { useEffect, useState } from 'react'
import { useSubPageColumns } from './pageSubPageUtils/useSubPageColumns'
import EasyTable from '@/common/EasyTable'
import AddSubPageNameModal from '../newPageSettings/newPageSettingsUtils/AddSubPageModal'

const PageSubPage = () => {
    const dispatch = useAppDispatch()
    const [addModal, setAddModal] = useState(false)
    const [currentPageName, setCurrentPageName] = useState({
        label: 'Home',
        value: 1 || null,
    })
    const { pageNamesData, subPageNamesData } = useAppSelector<pageNamesRequiredType>((state) => state.pageNames)

    const { data: subPageData, isSuccess: subPageSuccess } = pageSettingsService.useSubPageNamesQuery({
        pageName: currentPageName?.label,
    })

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({ page: 1, pageSize: 500 })

    useEffect(() => {
        if (currentPageName) sessionStorage.setItem('currentPageName', JSON.stringify(currentPageName))
    }, [currentPageName])

    useEffect(() => {
        if (isPageNamesSuccess) dispatch(setPageNamesData(pageNames?.data?.results || []))
    }, [dispatch, pageNames, isPageNamesSuccess])

    useEffect(() => {
        if (subPageSuccess) dispatch(setSubPageNamesData(subPageData?.data || []))
    }, [dispatch, subPageData, subPageSuccess])

    const BANNER_PAGE = pageNamesData?.map((item) => ({ label: item?.name, value: item?.id }))

    const handleSelectPage = (eventKey: string | null) => {
        if (!eventKey) return
        const selected = BANNER_PAGE?.find((item) => item.value?.toString() === eventKey)
        if (selected) {
            setCurrentPageName({ label: selected.label || '', value: selected.value as any })
        }
    }

    const columns = useSubPageColumns()

    return (
        <div>
            <div>
                <div className="flex justify-between items-center">
                    <div className="gap-3 mb-7">
                        <div className="font-bold">Pages</div>
                        <div className="bg-gray-200 px-2 rounded-lg font-bold text-[15px] mt-1">
                            <Dropdown
                                className="border bg-gray-200 text-black text-lg font-semibold"
                                title={currentPageName?.label}
                                onSelect={handleSelectPage}
                            >
                                <div className="max-h-60 overflow-y-auto">
                                    {BANNER_PAGE?.map((item) => (
                                        <DropdownItem key={item.value} eventKey={item?.value?.toString()}>
                                            {item.label}
                                        </DropdownItem>
                                    ))}
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                    <div>
                        <Button variant="new" size="sm" onClick={() => setAddModal(true)}>
                            Add
                        </Button>
                    </div>
                </div>
                <div>
                    <EasyTable overflow noPage mainData={subPageNamesData} columns={columns} />
                </div>

                {addModal && <AddSubPageNameModal setIsOpen={setAddModal} dialogIsOpen={addModal} />}
            </div>
        </div>
    )
}

export default PageSubPage
