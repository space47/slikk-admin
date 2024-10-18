import React, { useState } from 'react'
import { GoogleMap, MarkerF, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api'
import axios from 'axios'

const mapStyle = {
    height: '450px',
    width: '100%',
}

const GMap = ({ value, setValue, readMode }: any) => {
    let { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.MAPS_API_KEY || '',
        libraries: ['places'],
    })

    const [mapref, setMapRef] = useState<google.maps.Map>()
    const handleOnLoad = (map: google.maps.Map) => {
        setMapRef(map)
    }

    const [searchRef, setSearchRef] = useState<google.maps.places.SearchBox>()
    const handleSBonLoad = (sb: google.maps.places.SearchBox) => {
        setSearchRef(sb)
    }

    const handleCenterChanged = () => {
        if (mapref) {
            const newCenter = mapref.getCenter()
        }
    }

    const handleDrag = async () => {
        if (mapref) {
            const newCenter = mapref.getCenter()
            const lat = newCenter?.lat()
            const lng = newCenter?.lng()

            setDefaultLocation2({
                lat,
                lng,
            })
        }
    }

    const handleDragEnd = async () => {
        if (mapref) {
            const newCenter = mapref.getCenter()
            const lat = newCenter?.lat()
            const lng = newCenter?.lng()

            setDefaultLocation2({
                lat,
                lng,
            })

            let address = ''

            await axios
                .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.MAPS_API_KEY}`)
                .then((response) => {
                    const results = response.data.results
                    console.log('DATA2', results)
                    address = results[0].formatted_address
                })

            const data = {
                lat,
                lng,
                address,
            }
            console.log(data)

            setValue(data)
        }
    }

    const handlePlaceChanged = () => {
        const places = searchRef?.getPlaces()
        if (!places || places.length === 0) return
        const lat = places[0].geometry?.location?.lat()
        const lng = places[0].geometry?.location?.lng()
        const data = {
            lat,
            lng,
            address: places[0].formatted_address,
            name: places[0].name,
        }
        setValue(data)
    }

    const [defaultLocation, setDefaultLocation] = useState({
        lat: value.lat,
        lng: value.lng,
    })
    const [defaultLocation2, setDefaultLocation2] = useState({
        lat: value.lat,
        lng: value.lng,
    })

    return (
        <div className=" w-full relative border">
            {isLoaded ? (
                <GoogleMap
                    onLoad={handleOnLoad}
                    onCenterChanged={handleCenterChanged}
                    center={defaultLocation}
                    zoom={20}
                    mapContainerStyle={mapStyle}
                    clickableIcons={true}
                    options={{
                        fullscreenControl: false,
                        keyboardShortcuts: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        zoomControlOptions: {
                            position: 9,
                        },
                    }}
                    onDragEnd={handleDragEnd}
                    onDrag={handleDrag}
                >
                    {!readMode && (
                        <StandaloneSearchBox onPlacesChanged={handlePlaceChanged} onLoad={handleSBonLoad}>
                            <div className=" flex flex-row absolute items-center justify-center w-full mt-5">
                                <div className=" flex flex-row items-center w-full max-w-[350px] md:max-w-[400px] bg-primaryWhite border border-primaryGreyTxtColor rounded-md pr-2">
                                    <input
                                        className="h-10 w-full border-none text-[14px] rounded-md"
                                        placeholder="Search your building name, street, area"
                                        type="text"
                                    />
                                    <img src="/media/svg/search.svg" />
                                </div>
                            </div>
                        </StandaloneSearchBox>
                    )}
                    <MarkerF position={defaultLocation2} draggable={false} />
                </GoogleMap>
            ) : (
                <></>
            )}
        </div>
    )
}

export default GMap
