/* eslint-disable @typescript-eslint/no-explicit-any */
import { BANNER_UPLOAD_DATA } from '@/common/banner'
import { Button, Select, Upload } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import React, { useEffect, useMemo, useState } from 'react'
import { FaWindowClose, FaImage, FaMobile, FaVideo } from 'react-icons/fa'
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
import FilterSelectWithoutFormik from '@/common/FilterSelectWithoutFormik'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { BANNER_MODEL } from './BannerCommon'
import { DISCOUNTOPTIONS } from '@/views/sales/groupNotification/sendNotification/sendNotify.common'
import { beforeUpload } from '@/common/beforeUpload'

function AddBannerStep3({
    setCurrentStep,
    completeBannerFormData,
    setCompleteBannerFormData,
    selectedPage,
    subPageId,
    selectedSection,
}: any) {
    const [bannerForm, setBannerFormData] = useState<BANNER_UPLOAD_DATA[]>(completeBannerFormData)

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
            if (formData?.from_date && formData.to_date && formData?.name) {
                return true
            }
            return false
        })

        if (formValid.every((v) => v)) {
            setCompleteBannerFormData(bannerForm)
            setCurrentStep(4)
        } else {
            notification.error({
                message: 'Please check Banner form data: to_date, from_date, name, sub page and store',
            })
        }
    }

    const removeBannerForm = (id: number) => {
        setBannerFormData(bannerForm.filter((banner) => banner.id !== id))
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Banner Content</h2>
                    <p className="text-gray-600 text-sm mt-1">Add and configure multiple banner tiles</p>
                </div>

                <div className="p-6">
                    {bannerForm.map((form, index) => (
                        <BannerFormCard
                            key={form.id}
                            form={form}
                            index={index}
                            selectedPage={selectedPage}
                            selectedSection={selectedSection}
                            subPageId={subPageId}
                            bannerForm={bannerForm}
                            setBannerForm={setBannerFormData}
                            onInputChange={handleInputChange}
                            onRemove={() => removeBannerForm(form.id)}
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-center gap-3">
                <Button
                    variant="new"
                    size="sm"
                    onClick={() => setBannerFormData([...bannerForm, { id: Date.now(), is_clickable: true }])}
                    className="flex items-center gap-2"
                >
                    + Add Banner Tile
                </Button>
                <Button
                    variant="new"
                    size="sm"
                    onClick={handlePreviewClicked}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                    See Preview
                </Button>
            </div>
        </div>
    )
}

export default AddBannerStep3

const BannerFormCard = ({
    form,
    index,
    bannerForm,
    setBannerForm,
    onInputChange,
    onRemove,
    selectedPage,
    subPageId,
    selectedSection,
}: any) => {
    const dispatch = useAppDispatch()
    const [subPageNamesData, setSubPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const { data: SubPageNames, isSuccess: isSubPageNamesSuccess } = pageSettingsService.useSubPageNamesQuery({
        pageName: selectedPage?.value || '',
    })
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)
    const [filterId, setFilterId] = useState('')
    const [excludeFilterId, setExcludeFilterId] = useState('')
    const [subPageIdStore, setSubPageIdStore] = useState<number[]>([])

    useEffect(() => {
        if (subPageId) {
            setSubPageIdStore((prev) => [...new Set([...prev, subPageId])])
        }
    }, [subPageId])

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    useEffect(() => {
        if (isSubPageNamesSuccess) {
            setSubPageNamesData(SubPageNames?.data || [])
        }
    }, [isSubPageNamesSuccess])

    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const subCategory = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)
    const product_type = useAppSelector<PRODUCTTYPE_STATE>((state) => state.product_type)

    let filteredCategories = category.categories
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

    const query = useMemo(() => {
        let subPage = ''
        if (subPageId) subPage = `&sub_page_id=${subPageId}`
        return `/banners?p=1&page_size=200&page=${selectedPage?.value}&section_heading=${selectedSection?.section_heading}${subPage}`
    }, [selectedPage?.value, selectedSection, subPageId])

    const { data: bannerData } = useFetchApi<BANNER_MODEL>({ url: query })
    const flatOptions = useMemo(() => filters?.filters?.flatMap((group) => group.options) || [], [filters])

    const handleFromTimeChange = (value: any) => {
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
        onInputChange(index, name, finalValue)
    }

    const handleSetDataInForm = (key: string, value: any) => {
        const tempBannerForm = [...bannerForm]
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
        setBannerForm(tempBannerForm)
    }

    const handleMultiSelect = (field: string, val: any) => {
        const tempBannerForm = [...bannerForm]
        const existingSortTag = tempBannerForm[index]?.tags?.find((item) => item?.startsWith('sort_')) || null

        if (field === 'tags') {
            tempBannerForm[index] = {
                ...tempBannerForm[index],
                tags: [...(val || []), ...(existingSortTag ? [existingSortTag] : [])],
            }
        } else if (field === 'sort') {
            tempBannerForm[index] = {
                ...tempBannerForm[index],
                tags: [...(tempBannerForm[index]?.tags?.filter((item) => !item?.startsWith('sort_')) || []), `${val[0]}`],
            }
        } else {
            tempBannerForm[index] = { ...tempBannerForm[index], [field]: val }
        }
        setBannerForm(tempBannerForm)
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

    useEffect(() => {
        if (bannerForm[index]) {
            setBannerForm((prev: any) => {
                const updatedForm = [...prev]
                updatedForm[index] = {
                    ...updatedForm[index],
                    extra_attributes: {
                        ...updatedForm[index]?.extra_attributes,
                        filter_id_exclude: excludeFilterId,
                    },
                }
                return updatedForm
            })
        }
    }, [excludeFilterId])

    useEffect(() => {
        if (subPageId) {
            const tempBannerForm = [...bannerForm]
            if (!tempBannerForm[index]?.sub_page || tempBannerForm[index].sub_page.length === 0) {
                tempBannerForm[index] = {
                    ...bannerForm[index],
                    sub_page: [subPageId],
                }
                setBannerForm(tempBannerForm)
            }
        }
    }, [subPageId])

    return (
        <div className="border border-gray-200 rounded-lg mb-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-gray-700">Banner Tile {index + 1}</h3>
                <button onClick={onRemove} className="text-red-500 hover:text-red-700 transition-colors p-1 rounded" title="Remove banner">
                    <FaWindowClose size={20} />
                </button>
            </div>

            <div className="p-6">
                <MediaUploadSection form={form} onUpload={handleSetDataInForm} />
                <BasicInfoSection
                    form={form}
                    onChange={handleChange}
                    bannerForm={bannerForm}
                    index={index}
                    onMultiSelect={handleMultiSelect}
                    bannerData={bannerData}
                />
                <DateAndPageConfig
                    form={form}
                    handleFromTimeChange={handleFromTimeChange}
                    bannerForm={bannerForm}
                    index={index}
                    handleToTimeChange={handleToTimeChange}
                    subPageNamesData={subPageNamesData}
                    subPageIdStore={subPageIdStore}
                    storeResults={storeResults}
                    onMultiSelect={handleMultiSelect}
                />
                <CategoryFilterConfig
                    form={form}
                    divisions={divisions}
                    brands={brands}
                    filters={filters}
                    filteredCategories={filteredCategories}
                    filteredSubCategories={filteredSubCategories}
                    filteredProductTypes={filteredProductTypes}
                    flatOptions={flatOptions}
                    filterId={filterId}
                    excludeFilterId={excludeFilterId}
                    setFilterId={setFilterId}
                    setExcludeFilterId={setExcludeFilterId}
                    onMultiSelect={handleMultiSelect}
                />
            </div>
        </div>
    )
}

const MediaUploadSection = ({ form, onUpload }: any) => {
    const uploadSections = [
        {
            key: 'image_web_file',
            label: 'Web Image',
            icon: <FaImage className="text-blue-500" />,
            accept: 'image/*',
            previewKey: 'image_web',
        },
        {
            key: 'image_mobile_file',
            label: 'Mobile Image',
            icon: <FaMobile className="text-green-500" />,
            accept: 'image/*',
            previewKey: 'image_mobile',
        },
        {
            key: 'video_file',
            label: 'Web Video',
            icon: <FaVideo className="text-purple-500" />,
            accept: 'video/*',
            previewKey: 'video_web',
        },
        {
            key: 'video_mobile_file',
            label: 'Mobile Video',
            icon: <FaVideo className="text-orange-500" />,
            accept: 'video/*',
            previewKey: 'video_mobile',
        },
        {
            key: 'lottie_web',
            label: 'Web Lottie',
            icon: <span>📁</span>,
            accept: '.json',
        },
        {
            key: 'lottie_mobile',
            label: 'Mobile Lottie',
            icon: <span>📁</span>,
            accept: '.json',
        },
    ]

    return (
        <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Media Assets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadSections.map((section) => (
                    <div key={section.key} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            {section.icon}
                            <span className="font-medium text-sm">{section.label}</span>
                        </div>

                        {/* 👇 Show preview if available */}
                        {form?.[section.previewKey] && (
                            <div className="mb-2">
                                {section.accept.includes('image') ? (
                                    <img
                                        src={form[section.previewKey]}
                                        alt={section.label}
                                        className="rounded-md object-cover h-24 w-full border"
                                    />
                                ) : section.accept.includes('video') ? (
                                    <video src={form[section.previewKey]} controls className="rounded-md h-24 w-full border" />
                                ) : (
                                    <p className="text-xs text-gray-500">Lottie JSON selected</p>
                                )}
                            </div>
                        )}

                        <Upload
                            uploadLimit={1}
                            beforeUpload={section.key.startsWith('lottie') ? beforeUpload : undefined}
                            onChange={(file) => onUpload(section.key, file[0])}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

const BasicInfoSection = ({ form, onChange, bannerForm, index, onMultiSelect, bannerData }: any) => {
    return (
        <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(ADD_BANNER_BASIC_FIELDS).map((field) => (
                    <div key={field} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">{ADD_BANNER_BASIC_FIELDS[field].label}</label>
                        {ADD_BANNER_BASIC_FIELDS[field].type === 'checkbox' ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm">{ADD_BANNER_BASIC_FIELDS[field].placeHolder}</span>
                                <input
                                    name={field}
                                    type="checkbox"
                                    disabled={bannerForm[index]?.is_custom ? ADD_BANNER_BASIC_FIELDS[field].idDisable : false}
                                    onChange={onChange}
                                    defaultChecked={form[field] || ADD_BANNER_BASIC_FIELDS[field].defVal}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                            </div>
                        ) : (
                            <input
                                name={field}
                                type={ADD_BANNER_BASIC_FIELDS[field].type}
                                placeholder={ADD_BANNER_BASIC_FIELDS[field].placeHolder}
                                disabled={bannerForm[index]?.is_custom ? ADD_BANNER_BASIC_FIELDS[field].idDisable : false}
                                onChange={onChange}
                                defaultValue={form[field] || ADD_BANNER_BASIC_FIELDS[field].defVal}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            />
                        )}
                    </div>
                ))}

                {form?.is_parent && (
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                            Parent Banner <span className="text-red-500">*</span>
                        </label>
                        <Select
                            isClearable
                            options={bannerData}
                            className="w-full"
                            getOptionLabel={(option) => option?.name}
                            getOptionValue={(option) => option?.id}
                            onChange={(newVal) => onMultiSelect('parent_banner', newVal?.id)}
                        />
                    </div>
                )}
            </div>

            {form?.is_custom && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Page Name</label>
                        <input
                            name="pageName"
                            placeholder="Enter Page Name"
                            onChange={onChange}
                            defaultValue={form?.pageName ?? ''}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Sub Page Name</label>
                        <input
                            name="subPageName"
                            placeholder="Enter Sub Page Name"
                            onChange={onChange}
                            defaultValue={form?.subPageName ?? ''}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

const DateAndPageConfig = ({
    form,
    bannerForm,
    handleFromTimeChange,
    subPageNamesData,
    subPageIdStore,
    onMultiSelect,
    handleToTimeChange,
    storeResults,
    index,
}: any) => {
    return (
        <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Schedule & Placement</h4>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Sub Page <span className="text-red-500">*</span>
                    </label>
                    <Select
                        isMulti
                        options={subPageNamesData}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        value={
                            subPageNamesData?.filter((item) => form['sub_page']?.includes?.(item.id) || subPageIdStore.includes(item.id)) ||
                            []
                        }
                        onChange={(selectedOptions) => {
                            const ids = selectedOptions?.map((item) => item.id) || []
                            onMultiSelect('sub_page', ids)
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Store</label>
                    <Select
                        isMulti
                        options={storeResults}
                        getOptionLabel={(option) => option.code}
                        getOptionValue={(option) => option.id}
                        onChange={(newVal) => onMultiSelect('store', newVal?.map((val) => val.id) || [])}
                    />
                </div>
            </div>
        </div>
    )
}

const CategoryFilterConfig = ({
    form,
    divisions,
    brands,
    filters,
    filteredCategories,
    filteredSubCategories,
    filteredProductTypes,
    flatOptions,
    onMultiSelect,
    filterId,
    excludeFilterId,
    setFilterId,
    setExcludeFilterId,
}: any) => {
    return (
        <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Targeting & Filters</h4>

            {/* Category Hierarchy */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Division</label>
                    <Select
                        isMulti
                        value={form['division'] || []}
                        options={divisions.divisions}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(newVal) => onMultiSelect('division', newVal)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Category</label>
                    <Select
                        isMulti
                        value={form['category'] || []}
                        options={filteredCategories}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(newVal) => onMultiSelect('category', newVal)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Sub Category</label>
                    <Select
                        isMulti
                        value={form['sub_category'] || []}
                        options={filteredSubCategories}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(newVal) => onMultiSelect('sub_category', newVal)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Product Type</label>
                    <Select
                        isMulti
                        value={form['product_type'] || []}
                        options={filteredProductTypes}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option?.id?.toString()}
                        onChange={(newVal) => onMultiSelect('product_type', newVal)}
                    />
                </div>
            </div>

            {/* Brand & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Brand</label>
                    <Select
                        isMulti
                        value={form['brand'] || []}
                        options={brands.brands}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(newVal) => onMultiSelect('brand', newVal)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Quick Filter Tags</label>
                    <Select
                        isMulti
                        options={filters.filters}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        value={flatOptions?.filter((item) => form['quick_filter_tags']?.includes(item.value)) || []}
                        onChange={(newVal) =>
                            onMultiSelect(
                                'quick_filter_tags',
                                newVal?.map((val) => val.value),
                            )
                        }
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Tags</label>
                    <Select
                        isMulti
                        options={filters.filters}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        value={flatOptions.filter((item) => form['tags']?.includes(item.value)) || []}
                        onChange={(newVal) =>
                            onMultiSelect(
                                'tags',
                                newVal?.map((val) => val.value),
                            )
                        }
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Sort By</label>
                    <Select
                        defaultValue={{ value: '', label: 'Sort by' }}
                        options={DISCOUNTOPTIONS}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        onChange={(selectedOption) => onMultiSelect('sort', [selectedOption?.value])}
                    />
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Include Filter</label>
                    <FilterSelectWithoutFormik filterId={filterId} setFilterId={setFilterId} customClass="w-full" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Exclude Filter</label>
                    <FilterSelectWithoutFormik exclude filterId={excludeFilterId} setFilterId={setExcludeFilterId} customClass="w-full" />
                </div>
            </div>
        </div>
    )
}
