import { FormItem } from '@/components/ui'
import { Input } from 'antd'
import { Field } from 'formik'
import React from 'react'
import { butttonFields } from './stepsCommon'

interface props {
    values: any
}

const ThirdStep = ({ values }: props) => {
    console.log('Va;ues of 3rd step', values?.body_text)
    return (
        <div>
            <FormItem label="Header">
                {values?.header === 'TEXT' && (
                    <>
                        <div>{values?.header_text}</div>
                    </>
                )}
                {values?.header === 'IMAGE' && (
                    <>
                        <FormItem>
                            <Field name="header_image_link" placeHolder="Enter header image url" type="text" component={Input} />
                        </FormItem>
                    </>
                )}
                {values?.header === 'VIDEO' && (
                    <>
                        <FormItem>
                            <Field name="header_video_link" placeHolder="Enter video Link" type="text" component={Input} />
                            <Field name="header_video_caption" placeHolder="Enter video Caption" type="text" component={Input} />
                            <Field name="header_video_id" placeHolder="Enter video id" type="text" component={Input} />
                        </FormItem>
                    </>
                )}
            </FormItem>
            <FormItem label="BODY">
                <>
                    <div>{values?.body_text?.map((item) => item)}</div>
                </>

                {/* {values?.body === 'IMAGE' && (
                    <FormItem>
                        <Field name="body_image_link" placeHolder="Enter body image url" type="text" component={Input} />
                        <Field name="body_image_id" placeHolder="Enter body iamge id" type="text" component={Input} />
                    </FormItem>
                )} */}
                {/* {values?.body === 'VIDEO' && (
                    <FormItem>
                        <Field name="body_video_link" placeHolder="Enter video Link" type="text" component={Input} />
                        <Field name="body_video_caption" placeHolder="Enter video Caption" type="text" component={Input} />
                        <Field name="body_video_id" placeHolder="Enter video id" type="text" component={Input} />
                    </FormItem>
                )} */}
            </FormItem>

            <FormItem label="Buttons">
                {butttonFields?.map((item, key) => (
                    <FormItem key={key} label={item?.label}>
                        <Field name={item?.name} placeHolder={`Enter Button ${item?.label}`} type={item?.type} component={Input} />
                    </FormItem>
                ))}
            </FormItem>
        </div>
    )
}

export default ThirdStep
