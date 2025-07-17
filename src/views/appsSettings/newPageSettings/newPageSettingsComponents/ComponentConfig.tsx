/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import HelpTooltip from '@/common/HelpTooltip'
import {
    childBorderData,
    childBorderWebData,
    childConfigFieldsArray,
    childConfigWebFieldsArray,
    childNameFieldArray,
    childSectionBorderArray,
    childWebNameFieldArray,
    childWebSectionBorderArray,
    componentBorderData,
    componentBorderWebData,
    componentConfigFieldsArray,
    componentConfigWebFieldsArray,
    componentNameFieldArray,
    componentParallaxFieldsArray,
    componentSectionBorderArray,
    componentWebNameFieldArray,
    componentWebSectionBorderArray,
} from '../newPageSettingsUtils/componentPageUtils'
import { Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import CommonSelect from '../../pageSettings/CommonSelect'
import {
    ALIGNVALUES,
    BorderStyleArray,
    CarouselTypeArray,
    FontSizeArray,
    NAMEPOSITION,
    SECTIONARRAY,
} from '../newPageSettingsUtils/newpageConstants'
import { borrderStyleArray } from '../../pageSettings/genericComp'

interface PageCompProps {
    setFieldValue: any
    values: any
    typeName?: string
    typeValues?: any
}

const ComponentConfig = ({ setFieldValue, typeName, typeValues }: PageCompProps) => {
    const mainFieldsArray = typeName === 'component_config' ? componentConfigFieldsArray : childConfigFieldsArray
    const mainFieldsWebArray = typeName === 'component_config' ? componentConfigWebFieldsArray : childConfigWebFieldsArray

    const mainBorderArray = typeName === 'component_config' ? componentBorderData : childBorderData
    const mainBorderWebArray = typeName === 'component_config' ? componentBorderWebData : childBorderWebData

    const mainSectionBorderArray = typeName === 'component_config' ? componentSectionBorderArray : childSectionBorderArray
    const mainSectionBorderWebArray = typeName === 'component_config' ? componentWebSectionBorderArray : childWebSectionBorderArray

    const mainNameArray = typeName === 'component_config' ? componentNameFieldArray : childNameFieldArray
    const mainNameWebArray = typeName === 'component_config' ? componentWebNameFieldArray : childWebNameFieldArray

    return (
        <div className="bg-gray-50">
            <div className=" grid grid-cols-2 gap-3 ">
                <div className="font-bold mt-1 bg-gray-300 px rounded-lg w-1/4 h-1/2 flex items-center justify-center ">
                    <span className="bg-gray-300  rounded-lg ">Mobile Configurations :</span>
                </div>

                {mainFieldsArray.slice(0, 28).map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-full">
                        <Field
                            type={item.type}
                            name={item.name as string}
                            component={item?.type === 'checkbox' ? Checkbox : Input}
                            min="0"
                            step={0.01}
                        />
                    </FormItem>
                ))}

                {/* Carousel */}
                <CommonSelect
                    needClassName
                    name={`${typeName}.carousel_type` as string}
                    label="Carousel Type"
                    options={CarouselTypeArray}
                    className="col-span-1 w-1/2"
                />
                {typeValues === 'STACK' && (
                    <CommonSelect
                        needClassName
                        name={`${typeName}.carousel_swipe_direction` as string}
                        label="Swipe Direction"
                        options={[
                            { label: 'left', value: 'left' },
                            { label: 'right', value: 'right' },
                        ]}
                        className="col-span-1 w-1/2"
                    />
                )}
                {typeValues?.carousel_type === 'PARALLAX' && (
                    <>
                        {componentParallaxFieldsArray.map((item, key) => (
                            <FormItem key={key} className="w-">
                                <div className="flex gap-2 text-md ">
                                    <span>{item.label}</span>{' '}
                                    <span>
                                        <HelpTooltip message={item.message} />
                                    </span>
                                </div>
                                <Field
                                    type={item.type}
                                    name={item.name}
                                    placeholder={`Enter ${item.label} with ${item.message}`}
                                    min="0"
                                    step={0.01}
                                />
                            </FormItem>
                        ))}
                    </>
                )}

                <CommonSelect
                    name={`${typeName}.font_style` as string}
                    label="Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name={`${typeName}.footer_font_style`}
                    label="Footer Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name={`${typeName}.section_alignment`}
                    label="Section Alignment"
                    options={SECTIONARRAY}
                    needClassName
                    className=" col-span-1 w-1/2"
                />
                <CommonSelect
                    name={`${typeName}.content_alignment`}
                    label="Content Alignment"
                    options={SECTIONARRAY}
                    needClassName
                    className=" col-span-1 w-1/2"
                />
                {/* ssssssssssssssssssssssssssssssssssssssssssssssss */}
                <div>
                    <FormContainer className="grid grid-cols-2 gap-3">
                        <FormItem label="Border" className="col-span-1 w-1/2">
                            <Field
                                type="checkbox"
                                name={`${typeName}.border`}
                                placeholder="Enter border"
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue(`${typeName}.border`, isChecked)
                                }}
                            />
                            {typeValues?.border === true && (
                                <FormContainer>
                                    <CommonSelect name={`${typeName}.border_style`} label="Border Style" options={BorderStyleArray} />
                                    {mainBorderArray?.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                                min="0"
                                                step={0.01}
                                            />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                            )}
                        </FormItem>
                        {/* Section Border */}
                        <FormItem label="Section Border" className="col-span-1 w-1/2">
                            <Field
                                type="checkbox"
                                name={`${typeName}.section_border`}
                                placeholder="Enter section border"
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('${typeName}.section_border', isChecked)
                                }}
                            />
                            {typeValues?.section_border === true && (
                                <FormContainer>
                                    <CommonSelect
                                        name={`${typeName}.section_border_style`}
                                        label="Section Border Style"
                                        options={borrderStyleArray}
                                    />
                                    {mainSectionBorderArray?.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
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
                                </FormContainer>
                            )}
                        </FormItem>
                    </FormContainer>

                    <FormContainer className="grid grid-cols-2 gap-3">
                        <FormItem label="Name" className="grid grid-cols-2 gap-3 w-full">
                            <Field
                                type="checkbox"
                                name={`${typeName}.name`}
                                placeholder="Enter name"
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue(`${typeName}.name`, isChecked)
                                }}
                            />{' '}
                            <br />
                            <br />
                            {typeValues?.name === true && (
                                <>
                                    {mainNameArray?.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
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
                                    <CommonSelect label="Position" name={`${typeName}.name_position`} options={NAMEPOSITION} />
                                    <CommonSelect label="Align" name={`${typeName}.name_align`} options={ALIGNVALUES} />
                                </>
                            )}
                            <FormItem label="Footer" className="w-1/2">
                                <Field
                                    type="checkbox"
                                    name={`${typeName}.name_footer`}
                                    component={Checkbox}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const isChecked = e.target.checked
                                        setFieldValue(`${typeName}.name_footer`, isChecked)
                                    }}
                                />

                                {typeValues?.name_footer && (
                                    <>
                                        <FormItem label="Footer Top Margin" className="w-full">
                                            <Field
                                                type="number"
                                                name="component_config.footer_topMargin"
                                                placeholder="Enter Footer Top Margin"
                                                component={Input}
                                                min="0"
                                                step={0.01}
                                            />
                                        </FormItem>

                                        <CommonSelect
                                            label="Align Footer"
                                            name="component_config.name_footer_align"
                                            options={ALIGNVALUES}
                                        />
                                    </>
                                )}
                            </FormItem>
                        </FormItem>
                    </FormContainer>
                </div>
            </div>
            <br />
            <br />

            <FormContainer className=" grid grid-cols-2 gap-3">
                <div className="font-bold mt-1 bg-gray-300 px rounded-lg w-1/4 h-1/2 flex items-center justify-center ">
                    <span className="bg-gray-300  rounded-lg ">Web Configurations :</span>
                </div>

                {mainFieldsWebArray?.map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-">
                        <Field
                            type={item.type}
                            name={item.name}
                            component={item?.type === 'checkbox' ? Checkbox : Input}
                            min="0"
                            step={0.01}
                        />
                    </FormItem>
                ))}
                <CommonSelect
                    name={`${typeName}.web_font_style`}
                    label="Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name={`${typeName}.web_footer_font_style`}
                    label="Footer Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name={`${typeName}.web_section_alignment`}
                    label="Web Section Alignment"
                    options={SECTIONARRAY}
                    needClassName
                    className=" col-span-1 w-1/2"
                />
                <CommonSelect
                    name={`${typeName}.web_content_alignment`}
                    label="Web Content Alignment"
                    options={SECTIONARRAY}
                    needClassName
                    className=" col-span-1 w-1/2"
                />
                {/* dddddddddddddddddddddddddddddddd */}
                <div>
                    <FormContainer className="grid grid-cols-2 gap-3">
                        <FormItem label="Web Border" className="col-span-1 w-1/2">
                            <Field
                                type="checkbox"
                                name={`${typeName}.web_border`}
                                placeholder="Enter border"
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue(`${typeName}.web_border`, isChecked)
                                }}
                            />{' '}
                            <br />
                            <br />
                            {typeValues?.web_border === true && (
                                <FormContainer>
                                    <CommonSelect
                                        name="component_config.web_border_style"
                                        label="Web Border Style"
                                        options={BorderStyleArray}
                                    />
                                    {mainBorderWebArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
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
                                </FormContainer>
                            )}
                        </FormItem>
                        {/* Web Section Border */}
                        <FormItem label="Web Section Border" className="col-span-1 w-1/2">
                            <Field
                                type="checkbox"
                                name={`${typeName}.web_section_border`}
                                placeholder="Enter web section border"
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue(`${typeName}.web_section_border`, isChecked)
                                }}
                            />
                            {typeValues?.web_section_border === true && (
                                <FormContainer>
                                    <CommonSelect
                                        name="component_config.web_section_border_style"
                                        label="Web Section Border Style"
                                        options={BorderStyleArray}
                                    />
                                    {mainSectionBorderWebArray?.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
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
                                </FormContainer>
                            )}
                        </FormItem>
                    </FormContainer>

                    <FormContainer className="grid grid-cols-2 gap-3">
                        <FormItem label="Web Name" className="grid grid-cols-2 gap-3 w-1/2">
                            <Field
                                type="checkbox"
                                name={`${typeName}.web_name`}
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue(`${typeName}.web_name`, isChecked)
                                }}
                            />{' '}
                            <br />
                            <br />
                            {typeValues?.web_name === true && (
                                <>
                                    {mainNameWebArray?.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
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
                                    <CommonSelect label="Web position" name="component_config.web_name_position" options={NAMEPOSITION} />
                                    <CommonSelect label="Web Align" name="component_config.web_name_align" options={ALIGNVALUES} />
                                </>
                            )}
                            <FormItem label="Web Footer" className="w-full">
                                <Field
                                    type="checkbox"
                                    name={`${typeName}.web_name_footer`}
                                    component={Checkbox}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const isChecked = e.target.checked
                                        setFieldValue(`${typeName}.web_name_footer`, isChecked)
                                    }}
                                />

                                {typeValues?.web_name_footer && (
                                    <>
                                        <FormItem label="Web Footer Top Margin" className="w-full">
                                            <Field
                                                type="number"
                                                name={`${typeName}.web_footer_topMargin`}
                                                placeholder="Enter Web Footer Top Margin"
                                                component={Input}
                                                min="0"
                                                step={0.01}
                                            />
                                        </FormItem>
                                        <CommonSelect
                                            label="Web Align Footer"
                                            name={`${typeName}.web_name_footer_align`}
                                            options={ALIGNVALUES}
                                        />
                                    </>
                                )}
                            </FormItem>
                        </FormItem>
                    </FormContainer>
                </div>
            </FormContainer>
        </div>
    )
}

export default ComponentConfig
