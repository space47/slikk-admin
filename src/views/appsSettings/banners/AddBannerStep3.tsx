/* eslint-disable @typescript-eslint/no-explicit-any */
import { BANNER_UPLOAD_DATA } from '@/common/banner'
import { Button, Select, Upload } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import React, { useEffect, useState } from 'react'
import { FaWindowClose } from 'react-icons/fa'
import { ADD_BANNER_BASIC_FIELDS } from './generalFields'
import { BRAND_STATE } from '@/store/types/brand.types'
import { FILTER_STATE } from '@/store/types/filters.types'
import { notification } from 'antd'
import moment from 'moment'
import BannerDateSelector from './BannerDateSelector'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { PRODUCTTYPE_STATE } from '@/store/types/productType.types'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import CommonFilterSelect from '@/common/ComonFilterSelect'
import FilterSelectWithoutFormik from '@/common/FilterSelectWithoutFormik'

function AddBannerStep3({ setCurrentStep, completeBannerFormData, setCompleteBannerFormData, selectedPage }: any) {
    console.log('selected section', selectedPage?.value)
    const [bannerForm, setBannerFormData] = useState<BANNER_UPLOAD_DATA[]>(completeBannerFormData)

    useEffect(() => {
        console.log('tttp', bannerForm)
    }, [bannerForm])

    const handleInputChange = (index: number, field: string, value: any) => {
        console.log('fieldss', field)
        setBannerFormData((prev) =>
            prev.map((form, idx) => {
                if (idx === index) {
                    if (field === 'maxoff' || field === 'minoff') {
                        const updatedTags = form.tags
                            ? [...form.tags.filter((tag: string) => !tag.startsWith(`${field}_`)), `${field}_${value}`]
                            : [`${field}_${value}`]

                        console.log('FORM VALUE IN CHANGE', form)

                        return {
                            ...form,
                            [field]: value,
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
            if (formData?.from_date && formData.to_date && formData?.name && formData?.sub_page) {
                return true
            }
            return false
        })

        if (formValid.every((v) => v)) {
            setCompleteBannerFormData(bannerForm)
            setCurrentStep(4)
        } else {
            notification.error({
                message: 'Please check Banner form data to_date, from_date , name, sub page and store',
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
                                pageName={selectedPage?.value}
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

const SingleBannerFormComp = ({ bannerForm, setBannerForm, index, handleInputChange, pageName }: any) => {
    const dispatch = useAppDispatch()
    const [subPageNamesData, setSubPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const { data: SubPageNames, isSuccess: isSubPageNamesSuccess } = pageSettingsService.useSubPageNamesQuery({
        page: 1,
        pageSize: 100,
        pageName: pageName || '',
    })

    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    const [filterId, setFilterId] = useState('')

    console.log('page name', pageName)
    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    useEffect(() => {
        if (isSubPageNamesSuccess) {
            setSubPageNamesData(SubPageNames?.data || [])
        }
    }, [dispatch, isSubPageNamesSuccess])

    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const subCategory = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)
    const product_type = useAppSelector<PRODUCTTYPE_STATE>((state) => state.product_type)

    let filteredCategories = category.categories

    console.log('BannerForm division', bannerForm[index]['division'])
    if (bannerForm[index]['division']) {
        filteredCategories = category.categories.filter((cat) => {
            return bannerForm[index]['division'].map((item: any) => item?.name).some((div: any) => div === cat.division_name)
        })
    }

    let filteredSubCategories = subCategory.subcategories

    if (bannerForm[index]['category']) {
        filteredSubCategories = subCategory.subcategories.filter((subCat) => {
            return bannerForm[index]['category'].map((item: any) => item?.name).some((div: any) => div === subCat.category_name)
        })
    }

    let filteredProductTypes = product_type.product_types
    if (bannerForm[index]['sub_category']) {
        filteredProductTypes = product_type.product_types.filter((prodType) => {
            return bannerForm[index]['sub_category'].map((item: any) => item?.name).some((div: any) => div === prodType.sub_category_name)
        })
    }

    console.log('filteredCategories', filteredCategories)

    const handleFromTimeChange = (value: any) => {
        console.log('HandleTimeChange', value)
        const formattedValue = moment(value).format('YYYY-MM-DD HH:mm:ss')
        const updatedBannerForm = [...bannerForm]
        updatedBannerForm[index] = {
            ...updatedBannerForm[index],
            from_date: formattedValue,
        }
        setBannerForm(updatedBannerForm)
    }

    const handleToTimeChange = (value: any) => {
        const formattedValue = moment(value).format('YYYY-MM-DD HH:mm:ss')

        // Update the bannerForm with to_date
        const updatedBannerForm = [...bannerForm]
        updatedBannerForm[index] = {
            ...updatedBannerForm[index],
            to_date: formattedValue,
        }
        setBannerForm(updatedBannerForm)
    }
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target

        const finalValue = type === 'number' ? Number(value) : type === 'checkbox' ? checked : value
        handleInputChange(name, finalValue)
    }

    useEffect(() => {
        if (filterId) {
            const tempBannerForm = [...bannerForm]
            tempBannerForm[index] = {
                ...bannerForm[index],
                filter_id: filterId,
            }
            setBannerForm(tempBannerForm)
        }
    }, [filterId])

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
            <div className="flex flex-col gap-y-2 items-center justify-center w-[300px] overflow-hidden bg-gray-50 p-2">
                <span>Select Banner Web Image</span>
                <Upload uploadLimit={1} onChange={(file) => handleSetDataInForm('image_web_file', file[0])} />
            </div>
            <div className="flex flex-col gap-y-2 items-center justify-center w-[300px] overflow-hidden bg-gray-50 p-2">
                <span>Select Banner Mobile Image</span>
                <Upload uploadLimit={1} onChange={(file) => handleSetDataInForm('image_mobile_file', file[0])} />
            </div>

            {/* videos */}

            <div className="flex flex-col gap-y-2 items-center justify-center w-[300px] overflow-hidden bg-gray-50 p-2">
                <span>Select Banner Video</span>
                <Upload uploadLimit={1} onChange={(file) => handleSetDataInForm('video_file', file[0])} />
            </div>
            <div className="flex flex-col gap-y-2 items-center justify-center w-[300px] overflow-hidden bg-gray-50 p-2">
                <span>Select Mobile Banner Video</span>
                <Upload uploadLimit={1} onChange={(file) => handleSetDataInForm('video_mobile_file', file[0])} />
            </div>
            <div className="flex flex-col gap-y-2 items-center justify-center w-[300px] overflow-hidden bg-gray-50 p-2">
                <span>Select Banner Lottie</span>
                <Upload uploadLimit={1} onChange={(file) => handleSetDataInForm('lottie_web', file[0])} />
            </div>
            <div className="flex flex-col gap-y-2 items-center justify-center w-[300px] overflow-hidden bg-gray-50 p-2">
                <span>Select Mobile Banner Lottie</span>
                <Upload uploadLimit={1} onChange={(file) => handleSetDataInForm('lottie_mobile', file[0])} />
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
                                disabled={bannerForm[index]?.is_custom ? ADD_BANNER_BASIC_FIELDS[field].idDisable : false}
                                className="border p-2 rounded-xl disabled:cursor-not-allowed"
                                type={ADD_BANNER_BASIC_FIELDS[field].type}
                                placeholder={ADD_BANNER_BASIC_FIELDS[field].placeHolder}
                                onChange={handleChange}
                                defaultValue={bannerForm[index][field] || ADD_BANNER_BASIC_FIELDS[field].defVal}
                                defaultChecked={bannerForm[index][field] || ADD_BANNER_BASIC_FIELDS[field].defVal}
                            />
                        </div>
                    </div>
                ))}
                {bannerForm[index]?.is_custom && (
                    <>
                        <div className="flex flex-col mb-2">
                            <label className="font-semibold">Page Name</label>
                            <input
                                name="pageName"
                                className="border p-2 rounded-xl"
                                placeholder="Enter Page Name"
                                onChange={handleChange}
                                defaultValue={bannerForm[index]?.pageName ?? ''}
                            />
                        </div>
                        <div className="flex flex-col mb-2">
                            <label className="font-semibold">Sub Page Name</label>
                            <input
                                name="subPageName"
                                className="border p-2 rounded-xl"
                                placeholder="Enter Sub Page Name"
                                onChange={handleChange}
                                defaultValue={bannerForm[index]?.subPageName ?? ''}
                            />
                        </div>
                    </>
                )}
            </form>

            <div className="grid xl:grid-cols-8 grid-cols-2  gap-3">
                <BannerDateSelector
                    isReq
                    handleTimeChange={(value: any) => {
                        handleFromTimeChange(value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                    }}
                    valueDate={bannerForm[index]?.from_date}
                    label="Start Date"
                />
                <BannerDateSelector
                    isReq
                    handleTimeChange={(value: any) => {
                        handleToTimeChange(value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                    }}
                    valueDate={bannerForm[index]?.to_date}
                    label="End Date"
                />
                <div className="flex flex-col">
                    <div>
                        Sub Page <span className="text-red-600">*</span>
                    </div>
                    <Select
                        isMulti
                        options={subPageNamesData}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        onChange={(newVal, actionMeta) => {
                            console.log(newVal, actionMeta)
                            handleMultiSelect(
                                'sub_page',
                                newVal?.map((val) => val.id),
                            )
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <div>Store</div>
                    <Select
                        isMulti
                        options={storeResults}
                        getOptionLabel={(option) => option.code}
                        getOptionValue={(option) => option.id}
                        onChange={(newVal, actionMeta) => {
                            console.log(newVal, actionMeta)
                            handleMultiSelect('store', newVal?.map((val) => val.id) || [])
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <div>Division</div>
                    <Select
                        isMulti
                        value={bannerForm[index]['division'] || []}
                        options={divisions.divisions}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(newVal) => {
                            console.log('DAGA ', bannerForm[index]['division'])
                            handleMultiSelect('division', newVal)
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <div>Category</div>
                    <Select
                        isMulti
                        value={bannerForm[index]['category'] || []}
                        options={filteredCategories}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(newVal, actionMeta) => {
                            console.log(newVal, actionMeta)
                            handleMultiSelect('category', newVal)
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <div>Sub Category</div>
                    <Select
                        isMulti
                        value={bannerForm[index]['sub_category'] || []}
                        options={filteredSubCategories}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(newVal, actionMeta) => {
                            console.log(newVal, actionMeta)
                            handleMultiSelect('sub_category', newVal)
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <div>Product Type</div>
                    <Select
                        isMulti
                        value={bannerForm[index]['product_type'] || []}
                        options={filteredProductTypes}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(newVal, actionMeta) => {
                            console.log(newVal, actionMeta)
                            handleMultiSelect('product_type', newVal)
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <div>Brand</div>
                    <Select
                        isMulti
                        value={bannerForm[index]['brand'] || []}
                        options={brands.brands}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(newVal, actionMeta) => {
                            console.log(newVal, actionMeta)
                            handleMultiSelect('brand', newVal)
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <div>Quick Filter Tags</div>
                    <Select
                        isMulti
                        options={filters.filters}
                        value={bannerForm[index]['quick_filter_tags'] || []}
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
                            { value: 'sort_rating', label: 'RATING' },
                            { value: 'sort_newest', label: 'NEWEST' },
                        ]}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        onChange={(selectedOption) => {
                            handleMultiSelect('tags', [selectedOption?.value])
                        }}
                    />
                </div>

                <div className="mb-4">
                    <FilterSelectWithoutFormik filterId={filterId} setFilterId={setFilterId} customClass="xl:w-[400px]" />
                </div>

                <div></div>
            </div>
        </div>
    )
}
