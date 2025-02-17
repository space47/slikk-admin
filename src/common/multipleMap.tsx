/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt } from 'react-icons/fa'
import axios from 'axios'
import _, { sum } from 'lodash'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { MdClose, MdFullscreen } from 'react-icons/md'
import { BsFullscreenExit } from 'react-icons/bs'
import 'leaflet.heat'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'

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
const completedIcon = L.icon({
    iconUrl: '/img/logo/greenMarker.png',
    iconSize: [40, 45],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})
const midIcon = L.icon({
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
}

interface CenterProps {
    setCenter?: any
    currLat: any
    currLong: any
}

const CurrentLocationButton = ({ currLat, currLong }: CenterProps) => {
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

// Marker
interface MarkerComponentProps {
    markers: any[]
    currLat?: any
    currLong?: any
    distanceAboveThirty?: any
    distanceBetweenFifteenToThirty?: any
    distanceBelowTen?: any
    distanceBelowTentoFifteen?: any
    CurrentStatus?: any
}

const MarkerComponent = ({
    markers,
    currLat,
    currLong,
    distanceAboveThirty,
    distanceBetweenFifteenToThirty,
    distanceBelowTen,
    distanceBelowTentoFifteen,
    CurrentStatus,
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

    return (
        <div>
            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    position={[marker.lat, marker.lon]}
                    icon={['PENDING', 'DECLINED', 'CANCELLED'].includes(marker?.status) ? officeIcon : DefaultIcon}
                >
                    <Popup>
                        <div>
                            <p>Amount: Rs.{marker.amount}</p>
                            <p>Distance: {marker.distance} km</p>
                            <p>Status: {marker.status} </p>
                        </div>
                    </Popup>
                </Marker>
            ))}

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

const HeatMapComponent = ({ markers }: { markers: any[] }) => {
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

interface FullScreenMapProps {
    currLat: number
    currLong: number
    markers?: any[]
    style?: React.CSSProperties
    currentPage: string
}

const FullScreenMap = ({ currLat, currLong, markers, style = { height: '70vh', width: '100%' }, currentPage }: FullScreenMapProps) => {
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

    console.log('Current Page Name', currentPage)

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
                    {currentPage === 'marker' && <MarkerComponent currLat={currLat} currLong={currLong} markers={markers} />}
                    {currentPage === 'heat_map' && <HeatMapComponent markers={markers} />}
                </MapContainer>
            )}
        </div>
    )
}

const MAP_STYLE_ARRAY = [
    { name: 'Marker', value: 'marker' },
    { name: 'HeatMap', value: 'heat_map' },
]

const MultipleMap: React.FC<MultipleMapProps> = ({ latitudes, longitudes, amount, currentStatus }) => {
    const [currLat, setCurrLat] = useState(12.9014)
    const [currLong, setCurrLong] = useState(77.65122)
    const R = 6371
    const [location, setLocation] = useState('')
    const [suggestions, setSuggestions] = useState<any>([])
    const [distanceBelowTen, setDistanceBelowTen] = useState<any[]>([])
    const [distanceBelowTentoFifteen, setDistanceBelowTentoFifteen] = useState<any[]>([])
    const [distanceBelowFifteenToThirty, setDistanceBelowFifteenToThirty] = useState<any[]>([])
    const [distanceAboveThirty, setDistanceAboveThirty] = useState<any[]>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(MAP_STYLE_ARRAY[0])

    const MAP_KEY = import.meta.env.VITE_OLA_API_KEY

    const handleSearchLocation = useCallback(
        _.debounce(async (query: string) => {
            if (!query) {
                setSuggestions([])
                return
            }

            console.log('Debounce query', query)
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

    const markers = useMemo(() => {
        const belowTen: any[] = []
        const tenToFifteen: any[] = []
        const fifteenToThirty: any[] = []
        const aboveThirty: any[] = []

        const result = latitudes.map((lat, index) => {
            const lon = longitudes[index]
            const dLat = (lat - currLat) * (Math.PI / 180)
            const dLon = (lon - currLong) * (Math.PI / 180)
            const status = currentStatus[index]

            const rLat1 = currLat * (Math.PI / 180)
            const rLat2 = lat * (Math.PI / 180)

            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

            const distance = parseFloat((R * c).toFixed(2))

            if (distance <= 10) {
                belowTen.push({ lat, lon, amount: amount[index], distance })
            } else if (distance > 10 && distance <= 15) {
                tenToFifteen.push({ lat, lon, amount: amount[index], distance })
            } else if (distance > 15 && distance <= 20) {
                fifteenToThirty.push({ lat, lon, amount: amount[index], distance })
            } else {
                aboveThirty.push({ lat, lon, amount: amount[index], distance })
            }

            return { lat, lon, amount: amount[index], distance, status }
        })

        setDistanceBelowTen(belowTen)
        setDistanceBelowTentoFifteen(tenToFifteen)
        setDistanceBelowFifteenToThirty(fifteenToThirty)
        setDistanceAboveThirty(aboveThirty)

        return result
    }, [latitudes, longitudes, amount, currLat, currLong, R])

    console.log('bwlow ten', distanceBelowTen)

    const sumsConvertToNumber = markers?.map((item) => parseInt(item?.amount))
    const sumsofAmount = _.sum(sumsConvertToNumber)
    const avgofAmount = _.mean(sumsConvertToNumber)
    console.log('sum of amount', avgofAmount)

    const calculateSum = (distanceArray: any[]): number => {
        const numbers = distanceArray?.map((item) => parseInt(item?.amount, 10) || 0)
        return numbers.length === 0 ? 0 : _.sum(numbers)
    }

    const calculateAverage = (distanceArray: any[]): number => {
        const numbers = distanceArray?.map((item) => parseInt(item?.amount, 10) || 0)
        return numbers.length === 0 ? 0 : _.mean(numbers)
    }

    const calculatePerSquareCount = (distanceArrays: any[][], area: number): number => {
        if (area === 0 || !distanceArrays) return 0
        const totalSum = distanceArrays.reduce((sum, array) => sum + calculateSum(array), 0)
        return totalSum / area
    }

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

    return (
        <div className="flex flex-col gap-4">
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
                        />
                    )}
                    {currentSelectedPage?.value === 'heat_map' && <HeatMapComponent markers={markers} />}
                    <FullScreenMap currLat={currLat} currLong={currLong} markers={markers} currentPage={currentSelectedPage?.value} />
                </MapContainer>
                <div className="space-y-2  xl:w-[300px]">
                    {Belowdatas.map((item, key) => (
                        <div key={key} className="flex flex-col  bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm">
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
        </div>
    )
}

export default MultipleMap
