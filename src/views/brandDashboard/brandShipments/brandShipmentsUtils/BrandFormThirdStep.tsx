/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import { FormContainer, FormItem, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import { FaDownload } from 'react-icons/fa'

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

            <div className="flex  justify-between">
                <span className="text-xl font-bold">Upload Shipment Items File</span>
                <a
                    className="p-2 rounded-xl bg-green-500 hover:bg-green-600 text-white no-underline flex gap-2 font-bold"
                    href="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/shipment+items/sample_shipment_items.csv"
                >
                    <FaDownload className="text-xl text-white" /> Sample File
                </a>
            </div>
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
