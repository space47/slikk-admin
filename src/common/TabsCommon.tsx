import { Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import React from 'react'

interface TabsArray {
    label: string
    value: string
}

interface TabsCommonProps {
    activeTab: string
    handleChange: (tab: string) => void
    tabLists?: TabsArray[]
}

const TabsCommon = ({ activeTab, handleChange, tabLists = [] }: TabsCommonProps) => {
    return (
        <div className="border-b border-gray-200">
            <Tabs value={activeTab} onChange={handleChange}>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                    {tabLists.map((item) => (
                        <TabList key={item.value}>
                            <TabNav value={item.value}>
                                <span
                                    className={`
                                        relative px-3 py-2 rounded-lg cursor-pointer 
                                        text-sm md:text-base font-medium transition-colors duration-200
                                        ${
                                            activeTab === item.value
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    {item.label}
                                    {activeTab === item.value && (
                                        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-600 rounded-full"></span>
                                    )}
                                </span>
                            </TabNav>
                        </TabList>
                    ))}
                </div>
            </Tabs>
        </div>
    )
}

export default TabsCommon
