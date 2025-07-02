import { useAppDispatch } from '@/store'
import { pageNameTypes, pageSettingsType } from '@/store/types/pageSettings.types'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { DropResult } from 'react-beautiful-dnd'

interface props {
    pageSettingsData: pageSettingsType[] | undefined
    setPageSettingsData: ActionCreatorWithPayload<pageSettingsType[], 'pageSettings/setPageSettingsData'>
    pageNamesData: pageNameTypes[] | undefined
    subPageNamesData: pageNameTypes[] | undefined
    setCurrentPageName: ActionCreatorWithPayload<
        {
            label: string
            value: number | null
        },
        'pageSettings/setCurrentPageName'
    >
    setCurrentSubPageName: ActionCreatorWithPayload<
        {
            label: string
            value: number | null
        },
        'pageSettings/setCurrentSubPageName'
    >
}

export const usePageSettingsFunctions = ({
    pageSettingsData,
    setPageSettingsData,
    pageNamesData,
    subPageNamesData,
    setCurrentPageName,
    setCurrentSubPageName,
}: props) => {
    const dispatch = useAppDispatch()
    const BANNER_PAGE = pageNamesData?.map((item) => ({ label: item?.name, value: item?.id }))
    const SUB_PAGE = subPageNamesData?.map((item) => ({ label: item?.name, value: item?.id }))

    const handleSelectPage = (eventKey: string | null) => {
        if (!eventKey) return
        const selected = BANNER_PAGE?.find((item) => item.value?.toString() === eventKey)
        if (selected) {
            dispatch(setCurrentPageName({ label: selected.label || '', value: selected.value || null }))
            dispatch(setCurrentSubPageName({ label: '', value: null }))
        }
    }
    const handleSelectSubPage = (eventKey: string | null) => {
        if (!eventKey) return
        const selected = SUB_PAGE?.find((item) => item.value?.toString() === eventKey)
        if (selected) {
            dispatch(setCurrentSubPageName({ label: selected.label || '', value: selected.value || null }))
        }
    }

    const reorderData = (startIndex: number, endIndex: number) => {
        const newData = [...(pageSettingsData || [])]
        const [movedRow] = newData.splice(startIndex, 1)
        newData.splice(endIndex, 0, movedRow)
        dispatch(setPageSettingsData(newData))
    }

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result
        if (destination) reorderData(source.index, destination.index)
    }
    return { BANNER_PAGE, SUB_PAGE, handleSelectPage, handleSelectSubPage, handleDragEnd }
}
