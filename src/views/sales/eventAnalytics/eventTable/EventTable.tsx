import { useFetchApi } from '@/commonHooks/useFetchApi'
import React, { useEffect, useMemo, useState } from 'react'
import { EventTypes } from '../eventTypes'
import EasyTable from '@/common/EasyTable'
import { useEventsColumns } from '../eventUtils/useEventsColumns'
import PageCommon from '@/common/PageCommon'
import { useAppDispatch, useAppSelector } from '@/store'
import { EventNamesSliceType, setEventNamesData } from '@/store/slices/eventNameSlice/eventName.slice'
import { eventNameService } from '@/store/services/eventNameSerices'

const EventTable = () => {
    const dispatch = useAppDispatch()
    const { eventNamesData } = useAppSelector<EventNamesSliceType>((state) => state.eventNames)
    const { data: eventNameList, isSuccess } = eventNameService.useEventNamesDataQuery({})

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEventNamesData(eventNameList?.results || []))
        }
    }, [dispatch, isSuccess, eventNameList])

    const columns = useEventsColumns()

    return (
        <div>
            <EasyTable mainData={eventNamesData} columns={columns} />
            {/* <div>
                <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
            </div> */}
        </div>
    )
}

export default EventTable
