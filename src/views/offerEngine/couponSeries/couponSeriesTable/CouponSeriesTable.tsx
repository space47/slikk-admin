/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from '@/store'
import { couponSeriesService } from '@/store/services/couponSeriesService'
import {
    CouponSeriesInitialTypes,
    setCouponSeriesData,
    setCount,
    setPage,
    setPageSize,
} from '@/store/slices/couponSeriesSlice/couponSeries'
import React, { useEffect, useState } from 'react'
import { CouponSeriesCoulumns } from '../couponSeriesUtils/CouponSeriesColumns'
import { Button, Input, Pagination, Select } from '@/components/ui'
import { HiSearch } from 'react-icons/hi'
import EasyTable from '@/common/EasyTable'
import { Option } from '@/views/org-management/sellers/sellerCommon'
import { pageSizeOptions } from '@/views/category-management/orderlist/commontypes'
import { useLocation, useNavigate } from 'react-router-dom'
import { CouponDiscountTypeArray, CouponTypeArray } from '@/constants/commonArray.constant'
import CommonDropdown from '@/common/commonDropdown'
import { handleSelectCoupons } from '../couponSeriesUtils/couponSeriesFunctions'
import NotFoundData from '@/views/pages/NotFound/Notfound'

const CouponSeriesTable = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const location = useLocation()
    const { campaignId } = location.state || {}
    const [searchOnEnter, setSearchOnEnter] = useState('')
    const [currentCouponSelect, setCurrentCouponSelect] = useState<Record<string, string>>()
    const [currentDiscountTypeSelect, setCurrentDiscountTypeSelect] = useState<Record<string, string>>()
    const { couponSeries, count, page, pageSize } = useAppSelector<CouponSeriesInitialTypes>((state) => state.couponSeries)
    const { data: couponSeriesData, isSuccess } = couponSeriesService.useCouponSeriesQuery(
        {
            page: page,
            pageSize: pageSize,
            campaign: searchOnEnter ?? null,
            discount_type: currentDiscountTypeSelect?.value ?? undefined,
            coupon_type: currentCouponSelect?.value ?? undefined,
            id: campaignId ?? undefined,
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(setCouponSeriesData(couponSeriesData?.data?.results))
            dispatch(setCount(couponSeriesData?.data?.count))
        }
    }, [isSuccess, couponSeriesData?.data?.results, dispatch, couponSeriesData?.data?.count, searchOnEnter])

    const columns = CouponSeriesCoulumns()

    return (
        <div>
            <div className="flex justify-between mb-10">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md">
                    <Input
                        placeholder="search..."
                        type="search"
                        value={globalFilter || ''}
                        className="w-[150px] xl:w-[250px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setGlobalFilter(e.target.value)
                        }}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                setSearchOnEnter(e.target.value)
                            }
                        }}
                    />
                    <div className="bg-blue-500 hover:bg-blue-400 p-2 rounded-xl cursor-pointer">
                        <HiSearch className="text-white  dark:text-gray-400 text-xl" onClick={() => setSearchOnEnter(globalFilter)} />
                    </div>

                    <CommonDropdown
                        label="Discount Type"
                        currentSelectedPage={currentDiscountTypeSelect || {}}
                        setCurrentSelectedPage={setCurrentDiscountTypeSelect}
                        SEARCHOPTIONS={CouponDiscountTypeArray}
                        handleSelect={(val) =>
                            handleSelectCoupons({
                                value: val,
                                CouponArray: CouponDiscountTypeArray,
                                setSelectedData: setCurrentDiscountTypeSelect,
                            })
                        }
                    />
                    <CommonDropdown
                        label="Coupon Type"
                        currentSelectedPage={currentCouponSelect || {}}
                        setCurrentSelectedPage={setCurrentCouponSelect}
                        SEARCHOPTIONS={CouponTypeArray}
                        handleSelect={(val) =>
                            handleSelectCoupons({ value: val, CouponArray: CouponTypeArray, setSelectedData: setCurrentCouponSelect })
                        }
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="new" size="sm" onClick={() => navigate(`/app/appSettings/couponsSeries/addNew`)}>
                        Add Coupon Series
                    </Button>
                    <Button variant="new" size="sm" onClick={() => navigate(`/app/appSettings/couponsGenerate/generateCoupons`)}>
                        Add Coupons
                    </Button>
                </div>
            </div>

            <div>
                {couponSeries && couponSeries.length > 0 ? (
                    <EasyTable columns={columns} mainData={couponSeries || []} page={page} pageSize={pageSize} />
                ) : (
                    <>
                        <div className="flex flex-col items-center justify-center mt-20">
                            <NotFoundData />
                            <p className="text-gray-500 text-lg">Select Store to access Coupon Series </p>
                        </div>
                    </>
                )}
                {couponSeries && couponSeries.length > 0 && (
                    <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                        <Pagination
                            pageSize={pageSize}
                            currentPage={page}
                            total={count}
                            className="mb-4 md:mb-0"
                            onChange={(page) => {
                                dispatch(setPage(page))
                            }}
                        />

                        <div className="min-w-[130px] flex gap-5">
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                onChange={(option) => {
                                    if (option) {
                                        dispatch(setPageSize(option.value))
                                        dispatch(setPage(1))
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CouponSeriesTable
