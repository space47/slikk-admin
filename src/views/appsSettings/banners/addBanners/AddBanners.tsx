import React, { useEffect, useLayoutEffect, useState } from 'react'
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
        fetchPageSettings(setPageNames, setCurrentSelectedPage)
    }, [])

    const BANNER_PAGE_NAME = pageNames?.map((item) => ({
        name: item?.display_name,
        value: item?.name,
    }))

    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string> | null>(null)

    // Fetch Data for section Headings
    const fetchData = async () => {
        if (!currentSelectedPage) return

        try {
            const response = await axioisInstance.get(`/page-sections?page=${currentSelectedPage.value}`)
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
    }, [currentSelectedPage])

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

    console.log('section heading is', sectionHeadingData)

    const handleSectionSelect = (value: string) => {
        const selectHeading = sectionHeadingData.find((item) => item.section_heading)

        const selectHeadingIndex = sectionHeadingData.findIndex((item) => item.section_heading === value)

        setSelectedSectionHeading({ ...selectHeading, position: selectHeadingIndex } || null)
    }

    const handleProceedToAddBanner = () => {
        setCurrentStep(3)
    }

    const [completeBannerFormData, setCompleteBannerFormData] = useState([{ id: Date.now(), is_clickable: true }])

    return (
        <div>
            <div className="w-full my-10 px-[10%] ">
                <Steps current={currentStep} className="flex flex-col lg:flex-row gap-4 items-start">
                    <Steps.Item title={currentSelectedPage?.value || 'Select Page'} />
                    <Steps.Item title={selectedSectionHeading?.section_heading || 'Select Section Heading'} />
                    <Steps.Item title="Add Banners and Corresponding Details" />
                    <Steps.Item title="Preview and Save" />
                </Steps>
            </div>
            {currentStep > 1 && (
                <div onClick={() => setCurrentStep((prev) => prev - 1)} className="mx-10 cursor-pointer">
                    <FaCircleArrowLeft className="text-2xl text-red-600 font-bold " />
                </div>
            )}

            <div className="flex flex-col w-full sticky mt-5 min-h-[70vh] text-[16px] overflow-scroll scrollbar-hide">
                {/* STEP 1 -- Select Page */}
                {currentStep == 1 && (
                    <div className="flex  items-center justify-center ">
                        <div className="text-[20px] border">
                            <Dropdown
                                className="text-xl text-black"
                                title={currentSelectedPage?.name || 'Select Page Name'}
                                onSelect={handlePageSelect}
                            >
                                {BANNER_PAGE_NAME?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span>{item?.name}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                    </div>
                )}

                {/* STEP 2 -- Select Section */}
                {currentStep == 2 && (
                    <div className="flex flex-col items-center justify-center h-full">
                        {sectionHeadingData && sectionHeadingData.length != 0 ? (
                            <div className="text-[16px] border">
                                <Dropdown
                                    className="text-xl text-black"
                                    title={selectedSectionHeading?.section_heading || 'Select Section Heading'}
                                    onSelect={handleSectionSelect}
                                >
                                    {sectionHeadingData?.map((item, key) => {
                                        // console.log('Seaction Heading', item?.section_heading)
                                        return (
                                            <DropdownItem key={key} eventKey={item.section_heading}>
                                                <span>{item.section_heading}</span>
                                            </DropdownItem>
                                        )
                                    })}
                                </Dropdown>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5">
                                No Section Created for this Page. Please create section first
                                <Button variant="new" onClick={() => setCurrentStep(1)}>
                                    Go Back to Select Another Page
                                </Button>
                            </div>
                        )}
                        <div className="mt-5 w-full">
                            {selectedSectionHeading && (
                                <BannerDetails
                                    data={sectionHeadingData.filter(
                                        (item) => item.section_heading === selectedSectionHeading.section_heading,
                                    )}
                                />
                            )}
                        </div>
                        <div className="mt-4">
                            {selectedSectionHeading && (
                                <Button variant="new" size="sm" onClick={handleProceedToAddBanner}>
                                    Proceed to Add Banner
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 3 -- Add Banners and It's details */}
                {currentStep == 3 && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <AddBannerStep3
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
                        headingData={sectionHeadingData}
                    />
                )}
            </div>
        </div>
    )
}

export default AddBanners
