/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Checkbox, FormItem, Input, Select } from '@/components/ui'
import { ProductTagFromFields } from '../productTagCommon'
import { TagsDataTypes } from '@/store/types/productTags.types'
import { SegmentOptions } from '@/constants/commonArray.constant'
import { notification } from 'antd'

interface props {
    tagData: TagsDataTypes[]
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    setTagData: (x: any) => void
}

const ProductTagAddModal = ({ isOpen, setIsOpen, setTagData }: props) => {
    const initialValues = {
        tag_name: '',
        file_header_name: '',
        product_field_name: '',
        filter_name: '',
        display_name: '',
        filter_position: '',
        is_tag: false,
        is_filter: false,
        domains: [],
    }

    const onDialogOk = (values: any) => {
        const updated = {
            ...values,
            is_tag: Boolean(values.is_tag),
            is_filter: Boolean(values.is_filter),
        }
        setTagData((prev: any) => [...prev, updated])
        setIsOpen(false)
        notification.info({ message: 'The Tag has been set....you have to update tags to add it', placement: 'bottomRight' })
    }

    return (
        <div className="overflow-auto max-h-[90vh]">
            <Dialog isOpen={isOpen} width={1200} onClose={() => setIsOpen(false)}>
                <Formik enableReinitialize initialValues={initialValues} onSubmit={onDialogOk}>
                    {({ values }) => {
                        const showFilterFields = values.is_filter

                        return (
                            <Form className="w-full p-3">
                                <div className="space-y-6">
                                    {/* -------- Basic Info Section -------- */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-gray-700">Basic Details</h3>

                                        <div className="grid grid-cols-2 gap-3">
                                            {ProductTagFromFields.filter((f) => f.section === 'basic').map((item, idx) => (
                                                <FormItem key={idx} label={item.label}>
                                                    <Field
                                                        type={item.type}
                                                        placeholder={`Enter ${item.label}`}
                                                        name={item.name}
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            ))}

                                            {/* Domains Select */}
                                            <FormItem label="Domains">
                                                <Field name="domains">
                                                    {({ field, form }: FieldProps) => {
                                                        const selected = Array.isArray(field.value)
                                                            ? field.value.map((v) => SegmentOptions().find((o) => o.value === v))
                                                            : []

                                                        return (
                                                            <Select
                                                                isMulti
                                                                options={SegmentOptions()}
                                                                getOptionLabel={(o) => o?.label as string}
                                                                getOptionValue={(o) => String(o?.value)}
                                                                value={selected}
                                                                onChange={(vals) =>
                                                                    form.setFieldValue('domains', vals?.map((v) => v?.value) || [])
                                                                }
                                                            />
                                                        )
                                                    }}
                                                </Field>
                                            </FormItem>
                                        </div>
                                    </div>

                                    {/* -------- Filter Section (Conditional) -------- */}
                                    {showFilterFields && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 text-blue-600">Filter Settings</h3>

                                            <div className="grid grid-cols-2 gap-3">
                                                {ProductTagFromFields.filter((f) => f.section === 'filter').map((item, idx) => (
                                                    <FormItem key={idx} label={item.label}>
                                                        <Field
                                                            type={item.type}
                                                            name={item.name}
                                                            placeholder={`Enter ${item.label}`}
                                                            component={Input}
                                                        />
                                                    </FormItem>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* -------- Flags Section -------- */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-gray-700">Flags</h3>

                                        <div className="grid grid-cols-3 gap-3">
                                            {ProductTagFromFields.filter((f) => f.section === 'flags').map((item, idx) => (
                                                <FormItem key={idx} label={item.label}>
                                                    <Field type="checkbox" name={item.name} component={Checkbox} />
                                                </FormItem>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="text-right mt-6">
                                    <Button className="mr-2" variant="plain" onClick={() => setIsOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="solid" type="submit">
                                        Add
                                    </Button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </Dialog>
        </div>
    )
}

export default ProductTagAddModal
