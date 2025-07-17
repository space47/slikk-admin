/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Checkbox, Dialog, FormContainer, FormItem, Input, Select, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import { FormFieldsArray, TabsArray } from './newpageConstants'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import ComponentConfig from '../newPageSettingsComponents/ComponentConfig'
import BackgroundConfig from '../newPageSettingsComponents/BackgroundConfig'
import OtherDataConfigs from '../newPageSettingsComponents/OtherDataConfig'
import DataTypesConfig from '../newPageSettingsComponents/DataTypeConfig'
import { Field, FieldProps } from 'formik'
import { COMPONENT_CATEGORY_TYPES } from '@/common/banner'
import { pageSettingsType } from '@/store/types/pageSettings.types'
import ExtraConfig from '../newPageSettingsComponents/ExtraConfig'
import { FaEye } from 'react-icons/fa'
import { useState } from 'react'

interface props {
    isEdit?: boolean
    values?: any
    setFieldValue?: any
    initialValue?: pageSettingsType
    setInitialValue?: any
    filterId?: string
    setFilterId?: any
    setBarcodeData?: any
    barcodeData?: any
    bannerDetails: any[]
}

const NewPageCommonForms = ({
    isEdit,
    values,
    setFieldValue,
    initialValue,
    setInitialValue,
    filterId,
    setFilterId,
    setBarcodeData,
    barcodeData,
    bannerDetails,
}: props) => {
    const [showPreview, setShowPreview] = useState(false)
    console.log('initial Value in main form', initialValue)
    return (
        <div className="p-2 shadow-xl rounded-xl">
            <FormItem asterisk label="Component Types" className="col-span-1 w-[50%] h-[80%]">
                <Field name="component_type">
                    {({ field, form }: FieldProps<any>) => {
                        return (
                            <Select
                                field={field}
                                form={form}
                                options={COMPONENT_CATEGORY_TYPES}
                                value={COMPONENT_CATEGORY_TYPES.find((option) => option.value === field.value)}
                                onChange={(option) => {
                                    const value = option ? option.value : ''
                                    form.setFieldValue(field.name, value)
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                            />
                        )
                    }}
                </Field>
            </FormItem>

            <FormContainer className="grid grid-cols-2 gap-2">
                <FormItem label="Banners">
                    <Field name="banners">
                        {({ form, field }: FieldProps) => {
                            const selectedStores = bannerDetails?.filter((option) =>
                                field?.value?.some((store: any) => store?.id === option.id),
                            )
                            return (
                                <div className="flex flex-col gap-1  xl:items-baseline w-full max-w-md">
                                    <Select
                                        isMulti
                                        className="w-full"
                                        options={bannerDetails}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        value={selectedStores || null}
                                        onChange={(newVal) => {
                                            form.setFieldValue(field.name, newVal)
                                        }}
                                    />
                                </div>
                            )
                        }}
                    </Field>
                    <div className="mx-4 mt-2">
                        <FaEye className="text-xl cursor-pointer" onClick={() => setShowPreview(true)} />
                    </div>
                </FormItem>
                {FormFieldsArray?.map((item, key) => {
                    return (
                        <FormItem key={key} label={item?.label}>
                            <Field
                                name={item?.name}
                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                type={item?.type}
                                placeholder={`Enter ${item?.label}`}
                            />
                        </FormItem>
                    )
                })}
            </FormContainer>

            <Tabs>
                <TabList className="flex items-center justify-center gap-4 bg-yellow-50 rounded-xl shadow-md p-3 mb-10 sticky z-10 top-16 ">
                    {(!!values?.extra_info?.child_data_type === true
                        ? TabsArray
                        : TabsArray.filter((tab) => tab.value !== 'child_comp_config')
                    ).map((tab, index) => (
                        <TabNav
                            key={index}
                            value={tab.value}
                            className="relative px-4 py-2 text-sm sm:text-base font-semibold text-gray-700 rounded-xl transition-all duration-300 hover:text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            {tab.label}
                        </TabNav>
                    ))}
                </TabList>

                <TabContent value="Component">
                    <ComponentConfig
                        setFieldValue={setFieldValue}
                        values={values}
                        typeName="component_config"
                        typeValues={values?.component_config}
                    />
                </TabContent>

                <TabContent value="bg_config">
                    <BackgroundConfig values={values} initialValue={initialValue} editMode={isEdit} setInitialValue={setInitialValue} />
                </TabContent>
                <TabContent value="other_config">
                    <OtherDataConfigs
                        values={values}
                        initialValue={initialValue}
                        editMode={isEdit ? true : false}
                        setInitialValue={setInitialValue}
                    />
                </TabContent>
                <TabContent value="data_type_config">
                    <DataTypesConfig
                        isEdit={isEdit}
                        values={values}
                        setFilterId={setFilterId}
                        filterId={filterId}
                        setFieldValue={setFieldValue}
                        setBarcodeData={setBarcodeData}
                        barcodeData={barcodeData}
                    />
                </TabContent>
                <TabContent value="child_comp_config">
                    <ComponentConfig
                        setFieldValue={setFieldValue}
                        values={values}
                        typeName="extra_info.child_component_config"
                        typeValues={values?.extra_info?.child_component_config}
                    />
                </TabContent>
                <TabContent value="extra_config">
                    <ExtraConfig />
                </TabContent>
            </Tabs>
            {showPreview && (
                <>
                    <Dialog isOpen={showPreview} onClose={() => setShowPreview(false)}>
                        <div className="p-2 max-h-[80vh] overflow-y-auto space-y-4 mt-7">
                            {values?.banners?.map((item: any, key: any) => (
                                <Card key={key} className="rounded-2xl shadow-md p-4 border border-gray-200 bg-white overflow-hidden">
                                    <div className="text-lg font-semibold text-gray-800 mb-2 break-words">Name: {item?.name}</div>
                                    <div className="flex items-start gap-4">
                                        <span className="text-gray-700 font-medium">Image:</span>
                                        <div className="overflow-auto max-w-[300px] max-h-[150px] scrollbar-hide">
                                            <img
                                                src={item?.image_web}
                                                alt={item?.name || 'banner'}
                                                className="object-contain border rounded-lg shadow-sm w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Dialog>
                </>
            )}
        </div>
    )
}

export default NewPageCommonForms
