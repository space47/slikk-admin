/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Card } from 'antd'
import Button from '@/components/ui/Button'

interface CARDPROPS {
    label: string
    getValue: any
    selectedValue: any
    handleSelect: any
    handleAdd: any
    addedValue: any
    handleRemove: any
}

const CardComponent = ({ label, getValue, selectedValue, handleSelect, handleAdd, addedValue, handleRemove }: CARDPROPS) => {
    return (
        <div className="flex justify-around">
            {/* All Permissions */}
            <Card className="overflow-scroll h-[560px] w-[400px] flex flex-col">
                <div className="sticky top-0 z-10 bg-white">
                    {/* <div className="mb-3 bg-white">
                        <input
                            type="text"
                            className="border border-gray-200 w-[90%] h-8 items-center p-2 rounded-md active:border-0 hover:border-blue-500 active:border-blue-500"
                            placeholder="Search Permissions"
                        />
                    </div> */}
                    <label htmlFor="All Permissions" className="font-bold bg-white">
                        ALL {label}
                    </label>
                </div>
                <div className="">
                    {getValue?.map((item: any) => (
                        <div key={item.id} className="flex flex-col">
                            <label className="bg-gray-100 px-2 py-2 flex items-center">
                                <input type="checkbox" checked={selectedValue?.includes(item.id)} onChange={() => handleSelect(item.id)} />
                                <span className="ml-2">{item.name}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Buttons */}
            <div className="flex justify-center items-center flex-col gap-4">
                <Button type="button" variant="accept" className="w-32 px-8" onClick={handleAdd}>
                    ADD {'>>'}
                </Button>
            </div>

            {/* Added Permissions */}
            <Card className="overflow-scroll h-[560px] w-[400px] flex flex-col">
                <div className="sticky top-0 z-10 bg-white">
                    {/* <div className="mb-3 bg-white">
                        <input
                            type="text"
                            className="border border-gray-200 w-[90%] h-8 items-center p-2 rounded-md active:border-0 hover:border-blue-500 active:border-blue-500"
                            placeholder="Search Permissions"
                        />
                    </div> */}
                    <label htmlFor="Added Permissions" className="font-bold bg-white">
                        Added {label}
                    </label>
                </div>
                <div className="">
                    {addedValue?.map((item: any, key: any) => (
                        <div key={key} className="flex flex-col">
                            <div className="bg-gray-100 px-2 py-2 flex items-center justify-between">
                                <span className="text-black">{item.name}</span>
                                <button className="text-red-500 ml-2" onClick={() => handleRemove(item.id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default CardComponent
