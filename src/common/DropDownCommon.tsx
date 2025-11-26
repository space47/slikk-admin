import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import React from 'react'

interface Props {
    currentSelectedPage: Record<string, string>
    handleSelect: (value: string) => void
    Options: {
        label: string
        value: string
    }[]
}

const DropDownCommon = ({ Options, currentSelectedPage, handleSelect }: Props) => {
    return (
        <div className="bg-gray-200 flex items-center justify-center  font-bold rounded-xl">
            <Dropdown
                className="w-full sm:w-auto font-bold bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg"
                title={currentSelectedPage?.label?.toUpperCase() || 'Select Type'}
                onSelect={handleSelect}
            >
                {Options?.map((item, key) => (
                    <DropdownItem key={key} eventKey={item.value}>
                        {item?.label}
                    </DropdownItem>
                ))}
            </Dropdown>
        </div>
    )
}

export default DropDownCommon
