/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { MdCancel } from 'react-icons/md'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, FieldProps } from 'formik'
import Upload from '@/components/ui/Upload'

interface PROPS {
    videoView: any[]
    videoRemove: string
    handleVideoRemove: any
    beforeUpload: any
    name: string
    fileList: any
}

const VideoComponent = ({ videoView, videoRemove, handleVideoRemove, beforeUpload, name, fileList }: PROPS) => {
    return (
        <FormContainer className="bg-gray-200 bg-opacity-40 flex flex-col items-center justify-center rounded-xl mb-4">
            <div className="mt-5">
                <div className="flex gap-2">
                    {videoView && videoView.length > 0 ? (
                        videoView.map((img, index) => (
                            <div key={index} className="flex flex-col">
                                <img src={img} alt={`image-${index}`} className="rounded-sm w-[50px] h-[50px]" />

                                <button onClick={() => handleVideoRemove(index, videoRemove)} className="flex justify-center">
                                    <MdCancel className="text-red-500 bg-none text-lg" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No Video</p>
                    )}

                    <div></div>
                </div>
                <FormItem label="" className="mt-4">
                    <Field name={name}>
                        {({ form }: FieldProps<any>) => (
                            <Upload
                                multiple
                                beforeUpload={beforeUpload}
                                fileList={fileList}
                                onChange={(files) => form.setFieldValue(name, files)}
                                onFileRemove={(files) => form.setFieldValue(name, files)}
                            />
                        )}
                    </Field>
                </FormItem>
            </div>
        </FormContainer>
    )
}

export default VideoComponent
