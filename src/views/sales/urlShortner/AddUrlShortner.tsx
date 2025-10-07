/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { initialValueForUrl } from './urlShortner.common'
import { MAXMINARRAY, OFFARRAY, UtmArray } from '../groupNotification/sendNotification/sendNotify.common'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import UrlShortnerForm from './UrlShortnerForm'

const AddUrlShortner = () => {
    const navigate = useNavigate()
    const base_url = import.meta.env.VITE_WEBSITE_URL
    const [filterId, setFilterId] = useState()
    const [subPageNamesData, setSubPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [selectedPageName, setSelectedPageName] = useState<string | undefined>(undefined)
    const { data: SubPageNames, isSuccess: subSuccess } = pageSettingsService.useSubPageNamesQuery({
        pageName: selectedPageName || '',
    })
    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: 1,
        pageSize: 500,
    })

    useEffect(() => {
        if (isPageNamesSuccess) {
            setPageNamesData(pageNames?.data?.results || [])
        }
    }, [pageNames, isPageNamesSuccess])

    useEffect(() => {
        if (subSuccess) {
            setSubPageNamesData(SubPageNames?.data || [])
        }
    }, [subSuccess, SubPageNames, selectedPageName])

    const handleSubmit = async (values: any) => {
        const extra_attributes_fields = {
            utm_medium: values?.utm_medium,
            filter_id: filterId,
            utm_tags: values?.utm_tags,
            utm_source: values?.utm_source,
            utm_campaign: values?.utm_campaign,
            target_page: values?.target_page,
            max_off: values?.maxoff,
            min_off: values?.minoff,
            min_price: values?.minprice,
            max_price: values?.maxprice,
            subPage: values?.sub_page?.name,
            page: values?.page?.name,
            appOnly: values?.app,
            is_custom: values?.is_custom,
            selectFilter: values?.select_filter,
            discount_tags: values?.discountTags,
            page_title: values?.page_title,
            is_banner: values?.is_banner,
            banner_id: values.banners[0]?.id,
        }
        const filters = [
            ...(values.filters || []),
            ...UtmArray.filter((item) => values[item.name] !== undefined).map(
                (item) => `${item.name.replace('_', '-')}_${values[item.name]}`,
            ),
            ...MAXMINARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
            ...OFFARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
            ...(filterId ? [`filterId_${filterId}`] : values.filter_id ? [`filterId_${values.filter_id}`] : []),
            ...(values?.banners ? [`bannerId_${values.banners[0]?.id}`] : []),
            values?.discountTags && values?.discountTags,
        ].join(',')

        const noSelectFilters = UtmArray.filter((item) => values[item.name] !== undefined)
            .map((item) => `${item.name.replace('_', '-')}=${values[item.name]}`)
            .join('&')

        let utmFilters = noSelectFilters ? `&${noSelectFilters}` : ''
        let filterSelect = values?.select_filter ? `&filters=${filters}` : `&${noSelectFilters}` || ''
        if (values?.is_custom) utmFilters = noSelectFilters ? `?${noSelectFilters}` : ''
        if (values?.is_custom) filterSelect = values?.select_filter ? `?filters=${filters}` : `?${noSelectFilters}` || ''

        const { page_title, ...rest } = values
        let pageTitle = ''
        if (values.page_title && values?.target_page === 'products') pageTitle = `/${values?.page_title}`
        let appOnly = ''
        if (values?.app) appOnly = `&app=${values?.app}`
        let target_page = ''
        if (values?.target_page) target_page = `/${values?.target_page}`
        let subPage = ''
        if (values?.sub_page && values?.target_page === 'home') subPage = `sub_page=${values?.sub_page?.name}`

        const formData = {
            ...rest,
            extra_attributes: extra_attributes_fields,
            short_code: values?.short_code,
            ios_url: !values.select_filter
                ? values.ios_url
                    ? `${values.ios_url}${target_page}${pageTitle}?${subPage}${utmFilters}${appOnly}`
                    : `${`slikk://page`}${target_page}${pageTitle}?${subPage}${utmFilters}${appOnly}`
                : `${`slikk://page`}${target_page}${pageTitle}?${subPage}&filters=${filters}${appOnly}`,
            web_url: !values.select_filter
                ? values.web_url
                    ? `${values.web_url}${target_page}${pageTitle}?${subPage}${utmFilters}${appOnly}`
                    : `${base_url}${target_page}${pageTitle}?${subPage}${utmFilters}${appOnly}`
                : `${base_url}${target_page}${pageTitle}?${subPage}&filters=${filters}${appOnly}`,
            android_url: !values.select_filter
                ? values.android_url
                    ? `${values.android_url}${target_page}${pageTitle}?${subPage}${noSelectFilters}${appOnly}`
                    : `${`slikk://page`}${target_page}${pageTitle}?${subPage}${utmFilters}${appOnly}`
                : `${`slikk://page`}${target_page}${pageTitle}?${subPage}&filters=${filters}${appOnly}`,
        }

        const pageUrl = `${`slikk://page`}/s/${encodeURIComponent(values?.page?.name)}${values?.sub_page?.name ? `/${encodeURIComponent(values?.sub_page?.name)}` : ''}${pageTitle}${filterSelect}${appOnly}`
        const webPageUrl = `${base_url}/s/${encodeURIComponent(values?.page?.name)}${values?.sub_page?.name ? `/${encodeURIComponent(values?.sub_page?.name)}` : ''}${pageTitle}${filterSelect}${appOnly}`
        const customBody = {
            extra_attributes: extra_attributes_fields,
            short_code: values?.short_code,
            ios_url: pageUrl,
            web_url: webPageUrl,
            android_url: pageUrl,
        }
        try {
            const body = values?.is_custom ? customBody : formData
            const response = await axioisInstance.post('/short_url/create', body)
            successMessage(response)
            navigate(-1)
        } catch (error) {
            errorMessage(error as AxiosError)
        }
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">Create Url Shortner</h3>
            <Formik enableReinitialize initialValues={initialValueForUrl} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <UrlShortnerForm
                        pageNamesData={pageNamesData}
                        setFilterId={setFilterId}
                        subPageNamesData={subPageNamesData}
                        values={values}
                        setSelectedPageName={setSelectedPageName}
                        setFieldValues={setFieldValue}
                    />
                )}
            </Formik>
        </div>
    )
}

export default AddUrlShortner
