/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
// import { BANNER_PAGE_NAME } from '@/common/banner'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown, Button } from '@/components/ui'
import Steps from '@/components/ui/Steps'
import BannerDetails from './addComponents/BannerDetails'
import { useNavigate } from 'react-router-dom'
import AddBannerStep3 from '../AddBannerStep3'
import PreviewBanner from '../PreviewBanner'
import { useAppDispatch } from '@/store'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FaCircleArrowLeft } from 'react-icons/fa6'
import { fetchPageSettings } from '../../pageSettings/pageSettingsUtils/PageSettingsApiCalls'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'

interface DataType {
    type: string
    filters: any[]
    barcodes: string
    posts: string
    brands: string
    handles: string
}

interface Config {
    icon: string
    text: string
    image: string
    style: string
    position: string
}

type WebType = {
    data_type: DataType
    footer_config: Config
    header_config: Config
    component_type: string
    section_heading: string
    background_image: string
    sub_header_config: Config
}

const AddBanners = () => {
    const [sectionHeadingData, setSectionHeadingData] = useState<WebType[]>([])
    const [currentStep, setCurrentStep] = useState(1)

    const [selectedSectionHeading, setSelectedSectionHeading] = useState<WebType | null>(null)
    const [pageNames, setPageNames] = useState<any[]>([])

    useLayoutEffect(() => {
        fetchPageSettings(setPageNames, setCurrentSelectedPage as any)
    }, [])

    const BANNER_PAGE_NAME = pageNames?.map((item) => ({
        name: item?.display_name,
        value: item?.name,
    }))

    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string> | null>(null)
    const [currentSelectedSubPage, setCurrentSelectedSubPage] = useState<Record<string, string> | null>(null)

    const query = useMemo(() => {
        return `/subpage?dashboard=true&page=${currentSelectedPage?.name}`
    }, [currentSelectedPage])

    const { data: subPage } = useFetchSingleData<any>({ url: query })

    console.log('subPage Data is', subPage)

    const SUB_PAGE_NAME = subPage?.map((item) => ({
        name: item?.name,
        value: item?.id,
    }))

    const fetchData = async () => {
        if (!currentSelectedPage) return

        try {
            const response = await axioisInstance.get(
                `/page-sections?is_active=true&p=1&page_size=500&page=${currentSelectedPage.value}&sub_page=${encodeURIComponent(currentSelectedSubPage?.name || '')}`,
            )
            const responsedata = response.data.data.results
            setSectionHeadingData(responsedata?.map((item) => item?.section))
            console.log('API call successful')
        } catch (error) {
            console.error('API call error:', error)
            setSectionHeadingData([])
        }
    }
    useEffect(() => {
        fetchData()
    }, [currentSelectedPage, currentSelectedSubPage])

    console.log('currentntnttnt', currentSelectedSubPage?.name)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
        dispatch(getAllFiltersAPI())
    }, [])

    const handlePageSelect = (values: string, e: any) => {
        setCurrentSelectedPage({
            value: values,
            name: BANNER_PAGE_NAME.find((item) => item.value === values)?.name || '',
        })
        setSelectedSectionHeading(null)

        setCurrentStep(2)
    }
    const handleSubPageSelect = (values: string, e: any) => {
        setCurrentSelectedSubPage({
            value: values,
            name: SUB_PAGE_NAME.find((item) => item.value === values)?.name || '',
        })
        setSelectedSectionHeading(null)
    }

    console.log('section heading is', currentSelectedSubPage)

    const handleSectionSelect = (value: string) => {
        const selectHeading = sectionHeadingData.find((item) => item.section_heading === value)

        const selectHeadingIndex = sectionHeadingData.findIndex((item) => item.section_heading === value)

        setSelectedSectionHeading({ ...selectHeading, position: selectHeadingIndex } || null)
    }

    const handleProceedToAddBanner = () => {
        setCurrentStep(3)
    }

    const [completeBannerFormData, setCompleteBannerFormData] = useState([{ id: Date.now(), is_clickable: true }])

    console.log('section heading data', sectionHeadingData)

    console.log('data below', selectedSectionHeading)

    return (
        <div>
            <div className="w-full my-10 flex items-center px-6">
                {currentStep > 1 && (
                    <div onClick={() => setCurrentStep((prev) => prev - 1)} className="mr-2 cursor-pointer">
                        <FaCircleArrowLeft className="text-2xl text-red-600 font-bold " />
                    </div>
                )}
                <Steps current={currentStep} className="flex flex-col lg:flex-row gap-4 items-start w-[90%] px-2">
                    <Steps.Item title={currentSelectedPage?.value || 'Select Page'} />
                    <Steps.Item title={selectedSectionHeading?.section_heading || 'Select Section Heading'} />
                    <Steps.Item title="Add Banners and Corresponding Details" />
                    <Steps.Item title="Preview and Save" />
                </Steps>
            </div>

            <div className="flex flex-col w-full sticky mt-5 min-h-[70vh] text-[16px] overflow-scroll scrollbar-hide">
                {/* STEP 1 -- Select Page */}
                {currentStep == 1 && (
                    <div className="flex  items-center justify-center ">
                        <div className="text-[20px] border">
                            <Dropdown className="text-xl text-black" title={'Select Page Name'} onSelect={handlePageSelect}>
                                {BANNER_PAGE_NAME?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span>{item?.name}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                    </div>
                )}

                {currentStep == 2 && (
                    <div className="space-y-6 p-6 max-w-4xl mx-auto">
                        <h4 className="flex items-center justify-center">Select SubPage and Section Headings</h4>
                        <div className="text-center">
                            <div className="flex justify-center">
                                <div className="w-64">
                                    <Dropdown
                                        className="w-full flex items-center justify-center text-lg text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                        title={currentSelectedSubPage?.name || 'Select Sub Page Name'}
                                        onSelect={handleSubPageSelect}
                                    >
                                        {SUB_PAGE_NAME?.map((item, key) => (
                                            <DropdownItem key={key} eventKey={item.value} className="hover:bg-blue-50 px-4 py-2">
                                                <span className="text-gray-700">{item?.name}</span>
                                            </DropdownItem>
                                        ))}
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            {sectionHeadingData && sectionHeadingData.length !== 0 ? (
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-64">
                                        <Dropdown
                                            className="w-full text-lg flex items-center justify-center text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            title={selectedSectionHeading?.section_heading || 'Select Section Heading'}
                                            onSelect={handleSectionSelect}
                                        >
                                            {sectionHeadingData?.map((item, key) => (
                                                <DropdownItem
                                                    key={key}
                                                    eventKey={item.section_heading}
                                                    className="hover:bg-blue-50 px-4 py-2"
                                                >
                                                    <span className="text-gray-700">{item.section_heading}</span>
                                                </DropdownItem>
                                            ))}
                                        </Dropdown>
                                    </div>

                                    {selectedSectionHeading && (
                                        <div className="flex flex-col gap-4 sm:gap-6">
                                            {/* Banner details container */}
                                            <div className="w-full p-3 sm:p-4 bg-white rounded-lg shadow-md border border-gray-100">
                                                <BannerDetails
                                                    data={sectionHeadingData.filter(
                                                        (item) => item.section_heading === selectedSectionHeading.section_heading,
                                                    )}
                                                />
                                            </div>

                                            {/* Proceed button */}
                                            <div className="flex justify-center ">
                                                <Button variant="new" size="sm" onClick={handleProceedToAddBanner}>
                                                    Proceed to Add Banner
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow border border-gray-200 space-y-4 text-center">
                                    <p className="text-gray-600 text-lg">No Section Created for this Page. Please create section first</p>
                                    <Button
                                        variant="new"
                                        onClick={() => setCurrentStep(1)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg shadow hover:shadow-md transition-all"
                                    >
                                        Go Back to Select Another Page
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 3 -- Add Banners and It's details */}
                {currentStep == 3 && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <AddBannerStep3
                            subPageId={currentSelectedSubPage?.value}
                            selectedPage={currentSelectedPage}
                            selectedSection={selectedSectionHeading}
                            setCurrentStep={setCurrentStep}
                            completeBannerFormData={completeBannerFormData}
                            setCompleteBannerFormData={setCompleteBannerFormData}
                        />
                    </div>
                )}

                {/* STEP 4 -- Preview Banners */}
                {currentStep == 4 && (
                    <PreviewBanner
                        setCurrentStep={setCurrentStep}
                        completeBannerFormData={completeBannerFormData}
                        selectedPage={currentSelectedPage}
                        selectedSection={selectedSectionHeading}
                        subpage={currentSelectedSubPage}
                        headingData={sectionHeadingData}
                    />
                )}
            </div>
        </div>
    )
}

export default AddBanners
