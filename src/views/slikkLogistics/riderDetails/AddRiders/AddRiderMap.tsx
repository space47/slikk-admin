/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import _ from 'lodash'
import * as L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
})

L.Marker.prototype.options.icon = DefaultIcon

interface RiderAddProps {
    markLat: number
    markLong: number
    setMarkLat: React.Dispatch<React.SetStateAction<number>>
    setMarkLong: React.Dispatch<React.SetStateAction<number>>
}

const AddRiderMap = ({ setMarkLat, setMarkLong }: RiderAddProps) => {
    const [currLat, setCurrLat] = useState<number>(12.920216)
    const [currLong, setCurrLong] = useState<number>(77.649326)
    const [location, setLocation] = useState('')
    const [suggestions, setSuggestions] = useState<any>([])
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
    const MAP_KEY = import.meta.env.VITE_OLA_API_KEY

    const SetView = ({ center }: { center: [number, number] }) => {
        const map = useMap()
        map.setView(center, map.getZoom())
        return null
    }

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
        // setPosition({ lat: suggestion.lat, lng: suggestion.lng })
        setSuggestions([])
        setLocation(suggestion.name)
    }

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng
                setMarkLat(lat)
                setMarkLong(lng)
                setPosition({ lat, lng })
            },
        })

        return position ? <Marker position={position} /> : null
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
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

            <div className="flex flex-col gap-10 xl:flex-row">
                <MapContainer center={[currLat, currLong]} zoom={13} style={{ height: '70vh', width: '100%', cursor: 'pointer' }}>
                    <SetView center={[currLat, currLong]} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                </MapContainer>
            </div>
        </div>
    )
}

export default AddRiderMap
