/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { form } from '../addGroup/commonTypesGroup/userProfile'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { notification } from 'antd'
import { useParams } from 'react-router-dom'
import { AxiosError } from 'axios'
import EditGroupForm from './EditGroupForm'
import { useFetchApi } from '@/commonHooks/useFetchApi'

const EditGroup = () => {
    const [userData, setUserData] = useState<any[]>([])
    const [spinner, setSpinner] = useState(false)
    const { groupId } = useParams()

    const urlReq = useMemo(() => {
        return `/notification/groups?group_id=${groupId}`
    }, [groupId])
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    const { data: initialData } = useFetchApi<any>({ url: urlReq })

    const fetchForUserData = async () => {
        try {
            const response = await axioisInstance.get(`/notification/groups/${groupId}`)
            const data = response?.data?.data
            setUserData(data?.group_users)
        } catch (error) {
            console.error(error)
        }
    }

    useLayoutEffect(() => {
        fetchForUserData()
    }, [groupId])

    const initialValues = {
        name: initialData[0]?.name,
        user: initialData[0]?.user?.map((item: any) => item?.mobile).join(',') || '',
        groups: initialData[0]?.group || [],
        cart_start: initialData[0]?.rules?.cart?.find((rule: any) => rule.type === 'cart')?.value.start_date || '',
        cart_end: initialData[0]?.rules?.cart?.find((rule: any) => rule.type === 'cart')?.value.end_date || '',
        registration_start: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'registration')?.value.start_date || '',
        registration_end: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'registration')?.value.end_date || '',
        dob_start: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'dob')?.value.start_date || '',
        dob_end: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'dob')?.value.end_date || '',
        gender: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'gender')?.value || [],
        min_value: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_value')?.value.min_value ?? '',
        max_value: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_value')?.value.max_value ?? '',
        start_date: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_date')?.value.start_date || '',
        end_date: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_date')?.value.end_date || '',
        max_purchase: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'life_time_purchase')?.value.min_amount ?? '',
        min_purchase: initialData[0]?.rules.order?.find((rule: any) => rule.type === 'life_time_purchase')?.value.max_amount ?? '',
        min_count: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_count')?.value.min_order_count ?? '',
        max_count: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_count')?.value.max_order_count ?? '',
        order_delivery_type: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_delivery_type')?.value || [],
        max_basket_size: initialData[0]?.rules?.order_item?.find((item: any) => item.type === 'basket_size')?.value.max ?? '',
        min_basket_size: initialData[0]?.rules?.order_item?.find((item: any) => item.type === 'basket_size')?.value.min ?? '',
        tag_filters: initialData[0]?.rules?.order_item?.find((item: any) => item.type === 'tag_filters')?.value || [],
        city: initialData[0]?.rules?.location?.find((loc: any) => loc.type === 'city')?.value || '',
        state: initialData[0]?.rules?.location?.find((loc: any) => loc.type === 'state')?.value || '',
        distance: initialData[0]?.rules?.location?.find((loc: any) => loc.type === 'distance')?.value || '',
        max_point_available: initialData[0]?.rules?.loyalty?.find((loyalty: any) => loyalty.type === 'points available')?.value.max ?? '',
        min_point_available: initialData[0]?.rules?.loyalty?.find((loyalty: any) => loyalty.type === 'points available')?.value.min ?? '',
        max_point_earned: initialData[0]?.rules?.loyalty?.find((loyalty: any) => loyalty.type === 'points earned')?.value.max ?? '',
        min_point_earned: initialData[0]?.rules?.loyalty?.find((loyalty: any) => loyalty.type === 'points earned')?.value.min ?? '',
        max_point_redeemed: initialData[0]?.rules?.loyalty?.find((loyalty: any) => loyalty.type === 'points redeemed')?.value.max ?? '',
        min_point_redeemed: initialData[0]?.rules?.loyalty?.find((loyalty: any) => loyalty.type === 'points redeemed')?.value.min ?? '',
        loyalty: initialData[0]?.rules?.loyalty?.find((loyalty: any) => loyalty.type === 'tier')?.value ?? [],
    }
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

    const handleSubmit = async (values: any) => {
        try {
            const response = await axioisInstance.patch(`/notification/groups/${groupId}`, form(values, '', []))
            notification.success({ message: response.data.message || 'Successfully added group' })
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to add' })
            }
        } finally {
            setSpinner(false)
        }
    }
    return (
        <div>
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                {() => (
                    <Form className="p-6 w-full shadow-xl rounded-xl bg-white">
                        <EditGroupForm filters={filters} spinner={spinner} />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditGroup
