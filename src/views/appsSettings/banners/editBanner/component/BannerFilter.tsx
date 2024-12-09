import { useState } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import type { MouseEvent } from 'react'
import { Dropdown } from '@/components/ui'
import { BANNER_PAGE_NAME } from '@/common/banner'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'

interface bannerFilterProps {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    currentSelectedPage: any
    handleSelectPage: any
    selectedHeading: any
    handleSectionHeading: any
    sectionHeadingArray: any[] | undefined
}

const BannerFilter = ({
    isOpen,
    setIsOpen,
    currentSelectedPage,
    handleSelectPage,
    selectedHeading,
    handleSectionHeading,
    sectionHeadingArray,
}: bannerFilterProps) => {
    const onDrawerClose = (e: MouseEvent) => {
        console.log('onDrawerClose', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Drawer title="Banner Filters" isOpen={isOpen} onClose={onDrawerClose} onRequestClose={onDrawerClose} lockScroll={false}>
                <div className="flex flex-col gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Page</h3>
                        <div className="bg-gray-100 w-[60%] rounded-lg shadow-md max-w-xs">
                            <Dropdown
                                className="border bg-white text-gray-800 text-base font-medium rounded w-full"
                                title={currentSelectedPage.name}
                                onSelect={handleSelectPage}
                            >
                                {BANNER_PAGE_NAME.map((item) => (
                                    <DropdownItem key={item.value} eventKey={item.value}>
                                        {item.name}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Section Heading</h3>
                        <div className="bg-gray-100 w-[60%] rounded-lg shadow-md max-w-xs">
                            <Dropdown
                                className="border bg-white text-gray-800 text-base font-medium rounded w-full"
                                title={selectedHeading}
                                onSelect={handleSectionHeading}
                            >
                                {sectionHeadingArray?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item}>
                                        {item}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default BannerFilter
