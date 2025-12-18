/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents, Polygon, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import _ from 'lodash'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import axios from 'axios'
import { Point } from './riderZoneCommon'

const PinIcon = L.divIcon({
    html: `
    <div style="position: relative;">
      <div style="
        width: 20px;
        height: 20px;
        background: #dc2626;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      "></div>
    </div>
  `,
    className: 'custom-pin-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
})

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
})

L.Marker.prototype.options.icon = DefaultIcon
const MAP_KEY = import.meta.env.VITE_OLA_API_KEY

interface RiderAddProps {
    coOrdinates: number[][][]
    polygonPoints: Point[]
    setPolygonPoints: React.Dispatch<React.SetStateAction<Point[]>>
}

const RiderZoneMap = ({ coOrdinates, polygonPoints, setPolygonPoints }: RiderAddProps) => {
    const [position, setPosition] = useState<Point | null>(null)
    const [markLat, setMarkLat] = useState(12.918226626575006)
    const [markLong, setMarkLong] = useState(77.62021285911175)
    const [isDrawing, setIsDrawing] = useState(false)
    const defaultCenter: [number, number] = [12.918226626575006, 77.62021285911175]
    const [location, setLocation] = useState('')
    const [suggestions, setSuggestions] = useState<any>([])
    const [locationName, setLocationName] = useState('')

    useEffect(() => {
        if (coOrdinates && coOrdinates.length > 0 && coOrdinates[0].length > 0) {
            const points = coOrdinates[0].map((coord: number[]) => ({
                lng: coord[0],
                lat: coord[1],
            }))
            setPolygonPoints(points)
            if (points.length > 0) {
                setPosition(points[0])
                setMarkLat(points[0].lat)
                setMarkLong(points[0].lng)
            }
        }
    }, [coOrdinates, setPolygonPoints])
    const getCoordinatesFormat = useCallback(() => {
        return [polygonPoints.map((point) => [point.lng, point.lat])]
    }, [polygonPoints])

    useEffect(() => {
        const controller = new AbortController()
        const fetchLocationName = async () => {
            const parameters = {
                location: `${markLat},${markLong}`,
                api_key: MAP_KEY,
            }
            try {
                const response = await axios.get(`https://api.olamaps.io/places/v1/nearbysearch`, {
                    params: parameters,
                })
                const data = response?.data?.predictions[0]?.description
                setLocationName(data)
            } catch (error) {
                console.log('Failed to load')
            }
        }
        fetchLocationName()
        return () => {
            controller.abort()
        }
    }, [markLat, markLong])

    const handleSearchLocation = useCallback(
        _.debounce(async (query: string) => {
            if (!query) {
                setSuggestions([])
                return
            }
            try {
                const response = await axios.get('https://api.olamaps.io/places/v1/autocomplete', {
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
        setMarkLat(suggestion.lat)
        setMarkLong(suggestion.lng)
        setPosition({ lat: suggestion.lat, lng: suggestion.lng })
        setSuggestions([])
        setLocation(suggestion.name)
    }

    const SetView = ({ center }: { center: [number, number] }) => {
        const map = useMap()
        map.setView(center, map.getZoom())
        return null
    }

    const MapEvents = () => {
        useMapEvents({
            click: (e) => {
                if (isDrawing) {
                    const { lat, lng } = e.latlng
                    setPolygonPoints((prev) => [...prev, { lat, lng }])
                }
            },
        })
        return null
    }

    const handleClearPolygon = () => {
        setPolygonPoints([])
        setIsDrawing(false)
    }

    const handleCompletePolygon = () => {
        if (polygonPoints.length >= 3) {
            const firstPoint = polygonPoints[0]
            const lastPoint = polygonPoints[polygonPoints.length - 1]
            if (firstPoint.lat !== lastPoint.lat || firstPoint.lng !== lastPoint.lng) {
                const closedPolygon = [...polygonPoints, firstPoint]
                setPolygonPoints(closedPolygon)
            }
            setIsDrawing(false)
        }
    }

    const polygonLatLngs = polygonPoints.map((point) => [point.lat, point.lng] as [number, number])

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Location</label>
                        <div className="relative">
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter location name..."
                                type="search"
                                value={location}
                                onChange={handleChangeLocation}
                            />
                            {suggestions.length > 0 && (
                                <ul className="absolute z-[1001] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {suggestions.map((suggestion: any, index: number) => (
                                        <li
                                            key={index}
                                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                            onClick={() => handleSelectSuggestion(suggestion)}
                                        >
                                            <div className="font-medium text-gray-900">{suggestion.name}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 mb-1">Current Location</span>
                        <span className="text-lg font-semibold text-gray-900">{locationName || 'Loading...'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <div className="flex flex-wrap gap-2">
                        <button
                            disabled={isDrawing}
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            onClick={() => setIsDrawing(true)}
                        >
                            Set Zone
                        </button>
                        <button
                            disabled={!isDrawing || polygonPoints.length < 3}
                            type="button"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            onClick={handleCompletePolygon}
                        >
                            Complete Setting Zone
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            onClick={handleClearPolygon}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden lg:w-2/3 flex justify-center items-center">
                    <MapContainer
                        center={position ? [position.lat, position.lng] : defaultCenter}
                        zoom={13}
                        style={{
                            height: '70vh',
                            width: '100%',
                            cursor: isDrawing ? 'crosshair' : 'grab',
                        }}
                        className="rounded-lg"
                    >
                        <SetView center={position ? [position.lat, position.lng] : defaultCenter} />
                        <MapEvents />
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {polygonPoints.length > 0 && (
                            <>
                                {polygonPoints.length >= 3 && (
                                    <Polygon
                                        positions={polygonLatLngs}
                                        pathOptions={{
                                            color: '#2563eb',
                                            fillColor: '#3b82f6',
                                            fillOpacity: 0.3,
                                            weight: 3,
                                        }}
                                    />
                                )}
                                <Polyline
                                    positions={polygonLatLngs}
                                    pathOptions={{
                                        color: '#dc2626',
                                        weight: 2,
                                        dashArray: '5, 5',
                                    }}
                                />
                                {polygonPoints.map((point, index) => (
                                    <Marker
                                        key={index}
                                        position={[point.lat, point.lng]}
                                        icon={PinIcon}
                                        eventHandlers={{
                                            click: () => {
                                                setPolygonPoints((prev) => prev.filter((_, idx) => idx !== index))
                                            },
                                        }}
                                    />
                                ))}
                            </>
                        )}
                    </MapContainer>
                </div>

                {polygonPoints.length > 0 && (
                    <div className="lg:w-1/3">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-full">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <strong className="text-gray-900">Polygon Coordinates</strong>
                            </div>

                            <pre className="text-xs text-gray-700 bg-white p-3 rounded border border-gray-300 overflow-auto h-[500px]">
                                {JSON.stringify(getCoordinatesFormat(), null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RiderZoneMap
