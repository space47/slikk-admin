import React from 'react'
import { Collapse } from 'antd'
import { FaChevronUp } from 'react-icons/fa'

const { Panel } = Collapse

interface AccordionProps extends React.PropsWithChildren {
    header: React.ReactNode
}

const CommonAccordion = ({ header, children }: AccordionProps) => {
    return (
        <Collapse
            bordered={false}
            expandIconPosition="end"
            className="custom-collapse bg-transparent"
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => (
                <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <FaChevronUp className={`transition-transform duration-200 ${isActive ? 'rotate-180' : ''} text-gray-500`} />
                </div>
            )}
        >
            <Panel key="1" header={header} className=" bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 ">
                {children}
            </Panel>
        </Collapse>
    )
}

export default CommonAccordion
