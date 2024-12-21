/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
    ALIGNVALUES,
    borrderStyleArray,
    genericComponentArray,
    NameFieldArray,
    NAMEPOSITION,
    sectionBorrderStyleArray,
    webBorrderStyleArray,
    WebNameFieldArray,
} from './genericComp'
import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import CommonSelect from './CommonSelect'
import { DatePicker } from 'antd'
import moment from 'moment'

interface FontSize {
    label: string
    value: string
}

const SECTIONARRAY = [
    { label: 'Flex Start', value: 'flex-start' },
    { label: 'Flex End', value: 'flex-end' },
    { label: 'Center', value: 'center' },
    { label: 'Space Between', value: 'space-between' },
    { label: 'Space Around', value: 'space-around' },
    { label: 'Space Evenly', value: 'space-evenly' },
]

const borderStyleArray = [
    { label: 'Dotted', value: 'dotted' },
    { label: 'Solid', value: 'solid' },
    { label: 'Dashed', value: 'dashed' },
]

interface PageCompProps {
    FontSizeArray: FontSize[]
    SECTIONARRAY: FontSize[]
    setBorderForm: any
    borderForm: any
    setFieldValue: any
    setSectioBorderShow: any
    sectionBorderShow: any
    setWebBorderForm: any
    webBorderForm: any
    setWebSectioBorderShow: any
    webSectionBorderShow: any
    setNameForm: any
    nameForm: any
    setFooterAlignForm: any
    footerAlignForm: any
    setWebNameForm: any
    webNameForm: any
    setWebFooterAlignForm: any
    webFooterAlignForm: any
}

const PageComponentConfig = ({
    FontSizeArray,
    SECTIONARRAY,
    borderForm,
    setBorderForm,
    setFieldValue,
    setSectioBorderShow,
    sectionBorderShow,
    setWebBorderForm,
    webBorderForm,
    setWebSectioBorderShow,
    webSectionBorderShow,
    setNameForm,
    nameForm,
    setFooterAlignForm,
    footerAlignForm,
    setWebNameForm,
    webNameForm,
    setWebFooterAlignForm,
    webFooterAlignForm,
}: PageCompProps) => {
    return (
        <div>
            <div className=" grid grid-cols-2">
                <div className="font-bold mt-1 bg-gray-300 px rounded-lg w-1/4 h-1/2 flex items-center justify-center ">
                    <span className="bg-gray-300  rounded-lg ">Mobile Configurations :</span>
                </div>

                {genericComponentArray.slice(0, 28).map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-2/3">
                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} min="0" />
                    </FormItem>
                ))}
                <CommonSelect
                    name="component_config.font_style"
                    label="Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name="component_config.footer_font_style"
                    label="Footer Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name="component_config.section_alignment"
                    label="Section Alignment"
                    options={SECTIONARRAY}
                    needClassName
                    className=" col-span-1 w-1/2"
                />
                <CommonSelect
                    name="component_config.content_alignment"
                    label="Content Alignment"
                    options={SECTIONARRAY}
                    needClassName
                    className=" col-span-1 w-1/2"
                />
                {/* ssssssssssssssssssssssssssssssssssssssssssssssss */}
                <div>
                    <FormContainer className="grid grid-cols-2">
                        <FormItem label="Border" className="col-span-1 w-1/2">
                            <Field
                                type="checkbox"
                                name="border"
                                placeholder="Enter border"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('border', isChecked)
                                    setBorderForm(isChecked)
                                }}
                            />
                            {borderForm === true && (
                                <FormContainer>
                                    <CommonSelect name="component_config.border_style" label="Border Style" options={borderStyleArray} />
                                    {borrderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={Input}
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
                                name="section_border"
                                placeholder="Enter section border"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('section_border', isChecked)
                                    setSectioBorderShow(isChecked)
                                }}
                            />
                            {sectionBorderShow === true && (
                                <FormContainer>
                                    <CommonSelect
                                        name="component_config.section_border_style"
                                        label="Section Border Style"
                                        options={borderStyleArray}
                                    />
                                    {sectionBorrderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={Input}
                                                min="0"
                                            />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                            )}
                        </FormItem>
                    </FormContainer>

                    <FormContainer className="grid grid-cols-2">
                        <FormItem label="Name" className="grid grid-cols-2 w-full">
                            <Field
                                type="checkbox"
                                name="name"
                                placeholder="Enter name"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('name', isChecked)
                                    setNameForm(isChecked)
                                }}
                            />{' '}
                            <br />
                            <br />
                            {nameForm && (
                                <>
                                    {NameFieldArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={Input}
                                                min="0"
                                            />
                                        </FormItem>
                                    ))}
                                    <CommonSelect label="Position" name="component_config.name_position" options={NAMEPOSITION} />
                                    <CommonSelect label="Align" name="component_config.name_align" options={ALIGNVALUES} />
                                </>
                            )}
                            <FormItem label="Footer" className="w-1/2">
                                <Field
                                    type="checkbox"
                                    name="name_footer"
                                    component={Input}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const isChecked = e.target.checked
                                        setFieldValue('name_footer', isChecked)
                                        setFooterAlignForm(isChecked)
                                    }}
                                />

                                {footerAlignForm && (
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

            <FormContainer className=" grid grid-cols-2">
                <div className="font-bold mt-1 bg-gray-300 px rounded-lg w-1/4 h-1/2 flex items-center justify-center ">
                    <span className="bg-gray-300  rounded-lg ">Web Configurations :</span>
                </div>

                {genericComponentArray.slice(28).map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-2/3">
                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} min="0" />
                    </FormItem>
                ))}
                <CommonSelect
                    name="component_config.web_font_style"
                    label="Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name="component_config.web_footer_font_style"
                    label="Footer Font Style"
                    options={FontSizeArray}
                    needClassName
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    name="component_config.web_section_alignment"
                    label="Web Section Alignment"
                    options={SECTIONARRAY}
                    needClassName
                    className=" col-span-1 w-1/2"
                />
                <CommonSelect
                    name="component_config.web_content_alignment"
                    label="Web Content Alignment"
                    options={SECTIONARRAY}
                    needClassName
                    className=" col-span-1 w-1/2"
                />
                {/* dddddddddddddddddddddddddddddddd */}
                <div>
                    <FormContainer className="grid grid-cols-2">
                        <FormItem label="Web Border" className="col-span-1 w-1/2">
                            <Field
                                type="checkbox"
                                name="web_border"
                                placeholder="Enter border"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('web_border', isChecked)
                                    setWebBorderForm(isChecked)
                                }}
                            />{' '}
                            <br />
                            <br />
                            {webBorderForm === true && (
                                <FormContainer>
                                    <CommonSelect
                                        name="component_config.web_border_style"
                                        label="Web Border Style"
                                        options={borderStyleArray}
                                    />
                                    {webBorrderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={Input}
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
                                name="web_section_border"
                                placeholder="Enter web section border"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('web_section_border', isChecked)
                                    setWebSectioBorderShow(isChecked ? 'yes' : 'no')
                                }}
                            />
                            {webSectionBorderShow === 'yes' && (
                                <FormContainer>
                                    <CommonSelect
                                        name="component_config.web_section_border_style"
                                        label="Web Section Border Style"
                                        options={borderStyleArray}
                                    />
                                    {webBorrderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={Input}
                                                min="0"
                                            />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                            )}
                        </FormItem>
                    </FormContainer>

                    <FormContainer className="grid grid-cols-2">
                        <FormItem label="Web Name" className="grid grid-cols-2 w-1/2">
                            <Field
                                type="checkbox"
                                name="web_name"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('web_name', isChecked)
                                    setWebNameForm(isChecked)
                                }}
                            />{' '}
                            <br />
                            <br />
                            {webNameForm === true && (
                                <>
                                    {WebNameFieldArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={Input}
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
                                    name="web_name_footer"
                                    component={Input}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const isChecked = e.target.checked
                                        setFieldValue('web_name_footer', isChecked)
                                        setWebFooterAlignForm(isChecked)
                                    }}
                                />

                                {webFooterAlignForm && (
                                    <>
                                        <FormItem label="Web Footer Top Margin" className="w-full">
                                            <Field
                                                type="number"
                                                name="component_config.web_footer_topMargin"
                                                placeholder="Enter Web Footer Top Margin"
                                                component={Input}
                                                min="0"
                                            />
                                        </FormItem>
                                        <CommonSelect
                                            label="Web Align Footer"
                                            name="component_config.web_name_footer_align"
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

export default PageComponentConfig
