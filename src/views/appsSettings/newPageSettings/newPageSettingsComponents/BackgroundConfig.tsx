/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import { beforeUpload } from '@/common/beforeUpload'
import { beforeVideoUpload } from '@/common/beforUploadVideo'
import PageEditVideo from '../../pageSettings/PageEditVideo'
import PageAddVideo from '../../pageSettings/PageAddVideo'
import CommonSelect from '../../pageSettings/CommonSelect'
import { useBgRemoveFunctions } from '../newPageSettingsUtils/newpageConstants'
import {
    BackgroundExtraArray,
    BackgroundFields,
    GradientDirectionArray,
    MobileAndDesktopPositions,
    webBackgroundFields,
} from '../newPageSettingsUtils/newPageCommons'

interface BGprops {
    editMode?: any
    initialValue: any
    values: any
    setInitialValue: (x: any) => void
}

const BackgroundConfig = ({ editMode = false, initialValue, values, setInitialValue }: BGprops) => {
    const { handleRemoveImage, handleRemoveVideo } = useBgRemoveFunctions(setInitialValue)

    return (
        <FormContainer className="grid grid-cols-2 gap-3 bg-gray-50">
            {editMode ? (
                <PageEditVideo
                    isImage
                    label="background Image"
                    rowName={initialValue.background_config.background_image}
                    removeName="background_image"
                    handleRemoveVideo={() => handleRemoveImage('background_image')}
                    name="background_image_array"
                    beforeVideoUpload={beforeUpload}
                    fileList={values.background_image_array}
                    fieldName="background_image_array"
                />
            ) : (
                <PageAddVideo
                    label="Background Image"
                    name="background_image_array"
                    fieldName="background_image_array"
                    fileList={values.background_image_array}
                    beforeUpload={beforeUpload}
                />
            )}

            {editMode ? (
                <PageEditVideo
                    isImage
                    label="background Mobile Image"
                    rowName={initialValue.background_config.mobile_background_image}
                    removeName="mobile_background_image"
                    handleRemoveVideo={() => handleRemoveImage('mobile_background_image')}
                    name="mobile_background_array"
                    beforeVideoUpload={beforeUpload}
                    fileList={values.mobile_background_array}
                    fieldName="mobile_background_array"
                />
            ) : (
                <PageAddVideo
                    label="Mobile Background Image"
                    name="mobile_background_array"
                    fieldName="mobile_background_array"
                    fileList={values.mobile_background_array}
                    beforeUpload={beforeUpload}
                />
            )}

            {editMode ? (
                <>
                    <PageEditVideo
                        label="background Video"
                        rowName={initialValue.background_config.background_video}
                        removeName="background_video"
                        handleRemoveVideo={() => handleRemoveVideo('background_video')}
                        name="background_video_array"
                        beforeVideoUpload={beforeVideoUpload}
                        fileList={values.background_video_array}
                        fieldName="background_video_array"
                    />
                </>
            ) : (
                <>
                    <PageAddVideo
                        label="Background video"
                        name="background_video_array"
                        fieldName="background_video_array"
                        fileList={values.background_video_array}
                        beforeUpload={beforeVideoUpload}
                    />
                </>
            )}

            {editMode ? (
                <>
                    <PageEditVideo
                        label="Mobile background Video"
                        rowName={initialValue.background_config.mobile_background_video}
                        removeName="mobile_background_video"
                        handleRemoveVideo={() => handleRemoveVideo('mobile_background_video')}
                        name="mobile_background_video_array"
                        beforeVideoUpload={beforeVideoUpload}
                        fileList={values.mobile_background_video_array}
                        fieldName="mobile_background_video_array"
                    />
                </>
            ) : (
                <>
                    <PageAddVideo
                        label="Mobile Background video"
                        name="mobile_background_video_array"
                        fieldName="mobile_background_video_array"
                        fileList={values.mobile_background_video_array}
                        beforeUpload={beforeVideoUpload}
                    />
                </>
            )}
            {/* Lottie */}

            {editMode ? (
                <>
                    <PageEditVideo
                        isLottie
                        label="background lottie"
                        rowName={initialValue.background_config.background_lottie}
                        removeName="background_lottie"
                        handleRemoveVideo={() => handleRemoveVideo('background_lottie')}
                        name="background_lottie_array"
                        beforeVideoUpload={beforeUpload}
                        fileList={values.background_lottie_array}
                        fieldName="background_lottie_array"
                    />
                </>
            ) : (
                <>
                    <PageAddVideo
                        label="Background lottie"
                        name="background_lottie_array"
                        fieldName="background_lottie_array"
                        fileList={values.background_lottie_array}
                        beforeUpload={beforeUpload}
                    />
                </>
            )}

            {editMode ? (
                <>
                    <PageEditVideo
                        isLottie
                        label="Mobile background lottie"
                        rowName={initialValue.background_config.mobile_background_lottie}
                        removeName="mobile_background_lottie"
                        handleRemoveVideo={() => handleRemoveVideo('mobile_background_lottie')}
                        name="mobile_background_lottie_array"
                        beforeVideoUpload={beforeUpload}
                        fileList={values.mobile_background_lottie_array}
                        fieldName="mobile_background_lottie_array"
                    />
                </>
            ) : (
                <>
                    <PageAddVideo
                        label="Mobile Background lottie"
                        name="mobile_background_lottie_array"
                        fieldName="mobile_background_lottie_array"
                        fileList={values.mobile_background_lottie_array}
                        beforeUpload={beforeUpload}
                    />
                </>
            )}

            {BackgroundFields?.map((item, key) => (
                <FormItem key={key} asterisk label={item.label} className="w-full">
                    <Field
                        type={item.type}
                        name={item.name}
                        placeholder={item.placeholder}
                        component={item?.type === 'checkbox' ? Checkbox : Input}
                        min="0"
                        step={0.01}
                    />
                </FormItem>
            ))}
            {webBackgroundFields?.map((item, key) => (
                <FormItem key={key} asterisk label={item.label} className="w-full">
                    <Field
                        type={item.type}
                        name={item.name}
                        placeholder={item.placeholder}
                        component={item?.type === 'checkbox' ? Checkbox : Input}
                        min="0"
                        step={0.01}
                    />
                </FormItem>
            ))}

            <FormItem label="Mobile Width">
                <Field type="number" name="background_config.mobile_width" placeholder="Enter Width" component={Input} />
            </FormItem>
            <FormItem label="Web Mobile Width">
                <Field type="number" name="background_config.web_width" placeholder="Enter Web Width" component={Input} />
            </FormItem>
            <FormItem label="Aspect ratio">
                <Field
                    type="number"
                    name="background_config.background_image_aspect_ratio"
                    placeholder="Enter Aspect ratio"
                    component={Input}
                />
            </FormItem>
            <FormItem label="Mobile Aspect Ratio">
                <Field
                    type="number"
                    name="background_config.mobile_image_aspect_ratio"
                    placeholder="Enter Mobile Aspect ratio"
                    component={Input}
                />
            </FormItem>
            <FormItem label="Scale">
                <Field type="number" name="background_config.scale" placeholder="Enter Scale" component={Input} />
            </FormItem>
            <FormItem label="Web Scale">
                <Field type="number" name="background_config.scale_web" placeholder="Enter web Scale" component={Input} />
            </FormItem>

            {BackgroundExtraArray?.map((item, key) => (
                <FormItem key={key} label={item.label} className="w-full">
                    <Field
                        type={item.type}
                        name={item.name}
                        placeholder={item.placeholder}
                        component={item?.type === 'checkbox' ? Checkbox : Input}
                    />
                </FormItem>
            ))}
            {values?.background_config?.is_background_lottie && (
                <FormContainer className="flex gap-10">
                    <FormItem label="Lottie Loop">
                        <Field type="checkbox" name="background_config.lottie_loop" component={Checkbox} />
                    </FormItem>
                    <FormItem label="Web Lottie Loop">
                        <Field type="checkbox" name="background_config.web_lottie_loop" component={Checkbox} />
                    </FormItem>
                </FormContainer>
            )}
            <FormContainer className="flex gap-10">
                <FormItem label="Elements Inside">
                    <Field type="checkbox" name="extra_info.elements_inside" component={Checkbox} />
                </FormItem>
                <FormItem label="Web Elements Inside">
                    <Field type="checkbox" name="extra_info.web_elements_inside" component={Checkbox} />
                </FormItem>
            </FormContainer>
            <CommonSelect
                needClassName
                name="background_config.desktop_position"
                label="Web Position"
                options={MobileAndDesktopPositions}
                className="w-1/2"
            />

            <CommonSelect
                needClassName
                name="background_config.mobile_position"
                label="Mobile Position"
                options={MobileAndDesktopPositions}
                className="w-1/2"
            />
            <CommonSelect
                needClassName
                name="extra_info.gradient_direction"
                label="Gradient Direction"
                options={GradientDirectionArray}
                className="w-1/2"
            />
            <CommonSelect
                needClassName
                name="extra_info.web_gradient_direction"
                label="Web Gradient Direction"
                options={GradientDirectionArray}
                className="w-1/2"
            />
        </FormContainer>
    )
}

export default BackgroundConfig
