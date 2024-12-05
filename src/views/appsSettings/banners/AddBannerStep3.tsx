/* eslint-disable @typescript-eslint/no-explicit-any */
import { BANNER_UPLOAD_DATA } from '@/common/banner'
import { Button, FormItem, Select, Upload } from '@/components/ui'
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import React, { useEffect, useState } from 'react'
import { FaWindowClose } from 'react-icons/fa'
import { ADD_BANNER_BASIC_FIELDS } from './generalFields'
import { BRAND_STATE } from '@/store/types/brand.types'
import { FILTER_STATE } from '@/store/types/filters.types'
import { DatePicker, notification } from 'antd'
import DateAndTimePicker from '@/common/DateAndTime'
import moment from 'moment'
import { Field } from 'formik'

function AddBannerStep3({ setCurrentStep, completeBannerFormData, setCompleteBannerFormData }: any) {
    const [bannerForm, setBannerFormData] = useState<BANNER_UPLOAD_DATA[]>(completeBannerFormData)

    useEffect(() => {
        console.log('tttp', bannerForm)
    }, [bannerForm])

    const handleInputChange = (index: number, field: string, value: any) => {
        setBannerFormData((prev) =>
            prev.map((form, idx) => {
                if (idx === index) {
                    if (field === 'maxoff' || field === 'minoff') {
                        const updatedTags = form.tags
                            ? [...form.tags.filter((tag: string) => !tag.startsWith(`${field}_`)), `${field}_${value}`]
                            : [`${field}_${value}`]

                        return {
                            ...form,
                            tags: updatedTags,
                        }
                    }

                    return { ...form, [field]: value }
                }

                return form
            }),
        )
    }

    const handlePreviewClicked = () => {
        const formValid = bannerForm?.map((formData) => {
            if (formData?.from_date && formData.to_date && formData.name) {
                return true
            }
            return false
        })

        if (formValid.every((v) => v)) {
            setCompleteBannerFormData(bannerForm)
            setCurrentStep(4)
        } else {
            notification.error({
                message: 'Please check Banner form data to_date, from_date or name',
            })
        }
    }

    return (
        <div className="flex flex-col gap-y-3 w-full">
            <div className="flex flex-col gap-y-3 w-full">
                {bannerForm.map((_, key) => {
                    return (
                        <div key={key} className=" w-full border my-4 shadow-md relative min-h-[100px]">
                            <SingleBannerFormComp
                                bannerForm={bannerForm}
                                setBannerForm={setBannerFormData}
                                index={key}
                                handleInputChange={(field: any, value: any) => handleInputChange(key, field, value)}
                            />

                            <div className="absolute top-5 right-5">
                                <FaWindowClose
                                    color="red"
                                    onClick={() => {
                                        setBannerFormData(bannerForm.filter((banner) => banner.id != _.id))
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="w-fit self-center flex flex-row space-x-3">
                <Button variant="new" size="sm" onClick={() => setBannerFormData([...bannerForm, { id: Date.now(), is_clickable: true }])}>
                    +Add Banner Tile
                </Button>
                <Button variant="new" size="sm" onClick={handlePreviewClicked}>
                    See Preview
                </Button>
            </div>
        </div>
    )
}

export default AddBannerStep3

const SingleBannerFormComp = ({ bannerForm, setBannerForm, index, handleInputChange }: any) => {
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [filteredCategories, setFilteredCategories] = useState<string[]>([])
    const [filteredSubCategories, setFilteredSubCategories] = useState<string[]>([])
    const [filteredProductTypes, setFilteredProductTypes] = useState<string[]>([])
    const [sortOrder, setSortOrder] = useState<string | undefined>('')
    const [fromDateAndTime, setFromDateAndTime] = useState('')
    const [toDateAndTime, setToDateAndTime] = useState('')

    console.log('Here the filtered categories form add banner', filteredCategories)

    const handleFromTimeChange = (value: any) => {
        console.log('HandleTimeChange', value)
        const formattedValue = moment(value).format('YYYY-MM-DD HH:mm:ss')
        setFromDateAndTime(formattedValue)

        // Update the bannerForm with from_date
        const updatedBannerForm = [...bannerForm]
        updatedBannerForm[index] = {
            ...updatedBannerForm[index],
            from_date: formattedValue,
        }
        setBannerForm(updatedBannerForm)
    }

    const handleToTimeChange = (value: any) => {
        const formattedValue = moment(value).format('YYYY-MM-DD HH:mm:ss')
        setToDateAndTime(formattedValue)

        // Update the bannerForm with to_date
        const updatedBannerForm = [...bannerForm]
        updatedBannerForm[index] = {
            ...updatedBannerForm[index],
            to_date: formattedValue,
        }
        setBannerForm(updatedBannerForm)
    }

    console.log('Fillfillters', filters)
    console.log('BBBrand', brands)

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target

        const finalValue = type === 'number' ? Number(value) : type === 'checkbox' ? checked : value
        handleInputChange(name, finalValue)
    }

    const handleSetDataInForm = (key: string, value: any) => {
        const tempBannerForm = bannerForm

        if (key == 'image_web_file') {
            tempBannerForm[index] = {
                ...bannerForm[index],
                [key]: value,
                image_web: URL.createObjectURL(value),
            }
        } else if (key == 'image_mobile_file') {
            tempBannerForm[index] = {
                ...bannerForm[index],
                [key]: value,
                image_mobile: URL.createObjectURL(value),
            }
        } else if (key === 'video_file') {
            tempBannerForm[index] = {
                ...bannerForm[index],
                [key]: value,
                video_web: URL.createObjectURL(value),
            }
        } else if (key === 'video_mobile_file') {
            tempBannerForm[index] = {
                ...bannerForm[index],
                [key]: value,
                video_mobile: URL.createObjectURL(value),
            }
        } else {
            tempBannerForm[index] = { ...bannerForm[index], [key]: value }
        }
        console.log('temp', tempBannerForm)
        setBannerForm(tempBannerForm)
    }

    const handleMultiSelect = (field: string, val: any) => {
        console.log(val)
        const tempBannerForm = [...bannerForm]

        if (field === 'tags') {
            const existingTags = tempBannerForm[index].tags || []
            const updatedTags = [...new Set([...existingTags, ...val])]
            tempBannerForm[index] = { ...tempBannerForm[index], tags: updatedTags }
        } else {
            tempBannerForm[index] = { ...tempBannerForm[index], [field]: val }
        }

        setBannerForm(tempBannerForm)
    }
    return (
        <div className="flex flex-row flex-wrap gap-x-5 gap-y-2 p-4">
            <div className="flex flex-col gap-y-2 items-center justify-center">
                <span>Select Banner Web Image</span>
                <Upload uploadLimit={1} onChange={(file) => handleSetDataInForm('image_web_file', file[0])} />
            </div>
            <div className="flex flex-col gap-y-2 items-center justify-center">
                <span>Select Banner Mobile Image</span>
                <Upload uploadLimit={1} onChange={(file) => handleSetDataInForm('image_mobile_file', file[0])} />
            </div>

            {/* videos */}

            <div className="flex flex-col gap-y-2 items-center justify-center">
                <span>Select Banner Video</span>
                <Upload uploadLimit={1} onChange={(file) => handleSetDataInForm('video_file', file[0])} />
            </div>
            <div className="flex flex-col gap-y-2 items-center justify-center">
                <span>Select Mobile Banner Video</span>
                <Upload uploadLimit={1} onChange={(file) => handleSetDataInForm('video_mobile_file', file[0])} />
            </div>

            <form className="p-4 flex flex-row gap-3 flex-wrap">
                {Object.keys(ADD_BANNER_BASIC_FIELDS).map((field, ind) => (
                    <div className="flex flex-row space-x-2 items-center" key={ind}>
                        {ADD_BANNER_BASIC_FIELDS[field].type == 'checkbox' && (
                            <span className="font-bold">{ADD_BANNER_BASIC_FIELDS[field].placeHolder}</span>
                        )}
                        <div className="flex flex-col">
                            <div className="la">{ADD_BANNER_BASIC_FIELDS[field].label}</div>
                            <input
                                name={field}
                                className="border p-2 rounded-xl"
                                type={ADD_BANNER_BASIC_FIELDS[field].type}
                                placeholder={ADD_BANNER_BASIC_FIELDS[field].placeHolder}
                                onChange={handleChange}
                                defaultValue={bannerForm[index][field] || ADD_BANNER_BASIC_FIELDS[field].defVal}
                                defaultChecked={bannerForm[index][field] || ADD_BANNER_BASIC_FIELDS[field].defVal}
                            />
                        </div>
                    </div>
                ))}
            </form>

            <div className="flex flex-col gap-2">
                <div>Start Date:</div>
                <DatePicker
                    showTime
                    placeholder=""
                    onChange={(value) => {
                        handleFromTimeChange(value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                    }}
                />
            </div>

            <div className="flex flex-col gap-2">
                <div>End Date:</div>

                <DatePicker
                    showTime
                    placeholder=""
                    onChange={(value) => {
                        handleToTimeChange(value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                    }}
                />
            </div>

            <div className="flex flex-col">
                <div>Division</div>
                <Select
                    isMulti
                    defaultValue={bannerForm[index]['division'] || []}
                    options={divisions.divisions}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id.toString()}
                    onChange={(newVal, actionMeta) => {
                        console.log(newVal, actionMeta)

                        const selectedCategories = newVal ? newVal.map((division) => division.categories).flat() : []

                        handleMultiSelect('category', '')
                        handleMultiSelect('sub_category', '')
                        handleMultiSelect('product_type', '')

                        setFilteredCategories(selectedCategories)

                        handleMultiSelect('division', newVal?.map((val) => val.name)?.join(','))
                    }}
                />
            </div>

            <div className="flex flex-col">
                <div>Category</div>
                <Select
                    isMulti
                    defaultValue={bannerForm[index]['category'] || []}
                    options={filteredCategories}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id.toString()}
                    onChange={(newVal, actionMeta) => {
                        console.log(newVal, actionMeta)

                        const selectedSubCategories = newVal ? newVal.map((category) => category.sub_categories).flat() : []

                        handleMultiSelect('sub_category', '')
                        handleMultiSelect('product_type', '')

                        setFilteredSubCategories(selectedSubCategories)

                        handleMultiSelect('category', newVal?.map((val) => val.name)?.join(','))
                    }}
                />
            </div>

            <div className="flex flex-col">
                <div>Sub Category</div>
                <Select
                    isMulti
                    defaultValue={bannerForm[index]['sub_category'] || []}
                    options={filteredSubCategories}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id.toString()}
                    onChange={(newVal, actionMeta) => {
                        console.log(newVal, actionMeta)

                        const selectedProductTypes = newVal ? newVal.map((subCategory) => subCategory.product_types).flat() : []

                        handleMultiSelect('product_type', '')

                        setFilteredProductTypes(selectedProductTypes)

                        handleMultiSelect('sub_category', newVal?.map((val) => val.name)?.join(','))
                    }}
                />
            </div>

            <div className="flex flex-col">
                <div>Product Type</div>
                <Select
                    isMulti
                    defaultValue={bannerForm[index]['product_type'] || []}
                    options={filteredProductTypes}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id.toString()}
                    onChange={(newVal, actionMeta) => {
                        console.log(newVal, actionMeta)

                        handleMultiSelect('product_type', newVal?.map((val) => val.name)?.join(','))
                    }}
                />
            </div>

            <div className="flex flex-col">
                <div>Brand</div>
                <Select
                    isMulti
                    defaultValue={bannerForm[index]['brand'] || []}
                    options={brands.brands}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id.toString()}
                    onChange={(newVal, actionMeta) => {
                        console.log(newVal, actionMeta)
                        handleMultiSelect('brand', newVal?.map((val) => val.name)?.join(','))
                    }}
                />
            </div>

            <div className="flex flex-col">
                <div>Quick Filter Tags</div>
                <Select
                    isMulti
                    options={filters.filters}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    onChange={(newVal, actionMeta) => {
                        console.log(newVal, actionMeta)
                        handleMultiSelect(
                            'quick_filter_tags',
                            newVal?.map((val) => val.value),
                        )
                    }}
                />
            </div>

            <div className="flex flex-col">
                <div>Tags</div>
                <Select
                    isMulti
                    options={filters.filters}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    onChange={(newVal, actionMeta) => {
                        console.log(newVal, actionMeta)
                        handleMultiSelect(
                            'tags',
                            newVal?.map((val) => val.value),
                        )
                    }}
                />
            </div>

            <div className="flex flex-col">
                <div>Sort By</div>
                <Select
                    defaultValue={{ value: '', label: 'Sort by' }}
                    options={[
                        { value: 'sort_lowtohigh', label: 'Low to High' },
                        { value: 'sort_hightolow', label: 'High to Low' },
                        { value: 'sort_discount', label: 'DISCOUNT' },
                    ]}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    onChange={(selectedOption) => {
                        console.log(selectedOption)
                        setSortOrder(selectedOption?.value)
                        handleMultiSelect('tags', [selectedOption?.value])
                    }}
                />
            </div>
        </div>
    )
}
