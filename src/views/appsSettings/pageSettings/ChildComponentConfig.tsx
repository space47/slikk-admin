/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
    ALIGNVALUES,
    childBorderStyleArray,
    ChildComponentArray,
    ChildNameFieldArray,
    ChildSectionBorderStyleArray,
    ChildWebBorderStyleArray,
    ChildWebNameFieldArray,
    ChildWebSectionBorderStyleArray,
    NAMEPOSITION,
} from './genericComp'
import { Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import CommonSelect from './CommonSelect'
import { ParallaxConfigArray } from './configurationCommon'
import HelpTooltip from '@/common/HelpTooltip'

interface FontSize {
    label: string
    value: string
}

const CarouselTypeArray = [
    { label: 'NORMAL', value: 'NORMAL' },
    { label: 'PARALLAX', value: 'PARALLAX' },
    { label: 'STACK', value: 'STACK' },
]

const borderStyleArray = [
    { label: 'Dotted', value: 'dotted' },
    { label: 'Solid', value: 'solid' },
    { label: 'Dashed', value: 'dashed' },
]

interface PageCompProps {
    FontSizeArray: FontSize[]
    SECTIONARRAY: FontSize[]
    setFieldValue: any
    values: any
}

const ChildComponentConfig = ({ FontSizeArray, SECTIONARRAY, setFieldValue, values }: PageCompProps) => {
    return (
        <div>
            <div className=" grid grid-cols-2 gap-3 ">
                <div className="font-bold mt-1 bg-gray-300 px rounded-lg w-1/4 h-1/2 flex items-center justify-center ">
                    <span className="bg-gray-300  rounded-lg ">Mobile Configurations :</span>
                </div>

                {ChildComponentArray.slice(0, 28).map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-full">
                        <Field
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            component={item?.type === 'checkbox' ? Checkbox : Input}
                            min="0"
                        />
                    </FormItem>
                ))}

                {/* Carousel */}
                <CommonSelect
                    needClassName
                    name="extra_info.child_component_config.carousel_type"
                    label="Carousel Type"
                    options={CarouselTypeArray}
                    className="col-span-1 w-1/2"
                />
                {values?.extra_info?.component_config?.carousel_type === 'STACK' && (
                    <CommonSelect
                        needClassName
                        name="extra_info.child_component_config.carousel_swipe_direction"
                        label="Swipe Direction"
                        options={[
                            { label: 'left', value: 'left' },
                            { label: 'right', value: 'right' },
                        ]}
                        className="col-span-1 w-1/2"
                    />
                )}
                {values?.extra_info?.extra_info?.child_component_config?.carousel_type === 'PARALLAX' && (
                    <>
                        {ParallaxConfigArray.map((item, key) => (
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
                                    component={item?.type === 'checkbox' ? Checkbox : Input}
                                    min="0"
                                />
                            </FormItem>
                        ))}
                    </>
                )}

                <CommonSelect
                    name="extra_info.child_component_config.font_style"
                    label="Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name="extra_info.child_component_config.footer_font_style"
                    label="Footer Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name="extra_info.child_component_config.section_alignment"
                    label="Section Alignment"
                    options={SECTIONARRAY}
                    needClassName
                    className=" col-span-1 w-1/2"
                />
                <CommonSelect
                    name="extra_info.child_component_config.content_alignment"
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
                                name="extra_info.child_component_config.border"
                                placeholder="Enter border"
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('extra_info.child_component_config.border', isChecked)
                                }}
                            />
                            {values?.extra_info?.child_component_config?.border === true && (
                                <FormContainer>
                                    <CommonSelect
                                        name="extra_info.child_component_config.border_style"
                                        label="Border Style"
                                        options={borderStyleArray}
                                    />
                                    {childBorderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                                min="0"
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
                                name="extra_info.child_component_config.section_border"
                                placeholder="Enter section border"
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('extra_info.child_component_config.section_border', isChecked)
                                }}
                            />
                            {values?.extra_info?.child_component_config?.section_border === true && (
                                <FormContainer>
                                    <CommonSelect
                                        name="extra_info.child_component_config.section_border_style"
                                        label="Section Border Style"
                                        options={borderStyleArray}
                                    />
                                    {ChildSectionBorderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                                min="0"
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
                                name="extra_info.child_component_config.name"
                                placeholder="Enter name"
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('extra_info.child_component_config.name', isChecked)
                                }}
                            />{' '}
                            <br />
                            <br />
                            {values?.extra_info?.child_component_config?.name === true && (
                                <>
                                    {ChildNameFieldArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                                min="0"
                                            />
                                        </FormItem>
                                    ))}
                                    <CommonSelect
                                        label="Position"
                                        name="extra_info.child_component_config.name_position"
                                        options={NAMEPOSITION}
                                    />
                                    <CommonSelect label="Align" name="extra_info.child_component_config.name_align" options={ALIGNVALUES} />
                                </>
                            )}
                            <FormItem label="Footer" className="w-1/2">
                                <Field
                                    type="checkbox"
                                    name="extra_info.child_component_config.name_footer"
                                    component={Checkbox}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const isChecked = e.target.checked
                                        setFieldValue('extra_info.child_component_config.name_footer', isChecked)
                                    }}
                                />

                                {values?.extra_info?.child_component_config?.name_footer && (
                                    <>
                                        <FormItem label="Footer Top Margin" className="w-full">
                                            <Field
                                                type="number"
                                                name="component_config.footer_topMargin"
                                                placeholder="Enter Footer Top Margin"
                                                component={Input}
                                                min="0"
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

                {ChildComponentArray.slice(28).map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-">
                        <Field
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            component={item?.type === 'checkbox' ? Checkbox : Input}
                            min="0"
                        />
                    </FormItem>
                ))}
                <CommonSelect
                    name="extra_info.child_component_config.web_font_style"
                    label="Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name="extra_info.child_component_config.web_footer_font_style"
                    label="Footer Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name="extra_info.child_component_config.web_section_alignment"
                    label="Web Section Alignment"
                    options={SECTIONARRAY}
                    needClassName
                    className=" col-span-1 w-1/2"
                />
                <CommonSelect
                    name="extra_info.child_component_config.web_content_alignment"
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
                                name="extra_info.child_component_config.web_border"
                                placeholder="Enter border"
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('extra_info.child_component_config.web_border', isChecked)
                                }}
                            />{' '}
                            <br />
                            <br />
                            {values?.extra_info?.child_component_config?.web_border === true && (
                                <FormContainer>
                                    <CommonSelect
                                        name="component_config.web_border_style"
                                        label="Web Border Style"
                                        options={borderStyleArray}
                                    />
                                    {ChildWebBorderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                                min="0"
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
                                name="extra_info.child_component_config.web_section_border"
                                placeholder="Enter web section border"
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('extra_info.child_component_config.web_section_border', isChecked)
                                }}
                            />
                            {values?.extra_info?.child_component_config?.web_section_border === true && (
                                <FormContainer>
                                    <CommonSelect
                                        name="component_config.web_section_border_style"
                                        label="Web Section Border Style"
                                        options={borderStyleArray}
                                    />
                                    {ChildWebSectionBorderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                                min="0"
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
                                name="extra_info.child_component_config.web_name"
                                component={Checkbox}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('extra_info.child_component_config.web_name', isChecked)
                                }}
                            />{' '}
                            <br />
                            <br />
                            {values?.extra_info?.child_component_config?.web_name === true && (
                                <>
                                    {ChildWebNameFieldArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                                min="0"
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
                                    name="extra_info.child_component_config.web_name_footer"
                                    component={Checkbox}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const isChecked = e.target.checked
                                        setFieldValue('extra_info.child_component_config.web_name_footer', isChecked)
                                    }}
                                />

                                {values?.extra_info?.child_component_config?.web_name_footer && (
                                    <>
                                        <FormItem label="Web Footer Top Margin" className="w-full">
                                            <Field
                                                type="number"
                                                name="extra_info.child_component_config.web_footer_topMargin"
                                                placeholder="Enter Web Footer Top Margin"
                                                component={Input}
                                                min="0"
                                            />
                                        </FormItem>
                                        <CommonSelect
                                            label="Web Align Footer"
                                            name="extra_info.child_component_config.web_name_footer_align"
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

export default ChildComponentConfig
