/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents, Polygon, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { Point } from './riderZoneCommon'
import { Button, Card, Input } from '@/components/ui'

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
interface RiderAddProps {
    coOrdinates: number[][][]
    polygonPoints: Point[]
    setPolygonPoints: React.Dispatch<React.SetStateAction<Point[]>>
}

const RiderZoneMap = ({ coOrdinates, polygonPoints, setPolygonPoints }: RiderAddProps) => {
    const [position, setPosition] = useState<Point | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [latAndLong, setLatAndLong] = useState('')
    const isDrawingRef = useRef(isDrawing)
    const defaultCenter: [number, number] = [12.918226626575006, 77.62021285911175]

    useEffect(() => {
        isDrawingRef.current = isDrawing
    }, [isDrawing])

    useEffect(() => {
        if (coOrdinates && coOrdinates.length > 0 && coOrdinates[0].length > 0) {
            const points = coOrdinates[0].map((coord: number[]) => ({
                lng: coord[0],
                lat: coord[1],
            }))
            setPolygonPoints(points)
            if (points.length > 0) {
                setPosition(points[0])
            }
        }
    }, [coOrdinates, setPolygonPoints])
    const getCoordinatesFormat = useCallback(() => {
        return [polygonPoints.map((point) => [point.lng, point.lat])]
    }, [polygonPoints])

    const SetView = ({ center }: { center: [number, number] }) => {
        const map = useMap()
        map.setView(center, map.getZoom())
        return null
    }

    const handleGenerateMarker = () => {
        if (!latAndLong) {
            return
        }
        const parts = latAndLong.split(',')
        if (parts.length !== 2) return
        const lat = parseFloat(parts[0].trim())
        const lng = parseFloat(parts[1].trim())
        if (isNaN(lat) || isNaN(lng)) return
        setPosition({ lat, lng })
    }

    const MapEvents = () => {
        useMapEvents({
            click: (e) => {
                if (isDrawingRef.current) {
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
                <Card>
                    <div className="flex gap-2 items-center mt-3 mb-6">
                        <Input
                            placeholder="Enter Lat, Long (e.g. 12.9716, 77.5946)"
                            value={latAndLong}
                            onChange={(e) => setLatAndLong(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                        <Button variant="new" type="button" onClick={handleGenerateMarker}>
                            Generate
                        </Button>
                    </div>
                </Card>
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
                                                if (!isDrawingRef.current) return
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
