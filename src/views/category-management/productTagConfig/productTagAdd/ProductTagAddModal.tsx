/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Checkbox, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { ProductTagFromFields } from '../productTagCommon'
import { TagsDataTypes } from '@/store/types/productTags.types'
import { SegmentOptions } from '@/constants/commonArray.constant'

interface props {
    tagData: TagsDataTypes[]
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    setTagData: (x: any) => void
}

const ProductTagAddModal = ({ isOpen, setIsOpen, setTagData }: props) => {
    const onDialogOk = (values: any) => {
        const updatedValues = {
            ...values,
            is_tag: values?.is_tag || false,
            is_filter: values?.is_filter || false,
            is_update_field: values?.is_update_field || false,
        }
        setTagData((prevData: any) => [...prevData, updatedValues])
        setIsOpen(false)
    }

    return (
        <div className="overflow-auto max-h-[90vh]">
            <Dialog isOpen={isOpen} width={800} onClose={() => setIsOpen(false)} onRequestClose={() => setIsOpen(false)}>
                <Formik enableReinitialize initialValues={{}} onSubmit={onDialogOk}>
                    {() => (
                        <Form className="w-full">
                            <FormContainer className="grid grid-cols-2 gap-3">
                                {ProductTagFromFields?.map((item, key) => (
                                    <FormItem key={key} label={item?.label}>
                                        <Field
                                            placeholder={`Enter ${item?.label}`}
                                            type={item?.type}
                                            name={item?.name}
                                            component={item?.type === 'checkbox' ? Checkbox : Input}
                                        />
                                    </FormItem>
                                ))}
                                <FormItem asterisk label="domains" className="col-span-1 w-full">
                                    <Field name="domains">
                                        {({ field, form }: FieldProps) => {
                                            const fieldValueArray = Array.isArray(field?.value) ? field?.value : field?.value?.split(',')
                                            const selectedOptions = fieldValueArray?.map((item: any) => {
                                                const selectedOption = SegmentOptions()?.find((options: any) => {
                                                    return options?.label === item
                                                })
                                                return selectedOption
                                            })
                                            return (
                                                <Select
                                                    isMulti
                                                    isClearable
                                                    className="w-full"
                                                    options={SegmentOptions()}
                                                    getOptionLabel={(option) => option?.label}
                                                    getOptionValue={(option) => option?.value?.toString()}
                                                    value={selectedOptions}
                                                    onChange={(newVals) => {
                                                        const selectedValues = newVals?.map((val: any) => val.value) || []
                                                        form.setFieldValue(`domains`, selectedValues)
                                                    }}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                            <div className="text-right mt-6 col-span-2">
                                <Button className="mr-2" variant="plain" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="solid" type="submit">
                                    Add
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    )
}

export default ProductTagAddModal
