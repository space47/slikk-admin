import { Button, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import React from 'react'

interface Props {
    currentSelectedPage: Record<string, string>
    handleSelect: (value: string) => void
    Options: {
        label: string
        value: string
    }[]
    handleRemove?: () => void
}

const DropDownCommon = ({ Options, currentSelectedPage, handleSelect, handleRemove }: Props) => {
    return (
        <Button variant="gray" color="gray" size="sm" className="items-center flex justify-center m-1">
            <Dropdown
                className="
                    w-full sm:w-auto 
                    font-bold 
                    bg-gray-100 
                    hover:bg-gray-50 
                    dark:bg-gray-800 
                    dark:hover:bg-gray-700 
                    px-4 py-2.5 
                    rounded-lg 
                    border border-gray-300 
                    dark:border-gray-600 
                    transition-all 
                    duration-200 
                    ease-in-out
                    shadow-sm
                    hover:shadow
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-gray-400 
                    focus:ring-opacity-50
                    text-gray-800 
                    dark:text-gray-200
                    cursor-pointer
                    flex items-center justify-between
                    min-w-[180px]
                "
                title={currentSelectedPage?.label || 'Select Type'}
                onSelect={handleSelect}
            >
                {Options?.map((item, key) => (
                    <>
                        <DropdownItem
                            key={key}
                            eventKey={item.value}
                            className="
                            px-4 py-2.5
                            text-sm
                            font-medium
                            hover:bg-gray-100 
                            dark:hover:bg-gray-700
                            transition-colors 
                            duration-150
                            cursor-pointer
                            text-gray-700
                            dark:text-gray-300
                            first:rounded-t-lg
                            last:rounded-b-lg
                            border-b border-gray-100 
                            dark:border-gray-700 
                            last:border-b-0
                            flex items-center
                        "
                        >
                            <span className="truncate">{item?.label}</span>
                            {currentSelectedPage?.value === item.value && (
                                <svg
                                    className="ml-2 h-4 w-4 text-blue-500 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </DropdownItem>
                    </>
                ))}
                <div className="bg-red-500 text-white flex items-center justify-center p-2 rounded-md" onClick={handleRemove}>
                    Clear
                </div>
            </Dropdown>
        </Button>
    )
}

export default DropDownCommon
