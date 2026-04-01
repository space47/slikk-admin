/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaCheckCircle, FaInfoCircle, FaMapMarkerAlt, FaRoute } from 'react-icons/fa'
import axios from 'axios'
import _ from 'lodash'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { MdClearAll, MdFullscreen } from 'react-icons/md'
import { BsFullscreenExit } from 'react-icons/bs'
import 'leaflet.heat'
import { Button, Dropdown, Select } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { companyStore } from '@/store/types/companyStore.types'
import store, { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { EOrderStatus } from '@/views/sales/OrderDetails/orderList.common'
import { IoCloseCircle } from 'react-icons/io5'
import AssignRiderHomeModal from '@/views/homePage/homes/componentsHomes/AssignRiderHomeModal'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
})

L.Marker.prototype.options.icon = DefaultIcon

const officeIcon = L.icon({
    iconUrl: '/img/logo/location-pin.png',
    iconSize: [35, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})
const wareHouseIcon = L.icon({
    iconUrl: '/img/logo/slikkWare.png',
    iconSize: [35, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})
const blackIcon = L.icon({
    iconUrl: '/img/logo/blackImageMarker.png',
    iconSize: [40, 45],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})
const orangeIcon = L.icon({
    iconUrl: '/img/logo/orangeMarker.png',
    iconSize: [40, 45],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})
const yellowIcon = L.icon({
    iconUrl: '/img/logo/yellowMaker.png',
    iconSize: [40, 45],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

interface MultipleMapProps {
    latitudes: number[]
    longitudes: number[]
    amount: any[]
    currentStatus: string[]
    currentInvoice: string[]
    setSelectedStatus: (status: string[]) => void
    currentDistance: number[]
}

interface CenterProps {
    setCenter?: any
    currLat: any
    currLong: any
}

const CurrentLocationButton: React.FC<CenterProps> = ({ currLat, currLong }) => {
    const map = useMap()
    const handleClick = () => {
        map.setView([currLat, currLong], 13)
    }

    return (
        <button
            style={{
                position: 'absolute',
                bottom: '3px',
                right: '10px',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '20%',
                padding: '10px',
                boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                zIndex: 1000,
            }}
            onClick={handleClick}
        >
            <FaMapMarkerAlt size={24} color="black" />
        </button>
    )
}
CurrentLocationButton.displayName = 'CurrentLocationButton'
interface MarkerComponentProps {
    markers: any[]
    currLat?: any
    currLong?: any
    distanceAboveThirty?: any
    distanceBetweenFifteenToThirty?: any
    distanceBelowTen?: any
    distanceBelowTentoFifteen?: any
    CurrentStatus?: any
    selectedInvoices?: string[]
    onMarkerClick?: (invoiceId: string, lat: number, lon: number) => void
}

const MarkerComponent: React.FC<MarkerComponentProps> = ({
    markers,
    currLat,
    currLong,
    distanceAboveThirty,
    distanceBetweenFifteenToThirty,
    distanceBelowTen,
    distanceBelowTentoFifteen,
    selectedInvoices = [],
    onMarkerClick,
}: MarkerComponentProps) => {
    const map = useMap()

    useEffect(() => {
        let currPos = 13

        const countAboveThirty = distanceAboveThirty
        const countBetweenFifteenToThirty = distanceBetweenFifteenToThirty
        const countBelowTen = distanceBelowTen
        const countBelowTentoFifteen = distanceBelowTentoFifteen

        const maxCount = Math.max(countAboveThirty, countBetweenFifteenToThirty, countBelowTen, countBelowTentoFifteen)

        if (maxCount === countAboveThirty) {
            currPos = 5
        } else if (maxCount === countBetweenFifteenToThirty) {
            currPos = 8
        } else if (maxCount === countBelowTen) {
            currPos = 12
        } else if (maxCount === countBelowTentoFifteen) {
            currPos = 10
        }

        map.setView([currLat, currLong], currPos)
    }, [currLat, currLong, map, distanceAboveThirty, distanceBetweenFifteenToThirty, distanceBelowTen, distanceBelowTentoFifteen])

    const handleMarkerClick = (marker: any, event: any) => {
        const allowedStatuses = ['PACKED', 'DELIVERY_CREATED']

        if (allowedStatuses.includes(marker?.status) && onMarkerClick) {
            event.originalEvent?.stopPropagation?.()
            onMarkerClick(marker.invoice_id, marker.lat, marker.lon)
        }
    }

    const getMarkerIcon = (marker: any) => {
        const isSelected = selectedInvoices.includes(marker?.invoice_id)

        if (isSelected) {
            return yellowIcon
        }

        if (['PENDING', 'ACCEPTED', 'PACKED'].includes(marker?.status)) {
            const showMarker = isSelected ? '' : officeIcon
            return showMarker
        } else if (marker?.status === 'EXCHANGE') {
            return orangeIcon
        } else if (['DECLINED', 'CANCELLED'].includes(marker?.status)) {
            return blackIcon
        }
        return DefaultIcon
    }

    return (
        <div>
            {markers.map((marker, index) => {
                const allowedStatuses = ['PACKED', 'DELIVERY_CREATED']
                const isClickable = allowedStatuses.includes(marker?.status)
                const isSelected = selectedInvoices.includes(marker?.invoice_id)

                return (
                    <Marker
                        key={index}
                        position={[marker.lat, marker.lon]}
                        icon={getMarkerIcon(marker)}
                        eventHandlers={{
                            mouseover: (e) => {
                                e.target.openPopup()
                            },
                            click: (e) => {
                                if (isClickable && onMarkerClick) {
                                    e.target.openPopup()
                                    handleMarkerClick(marker, e)
                                } else {
                                    e.target.openPopup()
                                    window.open(`/app/orders/${marker?.invoice_id}`, '_blank', 'noopener,noreferrer')
                                }
                            },
                            mouseout: (e) => {
                                e.target.closePopup()
                            },
                        }}
                    >
                        <Popup className="hover:bg-blue-50">
                            <div>
                                <div className="flex items-center justify-start ">
                                    <p
                                        className={`p-2 rounded-xl text-white ${isSelected ? 'bg-green-500' : isClickable ? 'bg-blue-500' : 'bg-red-500'}`}
                                    >
                                        {marker?.invoice_id}
                                        {isSelected && ' ✓'}
                                    </p>
                                </div>
                                <p>Amount: Rs.{marker.amount}</p>
                                <p>Distance: {marker.distance} km</p>
                                <p>Status: {marker.status}</p>
                                {isClickable && (
                                    <p className="text-blue-500 text-sm mt-1">{isSelected ? 'Click to deselect' : 'Click to select'}</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                )
            })}

            <Marker position={[currLat, currLong]} icon={wareHouseIcon}>
                <Popup>
                    <div>
                        <p>SlikkSync Technologies</p>
                    </div>
                </Popup>
            </Marker>

            <CurrentLocationButton setCenter={() => {}} currLat={currLat} currLong={currLong} />
        </div>
    )
}
MarkerComponent.displayName = 'MarkerComponent'

const HeatMapComponent: React.FC<{ markers: any[] }> = ({ markers }) => {
    const map = useMap()
    useEffect(() => {
        const heatLayer = L.heatLayer(
            markers.map((marker) => [marker.lat, marker.lon, marker.amount || 1]),
            { radius: 25, blur: 15, maxZoom: 17 },
        )
        heatLayer.addTo(map)

        return () => {
            map.removeLayer(heatLayer)
        }
    }, [markers, map])

    return null
}
HeatMapComponent.displayName = 'HeatMapComponent'

interface FullScreenMapProps {
    currLat: number
    currLong: number
    markers?: any[]
    style?: React.CSSProperties
    currentPage: string
}

const FullScreenMap: React.FC<FullScreenMapProps> = ({
    currLat,
    currLong,
    markers,
    style = { height: '70vh', width: '100%' },
    currentPage,
}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const [isFullScreen, setIsFullScreen] = useState(false)

    const toggleFullScreen = () => {
        if (mapContainerRef.current) {
            if (!document.fullscreenElement) {
                mapContainerRef.current
                    .requestFullscreen()
                    .then(() => {
                        setIsFullScreen(true)
                    })
                    .catch((err) => {
                        console.error('Error attempting to enable fullscreen mode:', err)
                    })
            } else {
                document
                    .exitFullscreen()
                    .then(() => {
                        setIsFullScreen(false)
                    })
                    .catch((err) => {
                        console.error('Error attempting to exit fullscreen mode:', err)
                    })
            }
        }
    }

    return (
        <div ref={mapContainerRef} style={{ position: 'relative', ...style }}>
            <button
                onClick={toggleFullScreen}
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1000,
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                {isFullScreen ? <BsFullscreenExit className="text-2xl font-bold" /> : <MdFullscreen className="text-2xl font-bold" />}
            </button>
            {isFullScreen && (
                <MapContainer center={[currLat, currLong]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {currentPage === 'marker' && <MarkerComponent currLat={currLat} currLong={currLong} markers={markers as any} />}
                    {currentPage === 'heat_map' && <HeatMapComponent markers={markers as any} />}
                </MapContainer>
            )}
        </div>
    )
}
FullScreenMap.displayName = 'FullScreenMap'

const MAP_STYLE_ARRAY = [
    { name: 'Marker', value: 'marker' },
    { name: 'HeatMap', value: 'heat_map' },
]
const STATUS_ARRAY = [
    { name: 'ACCEPTED', value: EOrderStatus.accepted },
    { name: 'PACKED', value: EOrderStatus.packed },
    { name: 'PICKING', value: EOrderStatus.picking },
    { name: 'DELIVERY_CREATED', value: EOrderStatus.delivery_created },
    { name: 'PACKED+DC', value: `${EOrderStatus.packed},${EOrderStatus.delivery_created}` },
]

const MultipleMap: React.FC<MultipleMapProps> = ({
    latitudes,
    longitudes,
    amount,
    currentStatus,
    currentInvoice,
    currentDistance,
    setSelectedStatus,
}) => {
    const dispatch = useAppDispatch()
    const [currLat, setCurrLat] = useState<number>(12.920216)
    const [currLong, setCurrLong] = useState<number>(77.649326)
    const [location, setLocation] = useState('')
    const [suggestions, setSuggestions] = useState<any>([])
    const [distanceBelowTen, setDistanceBelowTen] = useState<any[]>([])
    const [distanceBelowTentoFifteen, setDistanceBelowTentoFifteen] = useState<any[]>([])
    const [distanceBelowFifteenToThirty, setDistanceBelowFifteenToThirty] = useState<any[]>([])
    const [distanceAboveThirty, setDistanceAboveThirty] = useState<any[]>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(MAP_STYLE_ARRAY[0])
    const { storeResults } = useAppSelector<companyStore>((state) => state.companyStore)
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
    const [showAssignRiderModal, setShowAssignRiderModal] = useState(false)
    const [selectedMarkers, setSelectedMarkers] = useState<any[]>([])
    const storeCodes = store.getState().storeSelect.store_ids

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    useEffect(() => {
        if (storeCodes && storeCodes.length > 0) {
            const data = storeResults?.find((item) => item.id === storeCodes[0])
            setCurrLat(data?.latitude || 0)
            setCurrLong(data?.longitude || 0)
        }
    }, [storeCodes, storeResults])

    const MAP_KEY = import.meta.env.VITE_OLA_API_KEY

    const handleSearchLocation = useCallback(
        _.debounce(async (query: string) => {
            if (!query) {
                setSuggestions([])
                return
            }
            try {
                const response = await axios.get(`https://api.olamaps.io/places/v1/autocomplete`, {
                    params: {
                        input: query,
                        language: 'English',
                        api_key: MAP_KEY,
                    },
                })

                const data = response.data?.predictions || []
                const names = data.map((result: any) => ({
                    name: result.description,
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                }))

                setSuggestions(names)
            } catch (error) {
                console.error('Error:', error)
            }
        }, 300),
        [],
    )

    const handleChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setLocation(value)
        handleSearchLocation(value)
    }

    const handleSelectSuggestion = (suggestion: any) => {
        setCurrLat(suggestion.lat)
        setCurrLong(suggestion.lng)
        setSuggestions([])
        setLocation(suggestion.name)
    }
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371
        const dLat = ((lat2 - lat1) * Math.PI) / 180
        const dLon = ((lon2 - lon1) * Math.PI) / 180
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    // Calculate all pairwise distances between selected markers
    const calculateAllDistances = () => {
        const distances: Array<{
            marker1: string
            marker2: string
            distance: number
        }> = []

        for (let i = 0; i < selectedMarkers.length; i++) {
            for (let j = i + 1; j < selectedMarkers.length; j++) {
                const distance = calculateDistance(
                    selectedMarkers[i].lat,
                    selectedMarkers[i].lon,
                    selectedMarkers[j].lat,
                    selectedMarkers[j].lon,
                )
                distances.push({
                    marker1: selectedMarkers[i].invoice_id,
                    marker2: selectedMarkers[j].invoice_id,
                    distance: distance,
                })
            }
        }

        // Sort distances by marker names for consistent display
        return distances.sort((a, b) => {
            const compare1 = a.marker1.localeCompare(b.marker1)
            if (compare1 !== 0) return compare1
            return a.marker2.localeCompare(b.marker2)
        })
    }

    // Handle marker click for selection - allows unlimited selections
    const handleMarkerClick = (invoiceId: string, lat: number, lon: number) => {
        setSelectedInvoices((prev) => {
            const isSelected = prev.includes(invoiceId)

            if (isSelected) {
                // Remove the marker
                setSelectedMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.invoice_id !== invoiceId))
                return prev.filter((id) => id !== invoiceId)
            } else {
                // Add the marker
                setSelectedMarkers((prev) => [...prev, { invoice_id: invoiceId, lat, lon }])
                return [...prev, invoiceId]
            }
        })
    }

    const markers = useMemo(() => {
        const belowTen: any[] = []
        const tenToFifteen: any[] = []
        const fifteenToThirty: any[] = []
        const aboveThirty: any[] = []
        const result = latitudes.map((lat, index) => {
            const lon = longitudes[index]
            const status = currentStatus[index]
            const invoice_id = currentInvoice[index] ?? ''
            const distance = currentDistance[index] || 0

            if (distance <= 10) {
                belowTen.push({ lat, lon, amount: amount[index], distance, status, invoice_id })
            } else if (distance > 10 && distance <= 15) {
                tenToFifteen.push({ lat, lon, amount: amount[index], distance, status, invoice_id })
            } else if (distance > 15 && distance <= 20) {
                fifteenToThirty.push({ lat, lon, amount: amount[index], distance, status, invoice_id })
            } else {
                aboveThirty.push({ lat, lon, amount: amount[index], distance, status, invoice_id })
            }
            return { lat, lon, amount: amount[index], distance, status, invoice_id }
        })

        setDistanceBelowTen(belowTen)
        setDistanceBelowTentoFifteen(tenToFifteen)
        setDistanceBelowFifteenToThirty(fifteenToThirty)
        setDistanceAboveThirty(aboveThirty)
        return result
    }, [latitudes, longitudes, amount, currentStatus, currentInvoice, currentDistance])

    const calculateSum = useCallback((distanceArray: any[]): number => {
        const numbers = distanceArray?.map((item) => parseInt(item?.amount, 10) || 0)
        return numbers.length === 0 ? 0 : _.sum(numbers)
    }, [])

    const calculateAverage = useCallback((distanceArray: any[]): number => {
        const numbers = distanceArray?.map((item) => parseInt(item?.amount, 10) || 0)
        return numbers.length === 0 ? 0 : _.mean(numbers)
    }, [])

    const calculatePerSquareCount = useCallback(
        (distanceArrays: any[][], area: number): number => {
            if (area === 0 || !distanceArrays) return 0
            const totalSum = distanceArrays.reduce((sum, array) => sum + calculateSum(array), 0)
            return totalSum / area
        },
        [calculateSum],
    )

    const Belowdatas = [
        {
            name: 'Below 10 km',
            value: distanceBelowTen,
            total: calculateSum(distanceBelowTen),
            average: calculateAverage(distanceBelowTen),
            sqCount: calculatePerSquareCount([distanceBelowTen], 314.7),
        },
        {
            name: 'Between 10-15 km',
            value: distanceBelowTentoFifteen,
            total: calculateSum(distanceBelowTentoFifteen),
            average: calculateAverage(distanceBelowTentoFifteen),
            sqCount: calculatePerSquareCount([distanceBelowTen, distanceBelowTentoFifteen], 706.5),
        },
        {
            name: 'Between 15-20 km',
            value: distanceBelowFifteenToThirty,
            total: calculateSum(distanceBelowFifteenToThirty),
            average: calculateAverage(distanceBelowFifteenToThirty),
            sqCount: calculatePerSquareCount([distanceBelowTen, distanceBelowTentoFifteen, distanceBelowFifteenToThirty], 1256.24),
        },
        {
            name: 'Above 20 km',
            value: distanceAboveThirty,
            total: calculateSum(distanceAboveThirty),
            average: calculateAverage(distanceAboveThirty),
            sqCount: calculatePerSquareCount(
                [distanceBelowTen, distanceBelowTentoFifteen, distanceBelowFifteenToThirty, distanceAboveThirty],
                1256.24,
            ),
        },
    ]

    const handleSelectPage = (value: string) => {
        const selectedPage = MAP_STYLE_ARRAY.find((page) => page.value === value)
        if (selectedPage) setCurrentSelectedPage(selectedPage)
    }

    const allDistances = calculateAllDistances()

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-2">
                <div className="flex gap-4 ">
                    <div>
                        <input className="rounded-xl" placeholder="Enter location" value={location} onChange={handleChangeLocation} />
                        {suggestions.length > 0 && (
                            <ul className="mt-2 border rounded-xl bg-white shadow-md">
                                {suggestions.map((suggestion: any, index: any) => (
                                    <li
                                        key={index}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleSelectSuggestion(suggestion)}
                                    >
                                        {suggestion.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Display selected markers and distances */}
            {selectedMarkers.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 shadow-sm max-h-[500px] flex flex-col">
                    {/* Header with icon and count - Fixed at top */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-500 p-2 rounded-lg">
                                    <FaCheckCircle className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Selected Orders
                                    <span className="ml-2 text-sm font-normal text-gray-500">({selectedMarkers.length})</span>
                                </h3>
                            </div>
                            {selectedMarkers.length > 0 && (
                                <button
                                    onClick={() => {
                                        setSelectedInvoices([])
                                        setSelectedMarkers([])
                                    }}
                                    className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                                >
                                    <MdClearAll className="w-3 h-3" />
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Selected orders list - Scrollable */}
                    <div className="space-y-2 max-h-40 overflow-y-auto mb-4 pr-1 flex-shrink-0 custom-scrollbar">
                        {selectedMarkers.map((marker, idx) => (
                            <div
                                key={idx}
                                className="group flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <span className="text-sm font-mono font-medium text-gray-800">#{marker.invoice_id}</span>
                                        {marker.status && (
                                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                                {marker.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleMarkerClick(marker.invoice_id, marker.lat, marker.lon)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200"
                                    title="Remove from selection"
                                >
                                    <IoCloseCircle className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Distance Information Section - Scrollable */}
                    {selectedMarkers.length >= 2 && (
                        <div className="flex-1 flex flex-col min-h-0 mt-4 pt-4 border-t border-blue-200">
                            <div className="flex-shrink-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-indigo-100 p-1.5 rounded-lg">
                                        <FaRoute className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-700">Distance Between Orders</h4>
                                    <span className="text-xs text-gray-500 ml-auto">
                                        {allDistances.length} pair{allDistances.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Scrollable distance list */}
                            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 custom-scrollbar">
                                {allDistances.map((dist, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-100 hover:border-indigo-200 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                {dist.marker1}
                                            </span>
                                            <span>
                                                {'<'}---{'>'}
                                            </span>
                                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                {dist.marker2}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-bold text-indigo-600">{dist.distance.toFixed(2)}</span>
                                            <span className="text-xs text-gray-500">km</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedMarkers.length === 1 && (
                        <div className="flex-shrink-0 mt-4 pt-4 border-t border-blue-200">
                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                <div className="flex items-start gap-2">
                                    <FaInfoCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-yellow-800 font-medium">Only one order selected</p>
                                        <p className="text-xs text-yellow-600 mt-0.5">
                                            Select at least 2 orders to see distance comparisons
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Optional: Quick stats */}

                    <div className="flex-shrink-0 mt-3 pt-2">
                        <div className="flex justify-end">
                            <Button variant="new" size="sm" onClick={() => setShowAssignRiderModal(true)}>
                                Assign Rider
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-10 xl:flex-row">
                <MapContainer center={[currLat, currLong]} zoom={13} style={{ height: '70vh', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {currentSelectedPage?.value === 'marker' && (
                        <MarkerComponent
                            currLat={currLat}
                            currLong={currLong}
                            markers={markers}
                            distanceAboveThirty={distanceAboveThirty?.length}
                            distanceBetweenFifteenToThirty={distanceBelowFifteenToThirty?.length}
                            distanceBelowTen={distanceBelowTen?.length}
                            distanceBelowTentoFifteen={distanceBelowTentoFifteen?.length}
                            CurrentStatus={currentStatus}
                            selectedInvoices={selectedInvoices}
                            onMarkerClick={handleMarkerClick}
                        />
                    )}
                    {currentSelectedPage?.value === 'heat_map' && <HeatMapComponent markers={markers} />}
                    <FullScreenMap currLat={currLat} currLong={currLong} markers={markers} currentPage={currentSelectedPage?.value} />
                </MapContainer>
                <div className="space-y-2 xl:w-[300px]">
                    <div>
                        <div className="flex flex-col gap-3 mt-6 mb-10">
                            <div>Select Status</div>
                            <Select
                                isMulti
                                isClearable
                                placeholder="select status"
                                options={STATUS_ARRAY}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.value}
                                className="w-full"
                                onChange={(newVal) => {
                                    console.log('newVal', newVal)
                                    setSelectedStatus(newVal ? newVal.map((item) => item.value) : [])
                                }}
                            />
                        </div>
                    </div>
                    {Belowdatas.map((item, key) => (
                        <div key={key} className="flex flex-col bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">{item?.name}:</span>
                                <span className="text-sm text-blue-700">{item?.value?.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Total:</span>
                                <span className="text-sm text-blue-700">₹ {item?.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Average:</span>
                                <span className="text-sm text-blue-700">₹ {item?.average?.toFixed(2) ?? 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">sales/sq.km:</span>
                                <span className="text-sm text-blue-700">₹ {item?.sqCount?.toFixed(2) ?? 0}</span>
                            </div>
                        </div>
                    ))}
                    <div className="bg-gray-200 px-2 rounded-lg font-bold text-[17px] items-center flex justify-center">
                        <Dropdown
                            className="border bg-gray-200 text-black text-lg font-semibold"
                            title={currentSelectedPage.name}
                            onSelect={handleSelectPage}
                        >
                            {MAP_STYLE_ARRAY.map((item) => (
                                <DropdownItem key={item.value} eventKey={item.value}>
                                    {item.name}
                                </DropdownItem>
                            ))}
                        </Dropdown>
                    </div>
                </div>
            </div>
            {showAssignRiderModal && (
                <AssignRiderHomeModal
                    isOpen={showAssignRiderModal}
                    setIsOpen={setShowAssignRiderModal}
                    selectedInvoices={selectedInvoices}
                />
            )}
        </div>
    )
}

MultipleMap.displayName = 'MultipleMap'

export default MultipleMap
