/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem } from '@/components/ui'
import { Input } from 'antd'
import { Field } from 'formik'
import React from 'react'
import { butttonFields } from './stepsCommon'

interface props {
    values: any
    headerImageLink: any
    setHeaderImageLink: any
    headerVideoLink: any
    setHeaderVideoLink: any
    headerVideoCaption: any
    setHeaderVideoCaption: any
    headerVideoId: any
    setHeaderVideoId: any
}

const ThirdStep = ({ values, headerImageLink, setHeaderImageLink, setHeaderVideoCaption, setHeaderVideoId, setHeaderVideoLink }: props) => {
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
                        <FormItem label="Image Link">
                            <Field
                                type="text"
                                name="header_image_link"
                                placeholder="Enter Title"
                                component={Input}
                                value={headerImageLink}
                                onChange={(e) => setHeaderImageLink(e.target.value)}
                            />
                        </FormItem>
                    </>
                )}
                {values?.header === 'VIDEO' && (
                    <>
                        <FormItem>
                            <Field
                                name="header_video_link"
                                placeHolder="Enter video Link"
                                type="text"
                                component={Input}
                                onChange={(e) => setHeaderVideoLink(e.target.value)}
                            />
                            <Field
                                name="header_video_caption"
                                placeHolder="Enter video Caption"
                                type="text"
                                component={Input}
                                onChange={(e) => setHeaderVideoCaption(e.target.value)}
                            />
                            <Field
                                name="header_video_id"
                                placeHolder="Enter video id"
                                type="text"
                                component={Input}
                                onChange={(e) => setHeaderVideoId(e.target.value)}
                            />
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

            {values?.button !== 'URL' && (
                <FormItem label="Buttons">
                    {butttonFields?.map((item, key) => (
                        <FormItem key={key} label={item?.label}>
                            <Field name={item?.name} placeHolder={`Enter Button ${item?.label}`} type={item?.type} component={Input} />
                        </FormItem>
                    ))}
                </FormItem>
            )}
        </div>
    )
}

export default ThirdStep
