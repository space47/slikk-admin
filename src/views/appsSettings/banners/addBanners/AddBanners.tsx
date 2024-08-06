import React, { useEffect, useState } from 'react'
import { BANNER_PAGE_NAME } from '@/common/banner'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Dropdown, Button } from '@/components/ui'
import Steps from '@/components/ui/Steps'
import BannerDetails from './addComponents/BannerDetails'
import { useNavigate } from 'react-router-dom'

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
    const [bannersData, setBannersData] = useState<WebType[]>([])
    const [currentStep, setCurrentStep] = useState(1)
    const [showSectionDropdown, setShowSectionDropdown] = useState(false)
    const [currentSelectedPage, setCurrentSelectedPage] = useState<
        Record<string, string>
    >(BANNER_PAGE_NAME[0])
    const [selectedSectionHeading, setSelectedSectionHeading] =
        useState<WebType | null>(null)
    const [selectedHeadingValue, setSelectedHeadingValue] = useState('')
    const navigate = useNavigate()

    const fetchData = async () => {
        console.log('Starting API call')
        try {
            const response = await axioisInstance.get(
                `/page/config?page_name=${currentSelectedPage.value}`,
            )
            const responsedata = response.data.data.value.Web
            setBannersData(Object.values(responsedata))
            console.log('API call successful')
        } catch (error) {
            console.error('API call error:', error)
            setBannersData([])
        }
    }

    useEffect(() => {
        fetchData()
    }, [currentSelectedPage])

    const handleSelect = (values: string, e: any) => {
        console.log('Page selected:', values)
        setCurrentSelectedPage({
            value: values,
            name:
                BANNER_PAGE_NAME.find((item) => item.value === values)?.name ||
                '',
        })

        setCurrentStep(2)
        setShowSectionDropdown(true)
    }

    const handleSectionSelect = (value: string) => {
        console.log('Section selected:', value)
        const selectHeading = bannersData.find(
            (item) =>
                item.section_heading === value &&
                item.data_type.type === 'banner',
        )
        setCurrentStep(3)
        setSelectedHeadingValue(value)
        setSelectedSectionHeading(selectHeading || null)
    }

    const handleAddNew = () => {
        navigate('/app/appSettings/banners/newBanner')
    }

    return (
        <div>
            <div className="w-1/2 mb-10">
                <Steps current={currentStep}>
                    <Steps.Item title="Select Page" />
                    <Steps.Item title="Select Section" />
                    <Steps.Item title="Something 1" />
                    <Steps.Item title="Something 2" />
                </Steps>
            </div>

            <div className="flex">
                <Dropdown
                    className="text-xl text-black"
                    title={currentSelectedPage.name}
                    onSelect={handleSelect}
                >
                    {BANNER_PAGE_NAME?.map((item, key) => (
                        <DropdownItem key={key} eventKey={item.value}>
                            <span>{item.name}</span>
                        </DropdownItem>
                    ))}
                </Dropdown>

                {showSectionDropdown && (
                    <Dropdown
                        className="text-xl text-black"
                        title="SELECT SECTION HEADING"
                        onSelect={handleSectionSelect}
                    >
                        {bannersData
                            ?.filter((item) => item.data_type.type === 'banner')
                            .map((item, key) => (
                                <DropdownItem
                                    key={key}
                                    eventKey={item.section_heading}
                                >
                                    <span>{item.section_heading}</span>
                                </DropdownItem>
                            ))}
                    </Dropdown>
                )}
            </div>
            <div className="mt-10">
                {selectedSectionHeading && (
                    <BannerDetails
                        data={bannersData.filter(
                            (item) =>
                                item.section_heading === selectedHeadingValue &&
                                item.data_type.type === 'banner',
                        )}
                    />
                )}
            </div>

            <div className="mt-4">
                {selectedSectionHeading && (
                    <Button variant="new" size="sm" onClick={handleAddNew}>
                        Add new Banner
                    </Button>
                )}
            </div>
        </div>
    )
}

export default AddBanners
