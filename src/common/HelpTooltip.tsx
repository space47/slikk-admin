import { Tooltip } from 'antd'
import React from 'react'
import { IoIosHelpCircleOutline } from 'react-icons/io'

interface props {
    message: string
}

const HelpTooltip = ({ message }: props) => {
    return (
        <div>
            <Tooltip title={message}>
                <IoIosHelpCircleOutline className="text-2xl font-bold text-yellow-500" />
            </Tooltip>
        </div>
    )
}

export default HelpTooltip
