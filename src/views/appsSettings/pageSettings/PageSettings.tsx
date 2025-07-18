/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Dropdown, Button } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { notification } from 'antd'
import PageModal from './PageModal'
import { FormikProps } from 'formik'
import PageAddModal from './PageAddModal'
import { useNavigate } from 'react-router-dom'
import { WebType } from './PageSettingsCommon'
import PageDraggavleTable from './PageDraggavleTable'
import PreviousConfiguration from './PreviousConfiguration'
import LoadingSpinner from '@/common/LoadingSpinner'
import AddPageNameModal from './AddPageNameModal'
import { fetchData, fetchPageSettings } from './pageSettingsUtils/PageSettingsApiCalls'
import { PageSettingsColumns } from './pageSettingsUtils/PageSettingsColumns'
import pageSettingFunctions from './pageSettingsUtils/PageSettingsFunction'

const PageSettings = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<WebType[]>([])
    const [yesModal, setYesModal] = useState(false)
    const [particularRow, setParticularRow] = useState<WebType | undefined>()
    const [addModal, setAddModal] = useState(false)
    const formikRef = useRef<FormikProps<any>>(null)
    const [showPreviousConfigDrawer, setShowPreviousConfigDrawer] = useState(false)
    const [storePrevIndex, setStorePrevIndex] = useState<number>()
    const [previousConfigs, setPreviousConfigs] = useState<any[]>([])
    const [currentConfig, setCurentConfigs] = useState<any[]>([])
    const [isPreviousConfig, setIsPreviousConfig] = useState(false)
    const [showSpinner, setShowSpinner] = useState(false)
    const [pageNames, setPageNames] = useState<any[]>([])
    const [showAddPageModal, setShowAddPageModal] = useState(false)

    useLayoutEffect(() => {
        fetchPageSettings(setPageNames, setCurrentSelectedPage)
    }, [])

    console.log('page names', pageNames)

    const BANNER_PAGE = pageNames?.map((item) => ({
        name: item?.display_name,
        value: item?.name,
    }))

    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(BANNER_PAGE[0])

    useEffect(() => {
        if (currentSelectedPage) {
            fetchData(setShowSpinner, setData, setPreviousConfigs, setCurentConfigs, currentSelectedPage)
        }
    }, [currentSelectedPage])

    const { handleCurrentConfig, handleDragEnd, handlePreviousConfigClick, handleRemoveRow, updateRowData } = pageSettingFunctions({
        setStorePrevIndex,
        previousConfigs,
        setData,
        setIsPreviousConfig,
        setShowPreviousConfigDrawer,
        currentConfig,
        data,
    })

    const handlePageUpdate = async () => {
        const webData = data.reduce(
            (acc, item, index) => {
                const { mobile_background_array, ...rest } = item
                console.log(mobile_background_array)
                acc[index + 1] = {
                    ...rest,
                    mobile_background_image: item.mobile_background_image || '',
                }
                return acc
            },
            {} as Record<number, WebType>,
        )

        const body = {
            page_name: currentSelectedPage.value,
            value: { Web: webData },
        }
        try {
            const response = await axioisInstance.post(`/page/config`, body)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Page updated successfully.',
            })
        } catch (error) {
            console.error('Error updating page:', error)
            notification.error({
                message: 'Failure',
                description: 'Page update failed.',
            })
        }
    }

    const handleGoToBanner = (currentPage: any, sectionHeading: any) => {
        navigate('/app/appSettings/banners', {
            state: {
                var1: currentPage,
                var2: sectionHeading,
            },
        })
    }

    const handleCopyPage = (copiedRow: any) => {
        setData((prev) => [...prev, copiedRow])
        notification.success({
            message: 'A Copy of the row has been added',
        })
    }

    const handleSelectPage = (value: string) => {
        const selectedPage = BANNER_PAGE.find((page) => page.value === value)
        if (selectedPage) setCurrentSelectedPage(selectedPage)
    }

    const columns = PageSettingsColumns(
        data,
        setYesModal,
        setParticularRow,
        handleCopyPage,
        handleGoToBanner,
        currentSelectedPage,
        handleRemoveRow,
    )
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (showSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="buttons flex gap-3 mb-7">
                    <div className="bg-gray-200 px-2 rounded-lg font-bold text-[15px]">
                        <Dropdown
                            className="border bg-gray-200 text-black text-lg font-semibold"
                            title={currentSelectedPage?.name}
                            onSelect={handleSelectPage}
                        >
                            {BANNER_PAGE.map((item) => (
                                <DropdownItem key={item.value} eventKey={item.value}>
                                    {item.name}
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
                    <Button variant="new" type="button" size="md" onClick={handlePageUpdate}>
                        UPDATE PAGE SETTINGS
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="reject" type="button" onClick={() => setShowPreviousConfigDrawer(true)}>
                        OLD CONFIGS
                    </Button>
                    {isPreviousConfig && (
                        <Button variant="accept" type="button" onClick={handleCurrentConfig}>
                            CURRENT CONFIGS
                        </Button>
                    )}
                    <Button variant="new" size="md" onClick={() => setAddModal(true)}>
                        ADD PAGE SETTINGS
                    </Button>
                </div>
            </div>

            {yesModal && (
                <PageModal
                    formikRef={formikRef}
                    isModalOpen={yesModal}
                    setIsModalOpen={setYesModal}
                    handleCancel={() => setYesModal(false)}
                    handleOk={() => {
                        if (!formikRef.current?.values.section_heading) {
                            return notification.error({
                                message: 'Section Heading Required',
                            })
                        } else if (!formikRef.current?.values.component_type) {
                            return notification.error({
                                message: 'Component Config is Required',
                            })
                        }
                        formikRef.current?.submitForm()
                        setYesModal(false)
                    }}
                    particularRow={particularRow}
                    setParticularRow={(row) => {
                        setParticularRow(row)
                        updateRowData(row, particularRow)
                    }}
                />
            )}

            {addModal && (
                <PageAddModal
                    formikRef={formikRef}
                    isModalOpen={addModal}
                    setIsModalOpen={setAddModal}
                    handleCancel={() => setAddModal(false)}
                    handleOk={() => {
                        if (!formikRef.current?.values.section_heading) {
                            return notification.error({
                                message: 'Section Heading Required',
                            })
                        } else if (!formikRef.current?.values.component_type) {
                            return notification.error({
                                message: 'Component Config is Required',
                            })
                        }
                        formikRef.current?.submitForm()
                        setAddModal(false)
                    }}
                    data={data}
                    setData={setData}
                />
            )}

            {showPreviousConfigDrawer && (
                <PreviousConfiguration
                    isOpen={showPreviousConfigDrawer}
                    setIsOpen={setShowPreviousConfigDrawer}
                    handlePreviousConfigClick={handlePreviousConfigClick}
                />
            )}

            {isPreviousConfig && <div className="font-bold text-xl text-red-500 mb-6">Previous Configuration : {storePrevIndex ?? +1}</div>}

            <div className="border border-gray-200 p-2 rounded-lg">
                <PageDraggavleTable table={table} handleDragEnd={handleDragEnd} />
            </div>

            {showAddPageModal && <AddPageNameModal setIsOpen={setShowAddPageModal} dialogIsOpen={showAddPageModal} />}
        </div>
    )
}

export default PageSettings
