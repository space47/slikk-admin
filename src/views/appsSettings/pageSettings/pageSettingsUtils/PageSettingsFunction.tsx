/* eslint-disable @typescript-eslint/no-explicit-any */

import { DropResult } from 'react-beautiful-dnd'
import { notification } from 'antd'
import { WebType } from '../PageSettingsCommon'
import { Dispatch, SetStateAction } from 'react'

type PageSettingFunctionsProps = {
    setStorePrevIndex: (index: number) => void
    previousConfigs: any[]
    setData: Dispatch<SetStateAction<WebType[]>>
    setIsPreviousConfig: (value: boolean) => void
    setShowPreviousConfigDrawer: (value: boolean) => void
    currentConfig: WebType[]
    data: WebType[]
}

const pageSettingFunctions = ({
    setStorePrevIndex,
    previousConfigs,
    setData,
    setIsPreviousConfig,
    setShowPreviousConfigDrawer,
    currentConfig,
    data,
}: PageSettingFunctionsProps) => {
    const handlePreviousConfigClick = (index: number) => {
        setStorePrevIndex(index + 1)
        const oppIndex = previousConfigs.length - 1 - index
        const selectedConfig = previousConfigs[oppIndex]?.Web || {}
        setData(Object.values(selectedConfig))
        setIsPreviousConfig(true)
        setShowPreviousConfigDrawer(false)
    }

    const handleCurrentConfig = () => {
        setData(currentConfig)
        setIsPreviousConfig(false)
        notification.success({
            message: 'Set to current configurations',
        })
    }

    const reorderData = (startIndex: number, endIndex: number) => {
        const newData = [...data]
        const [movedRow] = newData.splice(startIndex, 1)
        newData.splice(endIndex, 0, movedRow)
        setData(newData)
    }

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result
        if (destination) reorderData(source.index, destination.index)
    }

    const updateRowData = (updatedRow: WebType, particularRow: WebType | undefined) => {
        setData((prev) => prev.map((item) => (item === particularRow ? updatedRow : item)))
    }

    const handleRemoveRow = (row: WebType) => {
        setData((prev) => prev.filter((item) => item !== row))
    }

    return {
        handlePreviousConfigClick,
        handleCurrentConfig,
        handleDragEnd,
        updateRowData,
        handleRemoveRow,
    }
}

export default pageSettingFunctions
