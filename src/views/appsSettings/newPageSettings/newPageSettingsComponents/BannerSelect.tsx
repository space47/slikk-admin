/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, Input } from '@/components/ui'
import React, { useEffect, useState } from 'react'

interface Banner {
    id: string
    name: string
    image: string
}

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    values: any
    setFieldValues: any
    bannerData: Banner[]
}

const BannerSelect = ({ bannerData, isOpen, setFieldValues, setIsOpen, values }: Props) => {
    const [selectedBanners, setSelectedBanners] = useState<Banner[]>(
        bannerData.filter((b) => values?.banners?.map((item: any) => item?.id).includes(b.id)),
    )

    const [search, setSearch] = useState<string>('')

    useEffect(() => {
        if (isOpen) {
            const selected = bannerData.filter((b) => values?.banners?.map((item: any) => item?.id).includes(b.id))
            setSelectedBanners(selected)
            setSearch('') // reset search on open
        }
    }, [isOpen, bannerData, values?.banners])

    const handleCheckboxChange = (banner: Banner) => {
        setSelectedBanners((prev) => (prev.some((b) => b.id === banner.id) ? prev.filter((b) => b.id !== banner.id) : [...prev, banner]))
    }

    const handleSubmit = () => {
        setFieldValues('banners', selectedBanners)
        setIsOpen(false)
    }

    const isSelected = (bannerId: string) => selectedBanners.some((b) => b.id === bannerId)

    const filteredBanners = bannerData.filter((banner) => banner.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={800}>
            <div className="max-h-[70vh] overflow-y-auto p-4 mt-10 scrollbar-hide">
                <h2 className="text-xl font-semibold mb-4">Select Banners</h2>

                <Input
                    placeholder="Search by banner name..."
                    className="mb-4"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="space-y-4">
                    {filteredBanners.length > 0 ? (
                        filteredBanners.map((banner) => (
                            <div
                                key={banner.id}
                                onClick={() => handleCheckboxChange(banner)}
                                className={`flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                                    isSelected(banner.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected(banner.id)}
                                    onChange={() => handleCheckboxChange(banner)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-4"
                                />
                                <img src={banner.image} alt={banner.name} className="w-24 h-16 object-cover rounded-md" />
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg font-medium">{banner.name}</h3>
                                    <p className="text-sm text-gray-500">ID: {banner.id}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-center py-10">No banners found</div>
                    )}
                </div>
            </div>

            <div className="flex justify-end p-4 border-t">
                <Button variant="reject" type="button" onClick={() => setIsOpen(false)} className="mr-2">
                    Cancel
                </Button>
                <Button variant="accept" type="button" onClick={handleSubmit} disabled={selectedBanners.length === 0}>
                    Apply ({selectedBanners.length})
                </Button>
            </div>
        </Dialog>
    )
}

export default BannerSelect
