/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui'
import React, { useEffect, useState } from 'react'

interface Banner {
    id: string
    name: string
    image: string
}

interface Props {
    values: any
    setFieldValues: any
    bannerData: Banner[]
}

const BannerFields = ({ bannerData, setFieldValues, values }: Props) => {
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(bannerData.find((b) => values?.banners?.[0]?.id === b.id) || null)
    const [search, setSearch] = useState<string>('')

    useEffect(() => {
        const initial = bannerData.find((b) => values?.banners === b.id) || null
        setSelectedBanner(initial)
        setSearch('')
    }, [bannerData, values?.banners])

    const handleSelect = (banner: Banner) => {
        const newSelection = selectedBanner?.id === banner.id ? null : banner
        setSelectedBanner(newSelection)
        setFieldValues('banners', newSelection ? [newSelection] : [])
    }

    const isSelected = (bannerId: string) => selectedBanner?.id === bannerId

    const filteredBanners = bannerData.filter((banner) => banner.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="max-h-[60vh] overflow-y-auto mt-6 bg-white shadow-inner rounded-2xl border border-gray-200">
            <div className="sticky top-0 z-20 bg-white pt-6 pb-4 px-6 border-b border-gray-100 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Select a Banner</h2>
                <Input
                    placeholder="Search by banner name..."
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
            </div>
            <div className="p-6 space-y-5 grid grid-cols-2 gap-3">
                {filteredBanners.length > 0 ? (
                    filteredBanners.map((banner) => (
                        <div
                            key={banner.id}
                            onClick={() => handleSelect(banner)}
                            className={`group flex items-center p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                                isSelected(banner.id)
                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-100 shadow-sm'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <input
                                type="radio"
                                name="banner"
                                defaultChecked={isSelected(banner.id)}
                                onChange={() => handleSelect(banner)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 mr-4 cursor-pointer accent-blue-600"
                            />

                            <img
                                src={banner.image}
                                alt={banner.name}
                                className="w-28 h-20 object-cover rounded-lg border border-gray-200 group-hover:scale-[1.02] transition-transform duration-300"
                            />

                            <div className="ml-5 flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 leading-tight">{banner.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    ID: <span className="font-medium text-gray-600">{banner.id}</span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center py-10">No banners found</div>
                )}
            </div>
        </div>
    )
}

export default BannerFields
