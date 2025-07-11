import { Button, Dropdown, Pagination, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { pageSettingsService } from '@/store/services/pageSettingService'
import {
    pageSettingsRequiredType,
    setPageSettingsData,
    setPage,
    setPageSize,
    setCount,
    setCurrentPageName,
    setCurrentSubPageName,
} from '@/store/slices/pageSettingsSlice/pageSettingsSlice'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageSettingsColumns } from '../newPageSettingsUtils/usePageSettingsColumns'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import LoadingSpinner from '@/common/LoadingSpinner'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { pageNamesRequiredType, setPageNamesData, setSubPageNamesData } from '@/store/slices/pageSettingsSlice/pageNames.slice'
import AddPageNameModal from '../../pageSettings/AddPageNameModal'
import { usePageSettingsFunctions } from '../newPageSettingsUtils/usePageSettingsFunctions'
import EasyTable from '@/common/EasyTable'

const NewPageSettingsTables = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [showAddPageModal, setShowAddPageModal] = useState(false)

    const { pageSettingsData, page, pageSize, count, currentPageName, currentSubPageName } = useAppSelector<pageSettingsRequiredType>(
        (state) => state.pageSettings,
    )

    const { pageForName, pageNamesData, pageSizeForName, subPageNamesData } = useAppSelector<pageNamesRequiredType>(
        (state) => state.pageNames,
    )

    const {
        data: pageSettings,
        isSuccess,
        isLoading,
    } = pageSettingsService.usePageSettingsDataQuery({
        page,
        pageSize,
        pageId: currentPageName?.value as number,
        sub_page: currentSubPageName?.value as number,
    })

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: pageForName,
        pageSize: pageSizeForName,
    })

    const { data: SubPageNames, isSuccess: isSubPageNamesSuccess } = pageSettingsService.useSubPageNamesQuery({
        pageId: currentPageName?.value as number,
    })

    useEffect(() => {
        if (currentPageName) {
            sessionStorage.setItem('currentPageName', JSON.stringify(currentPageName))
        }
        if (currentSubPageName) {
            sessionStorage.setItem('currentSubPageName', JSON.stringify(currentSubPageName))
        }
    }, [currentPageName, currentSubPageName])

    useEffect(() => {
        const storedPageName = sessionStorage.getItem('currentPageName')
        const storedSubPageName = sessionStorage.getItem('currentSubPageName')

        if (storedPageName) {
            dispatch(setCurrentPageName(JSON.parse(storedPageName)))
        }

        if (storedSubPageName) {
            dispatch(setCurrentSubPageName(JSON.parse(storedSubPageName)))
        }
    }, [dispatch])

    useEffect(() => {
        if (isPageNamesSuccess) {
            dispatch(setPageNamesData(pageNames?.data?.results || []))
        }
    }, [dispatch, pageNames, isPageNamesSuccess])

    useEffect(() => {
        if (isSubPageNamesSuccess) {
            dispatch(setSubPageNamesData(SubPageNames?.data || []))
        }
    }, [dispatch, SubPageNames, isSubPageNamesSuccess])

    useEffect(() => {
        if (isSuccess) {
            dispatch(setPageSettingsData(pageSettings?.data?.results || []))
            dispatch(setCount(pageSettings?.data?.count || 0))
        }
    }, [dispatch, pageSettings, isSuccess, currentPageName, currentSubPageName])

    const { handleSelectPage, handleSelectSubPage, BANNER_PAGE, SUB_PAGE } = usePageSettingsFunctions({
        pageNamesData,
        subPageNamesData,
        pageSettingsData,
        setCurrentPageName,
        setCurrentSubPageName,
        setPageSettingsData,
    })

    const handleGoToBanner = (sectionHeading: string) => {
        navigate('/app/appSettings/banners', { state: { var1: currentPageName?.label, var2: sectionHeading } })
    }

    const columns = usePageSettingsColumns({ handleGoToBanner })
    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className="flex justify-between mb-6">
                <div className="flex gap-3">
                    <div className="buttons flex gap-3 mb-7">
                        <div className="bg-gray-200 px-2 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border bg-gray-200 text-black text-lg font-semibold"
                                title={currentPageName?.label}
                                onSelect={handleSelectPage}
                            >
                                {BANNER_PAGE?.map((item) => (
                                    <DropdownItem key={item.value} eventKey={item?.value?.toString()}>
                                        {item.label}
                                    </DropdownItem>
                                ))}
                                <div
                                    className="flex items-center justify-center mt-2 bg-gray-50 text-green-600 p-2
                             hover:bg-gray-100 hover:text-green-500 cursor-pointer"
                                    onClick={() => setShowAddPageModal(true)}
                                >
                                    ADD NEW
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="buttons flex gap-3 mb-7">
                        <div className="bg-gray-200 px-2 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border bg-gray-200 text-black text-lg font-semibold"
                                title={currentSubPageName?.label}
                                onSelect={handleSelectSubPage}
                            >
                                {SUB_PAGE?.map((item) => (
                                    <DropdownItem key={item.value} eventKey={item?.value?.toString()}>
                                        {item.label}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="new" onClick={() => navigate(`/app/appSettings/newPageSettings/addNew`)}>
                        New Section
                    </Button>
                </div>
            </div>
            <div>
                <EasyTable overflow mainData={pageSettingsData || []} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <div className="flex justify-between mt-10">
                <div>
                    <Pagination
                        pageSize={pageSize}
                        currentPage={page}
                        total={count}
                        className="mb-4 md:mb-0"
                        onChange={(e) => dispatch(setPage(e))}
                    />
                </div>
                <div>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => {
                            if (option) {
                                dispatch(setPage(1))
                                dispatch(setPageSize(option?.value))
                            }
                        }}
                    />
                </div>
            </div>
            {showAddPageModal && <AddPageNameModal setIsOpen={setShowAddPageModal} dialogIsOpen={showAddPageModal} />}
        </div>
    )
}

export default NewPageSettingsTables
