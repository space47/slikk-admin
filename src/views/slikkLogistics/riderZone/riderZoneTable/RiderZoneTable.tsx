/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Button, Card, FormContainer, FormItem, Input, Spinner, Switcher } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { riderZoneService } from '@/store/services/riderZoneService'
import { ZONE_STATE, setCount, setPage, setPageSize, setServiceData } from '@/store/slices/riderZoneSlice/riderZoneSlice'
import { notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRiderZoneColumns } from '../riderZoneUtils/useRiderZoneColumns'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import { FiPlus } from 'react-icons/fi'
import { FaMapMarked } from 'react-icons/fa'
import DialogConfirm from '@/common/DialogConfirm'
import { Field, Form, Formik } from 'formik'
import FormButton from '@/components/ui/Button/FormButton'
import { AddZoneArray, Point } from '../riderZoneUtils/riderZoneCommon'
import ZoneMap from '../riderZoneUtils/ZoneMap'
import CommonAccordion from '@/common/CommonAccordion'

const RiderZoneTable = () => {
    const dispatch = useAppDispatch()
    const [polygonPoints, setPolygonPoints] = useState<Point[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const { page, count, pageSize, serviceData } = useAppSelector<ZONE_STATE>((state) => state.riderZone)
    const { debounceFilter } = useDebounceInput({ globalFilter, delay: 500 })
    const [isDelete, setIsDelete] = useState(false)
    const [currentId, setCurrentId] = useState<number | null>(null)
    const [deleteZone, deleteResponse] = riderZoneService.useDeleteZoneMutation()
    const { data, isSuccess, isError, isFetching, isLoading, error, refetch } = riderZoneService.useLiveZonesQuery({
        page,
        pageSize,
        name: debounceFilter,
    })
    const [addZones, setAddZones] = useState(false)
    const [addZone, addResponse] = riderZoneService.useCreateZoneMutation()
    const [seeZoneMap, setSeeZoneMap] = useState(false)

    useEffect(() => {
        if (isSuccess) {
            dispatch(setServiceData(data?.results || []))
            dispatch(setCount(data?.count || 0))
        }
        if (isError) {
            notification.error({
                message: 'Failed to Load Zones',
                description: (error as any)?.data?.message || 'Please try again later',
                placement: 'topRight',
            })
        }
    }, [isSuccess, isError, data, dispatch, error])

    useEffect(() => {
        if (addResponse.isSuccess) {
            notification.success({ message: 'Successfully added new zone' })
            refetch()
            setAddZones(false)
        }
        if (addResponse.isError) {
            notification.error({ message: (addResponse.error as any)?.data?.message || 'Failed to add zone' })
        }
    }, [addResponse.isSuccess, addResponse.isError])

    useEffect(() => {
        if (deleteResponse.isSuccess) {
            notification.success({ message: 'Successfully Deleted Rider Zone' })
            setIsDelete(false)
        }
        if (deleteResponse.isError) {
            notification.error({ message: (deleteResponse?.error as any)?.data?.message || 'Failed to delete row' })
        }
    }, [deleteResponse.isSuccess, deleteResponse.isError])

    const handleDelete = (id: number) => {
        setIsDelete(true)
        setCurrentId(id)
    }

    const handleDeleteRow = () => {
        deleteZone({ id: currentId as number })
    }

    const columns = useRiderZoneColumns({ handleDelete })

    const isTableEmpty = !isLoading && !isFetching && (serviceData?.length === 0 || !serviceData)

    const handleSubmit = (values: any) => {
        const geoCoords = polygonPoints?.map((point) => [point.lng, point.lat]) || []
        addZone({
            name: values?.name,
            code: values?.code,
            is_active: values?.is_active,
            geojson: {
                type: 'Polygon',
                coordinates: [geoCoords],
            },
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex gap-3 items-center">
                        <span>
                            <FaMapMarked className="text-3xl text-purple-600" />
                        </span>
                        Rider Zones
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage delivery zones and their configurations</p>
                </div>
            </div>

            <Card className="border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative flex-1 max-w-md">
                        <Input
                            type="search"
                            value={globalFilter}
                            placeholder="Search by zone name..."
                            className=" w-full rounded-lg"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant={seeZoneMap ? 'reject' : 'accept'}
                            size="sm"
                            type="button"
                            onClick={() => {
                                setSeeZoneMap((prev) => !prev)
                                if (!seeZoneMap) {
                                    setTimeout(() => {
                                        window.scrollTo({
                                            top: document.documentElement.scrollHeight,
                                            behavior: 'smooth',
                                        })
                                    }, 0)
                                }
                            }}
                        >
                            {seeZoneMap ? 'Close' : 'Check Return Zone'}
                        </Button>
                        <Button
                            variant={addZones ? 'reject' : 'blue'}
                            type="button"
                            size="sm"
                            icon={<FiPlus className={`${addZones ? 'rotate-45' : ''} w-4 h-4`} />}
                            onClick={() => setAddZones((prev) => !prev)}
                        >
                            {addZones ? 'close' : 'Add Zone'}
                        </Button>
                    </div>
                </div>
            </Card>

            {addZones && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6">Add Rider Zone Details</h2>

                    <Formik initialValues={{}} onSubmit={handleSubmit}>
                        {() => (
                            <Form className="space-y-6">
                                <FormContainer className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {AddZoneArray?.map((item, key) => {
                                        return (
                                            <FormItem key={key} label={item?.label}>
                                                <Field
                                                    placeholder={'Enter ' + item?.label}
                                                    type={item?.type}
                                                    component={item?.type === 'checkbox' ? Switcher : Input}
                                                    name={item?.name}
                                                />
                                            </FormItem>
                                        )
                                    })}
                                    <FormButton value="Submit" className="w-full md:w-auto" />
                                </FormContainer>

                                <div>
                                    <ZoneMap isAdd zones={serviceData} polygonPoints={polygonPoints} setPolygonPoints={setPolygonPoints} />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
            <Card className="border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold">Zones List</div>
                        {isFetching && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Spinner size={16} />
                                Updating...
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-0">
                    {(isLoading || isFetching) && !serviceData?.length ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <Spinner size={48} className="text-primary" />
                            <p className="text-gray-500">Loading zones...</p>
                        </div>
                    ) : isTableEmpty ? (
                        <div className="py-12">
                            <NotFoundData />
                        </div>
                    ) : (
                        <>
                            <div className="overflow-hidden">
                                <EasyTable overflow mainData={serviceData} columns={columns} page={page} pageSize={pageSize} />
                            </div>

                            {count > pageSize && (
                                <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                                    <PageCommon
                                        dispatch={dispatch}
                                        page={page}
                                        pageSize={pageSize}
                                        setPage={setPage}
                                        setPageSize={setPageSize}
                                        totalData={count}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>
            {!isTableEmpty && !isLoading && (
                <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="text-xs">
                        Page {page} of {Math.ceil(count / pageSize)}
                    </div>
                </div>
            )}

            <div>
                {seeZoneMap && (
                    <>
                        <CommonAccordion header={<h4>Zone Details</h4>}>
                            <ZoneMap polygonPoints={polygonPoints} zones={serviceData} setPolygonPoints={setPolygonPoints} />
                        </CommonAccordion>
                    </>
                )}
            </div>
            {isDelete && (
                <DialogConfirm
                    IsDelete
                    setIsOpen={setIsDelete}
                    IsOpen={isDelete}
                    closeDialog={() => setIsDelete(false)}
                    headingName="Delete Zone"
                    label="Zone"
                    onDialogOk={handleDeleteRow}
                />
            )}
        </div>
    )
}

export default RiderZoneTable
