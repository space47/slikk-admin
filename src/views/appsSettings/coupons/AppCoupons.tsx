/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { CoupunInitialStateType, setCouponData, setCount, setPage, setPageSize } from '@/store/slices/couponSlice/couponSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import Spinner from '@/components/ui/Spinner'
import { ImSpinner9 } from 'react-icons/im'
import { FaSearch } from 'react-icons/fa'
import EasyTable from '@/common/EasyTable'
import { couponService } from '@/store/services/couponService'
import { CouponCoulumns } from './couponUtils/CouponColumns'
import { Option } from '@/views/org-management/sellers/sellerCommon'
import { pageSizeOptions } from '@/views/category-management/orderlist/commontypes'
import AccessDenied from '@/views/pages/AccessDenied'
import { useLocation } from 'react-router-dom'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import DialogConfirm from '@/common/DialogConfirm'
import { AxiosError } from 'axios'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { CouponSeriesInitialTypes, setCouponSeriesData } from '@/store/slices/couponSeriesSlice/couponSeries'
import { couponSeriesService } from '@/store/services/couponSeriesService'
import CouponReleaseModal from './couponUtils/CouponReleaseModal'

const AppCoupons = () => {
    // const navigate = useNavigate()
    const location = useLocation()
    const { var1 } = location.state || {}
    const dispatch = useAppDispatch()
    const [mobileFilter, setMobileFilter] = useState('')
    const [couponCodeFilter, setCouponCodeFilter] = useState('')
    const [activateMobileButton, setActivateMobileButton] = useState('')
    const [activateCodeButton, setActivateCodeButton] = useState('')
    const [couponCode, setCouponCode] = useState<string>('')
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [couponId, setCouponId] = useState<any>('')
    const [isCouponReleaseModal, setIsCouponReleaseModal] = useState<boolean>(false)
    const [searchInput, setSearchInput] = useState<string>('')
    const { couponSeries } = useAppSelector<CouponSeriesInitialTypes>((state) => state.couponSeries)
    const [queryParams, setQueryParams] = useState({ page: 1, pageSize: 100, campaign: '' })
    const [seriesValue, setSeriesValue] = useState<any>('')
    const { data: couponSeriesData, isSuccess: getSuccess } = couponSeriesService.useCouponSeriesQuery(queryParams, {
        refetchOnMountOrArgChange: true,
    })

    useEffect(() => {
        if (getSuccess) {
            dispatch(setCouponSeriesData(couponSeriesData?.data?.results))
        }
    }, [getSuccess, couponSeriesData?.data?.results, dispatch])

    const formattedData = couponSeries
        ?.filter((item) => item?.campaign !== '')
        .map((item) => {
            return { label: item?.campaign, value: item?.id }
        })

    console.log('Formatted Data:', var1, seriesValue)

    const { coupon, count, page, pageSize } = useAppSelector<CoupunInitialStateType>((state) => state.coupon)
    const {
        data: couponsData,
        isSuccess,
        isLoading,
        isError,
        error,
    } = couponService.useCouponQuery(
        {
            coupon_code: activateCodeButton ? activateCodeButton : undefined,
            coupon_series: var1 || seriesValue || '',
            page,
            pageSize,
            mobile: activateMobileButton ? activateMobileButton : undefined,
        },
        {
            refetchOnMountOrArgChange: true,
        },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(setCouponData(couponsData?.data?.results))
            dispatch(setCount(couponsData?.data?.count))
        }
        if (isSuccess && activateCodeButton) {
            dispatch(setCouponData([couponsData?.data as any]))
        }
    }, [
        isSuccess,
        couponsData?.data?.results,
        dispatch,
        couponsData?.data?.count,
        activateCodeButton,
        activateMobileButton,
        couponsData?.data,
        error,
        isError,
    ])
    const hanldeSearchFuntion = () => {
        setActivateMobileButton(mobileFilter)
    }
    const hanldeSearchFuntionCode = () => {
        setActivateCodeButton(couponCodeFilter)
    }

    const handleDeleteCoupon = (code: string) => {
        setCouponCode(code)
        setDeleteModal(true)
    }

    const handleCouponRelease = (code: string | number) => {
        setCouponId(code)
        setIsCouponReleaseModal(true)
    }

    console.log('Selected Coupon Code:', seriesValue)

    const columns = CouponCoulumns({ handleDeleteCoupon, handleCouponRelease })

    const hanldeDelete = async () => {
        const body = {
            is_active: false,
        }
        try {
            const res = await axioisInstance.patch(`merchant/coupon?coupon_code=${couponCode}`, body)
            notification.success({ message: res?.data?.data?.message })
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.message })
            }
        }
    }

    const handleSearch = (inputValue: string) => {
        setSearchInput(inputValue)
        setQueryParams((prev) => ({ ...prev, campaign: inputValue }))
    }

    if (isError && error && 'status' in error && error.status === 403) {
        return <AccessDenied />
    }

    console.log('Search Input:', seriesValue)

    return (
        <div>
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <Spinner size={40} indicator={ImSpinner9} />
                </div>
            ) : (
                <>
                    <div className="flex flex-col xl:flex-row items-center gap-4 mb-10">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold mb-1">Search by Mobile Number</label>
                            <div className="flex items-center gap-2 shadow-lg border-gray-300 rounded-lg p-2  ">
                                <input
                                    type="search"
                                    placeholder="Enter mobile number"
                                    value={mobileFilter}
                                    className="w-full outline-none rounded-xl"
                                    onKeyDown={(e) => e.key === 'Enter' && hanldeSearchFuntion()}
                                    onChange={(e) => setMobileFilter(e.target.value)}
                                />
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-3 rounded-lg transition-all"
                                    onClick={hanldeSearchFuntion}
                                >
                                    <FaSearch className=" text-xl" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold mb-1">Search by Coupon Code</label>
                            <div className="flex items-center gap-2 shadow-lg border-gray-300 rounded-lg p-2  ">
                                <input
                                    type="search"
                                    placeholder="Enter coupon code"
                                    value={couponCodeFilter}
                                    className="w-full outline-none rounded-xl"
                                    onKeyDown={(e) => e.key === 'Enter' && hanldeSearchFuntionCode()}
                                    onChange={(e) => setCouponCodeFilter(e.target.value)}
                                />
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-3 rounded-lg transition-all"
                                    onClick={hanldeSearchFuntionCode}
                                >
                                    <FaSearch className=" text-xl " />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 shadow-lg border-gray-300 rounded-lg p-2">
                            <label className="text-gray-700 font-semibold mb-1">Search by Coupon Series</label>
                            <div>
                                <Select
                                    isSearchable
                                    isClearable
                                    className="xl:w-[300px]"
                                    inputValue={searchInput}
                                    options={formattedData}
                                    onInputChange={handleSearch}
                                    onChange={(selectedOption: any) => {
                                        const value = selectedOption ? selectedOption.value : ''
                                        setSeriesValue(value)
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                />
                            </div>
                        </div>
                    </div>

                    {((isError && error && 'status' in error && error.status === 400) || coupon?.length === 0) && (
                        <>
                            <div>
                                <div className="flex justify-center items-center xl:h-[200px]">
                                    <NotFoundData />
                                </div>
                            </div>
                        </>
                    )}

                    {!error && coupon?.length > 0 && (
                        <div>
                            <EasyTable mainData={coupon} columns={columns} page={page} pageSize={pageSize} />
                            <div className="flex items-center justify-between mt-4">
                                <Pagination
                                    pageSize={pageSize}
                                    currentPage={page}
                                    total={count}
                                    onChange={(page) => dispatch(setPage(page))}
                                />
                                <div className="min-w-[130px]">
                                    <Select<Option>
                                        size="sm"
                                        isSearchable={false}
                                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                                        options={pageSizeOptions}
                                        onChange={(option) => {
                                            if (option) {
                                                dispatch(setPage(1))
                                                dispatch(setPageSize(Number(option?.value)))
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {deleteModal && (
                        <DialogConfirm
                            IsDelete
                            IsOpen={deleteModal}
                            setIsOpen={setDeleteModal}
                            headingName="Delete Modal"
                            onDialogOk={hanldeDelete}
                        />
                    )}
                    {isCouponReleaseModal && (
                        <CouponReleaseModal
                            couponCode={couponId}
                            isOpen={isCouponReleaseModal}
                            setIsOpen={setIsCouponReleaseModal}
                            mobileNumber={mobileFilter}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default AppCoupons
