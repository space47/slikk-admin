/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import { FormContainer, FormItem, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'

interface props {
    values: any
}

const BrandFormThirdStep = ({ values }: props) => {
    return (
        <FormContainer>
            <FormItem label="Box Count" className="col-span-1 w-3/4">
                <Field name="box_count" type="number" placeholder="Enter Box Count" />
            </FormItem>
            <FormItem label="Items Count" className="col-span-1 w-3/4">
                <Field name="items_count" type="number" placeholder="Enter Items Count" />
            </FormItem>
            <FormItem label="Upload Shipment Items File"></FormItem>
            <FormItem label="" className="grid grid-rows-2 mt-5 w-full bg-blue-100 p-4 rounded-xl ">
                <Field name="csvArray">
                    {({ form }: FieldProps) => (
                        <>
                            <Upload
                                multiple
                                className="flex justify-center"
                                beforeUpload={beforeUpload}
                                fileList={values.csvArray}
                                onChange={(files) => form.setFieldValue('csvArray', files)}
                                onFileRemove={(files) => form.setFieldValue('csvArray', files)}
                            />
                        </>
                    )}
                </Field>
            </FormItem>
        </FormContainer>
    )
}

export default BrandFormThirdStep
