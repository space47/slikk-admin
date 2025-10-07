/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, FormContainer, FormItem, Input, Select, Spinner } from '@/components/ui'
import { Field, FieldProps, Form } from 'formik'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { URLARRAY } from './urlShortner.common'
import FilterSelect, { targetPageArray } from './FilterSelect'
import { UtmArray } from '../groupNotification/sendNotification/sendNotify.common'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import BannerFields from '@/common/BannerFields'
import { useFetchApi } from '@/commonHooks/useFetchApi'

interface props {
    values: any
    pageNamesData: pageNameTypes[] | undefined
    setSelectedPageName: Dispatch<SetStateAction<string | undefined>>
    subPageNamesData: pageNameTypes[] | undefined
    setFilterId: Dispatch<SetStateAction<undefined>>
    setFieldValues: any
}

const UrlShortnerForm = ({ values, pageNamesData, setSelectedPageName, subPageNamesData, setFilterId, setFieldValues }: props) => {
    const query = useMemo(() => {
        return `banners?p=1&page_size=1000&page=${values?.page || ''}`
    }, [])

    const { data: bannerDetails, loading: bannerLoading } = useFetchApi<any>({ url: query })

    return (
        <div>
            <Form className="w-full shadow-lg p-4 px-6 rounded-xl">
                <FormContainer>
                    <FormContainer className="grid grid-cols-2 gap-10">
                        {URLARRAY.slice(0, 1).map((item, key) => (
                            <FormItem key={key} label={item.label} className={item.classname}>
                                <Field
                                    type={item.type}
                                    name={item.name}
                                    placeholder={item.placeholder}
                                    component={item?.type === 'checkbox' ? Checkbox : Input}
                                />
                            </FormItem>
                        ))}
                        <FormItem label="Target Page">
                            <Field name="target_page">
                                {({ field, form }: FieldProps<any>) => {
                                    return (
                                        <Select
                                            isClearable
                                            placeholder="Select Target Page"
                                            options={targetPageArray}
                                            defaultValue={field.value}
                                            value={targetPageArray.find((option) => option.value === field.value)}
                                            onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                        />
                                    )
                                }}
                            </Field>
                        </FormItem>

                        {values?.target_page === 'products' && (
                            <FormItem label="Page Title">
                                <Field type="text" name="page_title" placeholder="Enter Page Title" component={Input} />
                            </FormItem>
                        )}
                        <FormItem label="App Only">
                            <Field type="checkbox" name="app" component={Checkbox} />
                        </FormItem>
                        <FormItem label="Is Custom">
                            <Field type="checkbox" name="is_custom" component={Checkbox} />
                        </FormItem>

                        {values?.is_custom === true && (
                            <FormItem label="Page">
                                <Field name="page">
                                    {({ form, field }: FieldProps) => {
                                        const selectedPage =
                                            typeof field?.value === 'object'
                                                ? pageNamesData?.find((option) => option.name === decodeURIComponent(field?.value?.name))
                                                : pageNamesData?.find((option) => option.name === decodeURIComponent(field?.value))
                                        return (
                                            <div className="flex flex-col gap-1 w-full max-w-md">
                                                <Select
                                                    isClearable
                                                    className="w-full"
                                                    options={pageNamesData}
                                                    getOptionLabel={(option) => option.name}
                                                    getOptionValue={(option) => option.id?.toString()}
                                                    value={selectedPage || null}
                                                    onChange={(newVal) => {
                                                        form.setFieldValue('page', newVal)
                                                        const name = typeof newVal === 'object' ? newVal?.name : newVal
                                                        setSelectedPageName(name)
                                                    }}
                                                />
                                            </div>
                                        )
                                    }}
                                </Field>
                            </FormItem>
                        )}
                        {(values?.target_page === 'home' || values?.is_custom === true) && (
                            <FormContainer>
                                <FormItem label="Sub Page">
                                    <Field name="sub_page">
                                        {({ form, field }: FieldProps) => {
                                            const selectedSubPage =
                                                typeof field?.value === 'object'
                                                    ? subPageNamesData?.find(
                                                          (option) => option.name === decodeURIComponent(field?.value?.name),
                                                      )
                                                    : subPageNamesData?.find((option) => option.name === decodeURIComponent(field?.value))
                                            return (
                                                <div className="flex flex-col gap-1 w-full max-w-md">
                                                    <Select
                                                        isClearable
                                                        className="w-full"
                                                        options={subPageNamesData}
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id?.toString()}
                                                        value={selectedSubPage || null}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('sub_page', newVal)
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                        )}
                    </FormContainer>

                    <FormContainer>
                        <h3 className="mb-7">UTM TAGS</h3>
                        <FormContainer className="grid grid-cols-2 gap-6">
                            {UtmArray.map((item, key) => (
                                <FormItem key={key} label={item.label} className={item.classname}>
                                    <Field
                                        type={item.type}
                                        name={item.name}
                                        placeholder={item.placeholder}
                                        component={item?.type === 'checkbox' ? Checkbox : Input}
                                    />
                                </FormItem>
                            ))}
                        </FormContainer>
                    </FormContainer>

                    <FormItem label="Select Filter">
                        <Field type="checkbox" name="select_filter" component={Checkbox} />
                    </FormItem>
                    {values.select_filter && (
                        <>
                            <FormItem label="Select Banner">
                                <Field type="checkbox" name="is_banner" component={Checkbox} />
                            </FormItem>
                            {values?.is_banner &&
                                (bannerLoading ? (
                                    <Spinner size={20} className="flex items-center justify-center" />
                                ) : (
                                    <BannerFields values={values} setFieldValues={setFieldValues} bannerData={bannerDetails} />
                                ))}
                            <FilterSelect filterValue={values?.filter_id} setFilterId={setFilterId} />
                        </>
                    )}

                    <FormContainer className="grid grid-cols-2 gap-10 mt-5">
                        {URLARRAY.slice(1).map((item, key) => (
                            <FormItem key={key} label={item.label} className={item.classname}>
                                <Field type={item.type} name={item.name} placeholder={item.placeholder} className="w-full" />
                            </FormItem>
                        ))}
                    </FormContainer>

                    <FormContainer className="flex justify-end mt-5">
                        <Button variant="accept" type="submit" className="text-white">
                            Submit
                        </Button>
                    </FormContainer>
                </FormContainer>
            </Form>
        </div>
    )
}

export default UrlShortnerForm
