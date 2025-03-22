/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import React from 'react'

interface commonDropdownProps {
    isNoClear?: boolean
    label?: string
    currentSelectedPage: Record<string, string>
    setCurrentSelectedPage?: React.Dispatch<React.SetStateAction<Record<string, string> | undefined>>
    SEARCHOPTIONS: Record<string, string>[]
    handleSelect: (value: any, setCurrentSelectedPage: any) => void
}

const CommonDropdown = ({
    currentSelectedPage,
    setCurrentSelectedPage,
    SEARCHOPTIONS,
    handleSelect,
    label,
    isNoClear = false,
}: commonDropdownProps) => {
    return (
        <div className="flex justify-center xl:justify-normal">
            <div className="bg-gray-100 flex justify-center font-bold items-center xl:mt-1  xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                <Dropdown
                    className=" text-xl text-black bg-gray-200 font-bold  "
                    title={currentSelectedPage?.value ? currentSelectedPage.label : `Select ${label}`}
                    onSelect={handleSelect}
                >
                    {SEARCHOPTIONS?.map((item, key) => {
                        return (
                            <DropdownItem key={key} eventKey={item.value}>
                                <span>{item.label}</span>
                            </DropdownItem>
                        )
                    })}
                    {!isNoClear && setCurrentSelectedPage && (
                        <div
                            className="flex items-center justify-center bg-red-500 p-1 cursor-pointer text-white rounded-xl"
                            onClick={() => setCurrentSelectedPage({})}
                        >
                            Clear
                        </div>
                    )}
                </Dropdown>
            </div>
        </div>
    )
}

export default CommonDropdown
