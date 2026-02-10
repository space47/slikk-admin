'use client'

import Hls from 'hls.js'
import { useEffect, useRef, useState } from 'react'
import { BsPlayCircle } from 'react-icons/bs'

interface VideoPlayerProps {
    url: string
    thumbnail: string
    aspectRatio: number
    radius?: number
    isPlayingVideo?: boolean
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, thumbnail, aspectRatio, radius, isPlayingVideo }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)
    const [aspectRatioVal, setAspectRatio] = useState(1)

    const handleMetadataLoad = (e) => {
        const { videoWidth, videoHeight } = e.target
        const newRatio = videoHeight ? videoWidth / videoHeight : 1
        setAspectRatio(newRatio)
    }
    useEffect(() => {
        setAspectRatio(aspectRatio)
    }, [aspectRatio])
    let timer

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        let hls: Hls | null = null

        const loadAndPlayVideo = () => {
            if (!url) return

            const isHls = url.endsWith('.m3u8')

            if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url
            } else if (isHls && Hls.isSupported()) {
                hls = new Hls({ enableWorker: false })
                hls.loadSource(url)
                hls.attachMedia(video)
            } else {
                video.src = url
            }

            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                if (isPlayingVideo) {
                    video
                        .play()
                        .then()
                        .catch((error) => {
                            console.error('Autoplay was prevented:', error)
                        })
                } else {
                    video.pause()
                }
            }, 10)
        }

        loadAndPlayVideo()

        return () => {
            if (hls) {
                hls.destroy()
            }
        }
    }, [url, isPlayingVideo])

    // New IntersectionObserver to pause when out of view
    useEffect(() => {
        try {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    try {
                        if (!entry.isIntersecting && videoRef.current) {
                            videoRef.current.pause()
                        }
                        if (entry.isIntersecting && videoRef.current) {
                            videoRef.current.play()
                        }
                    } catch (error: any) {
                        console.error('Error handling video playback:', error)
                    }
                },
                { threshold: 0.5 },
            )

            if (containerRef.current) {
                observer.observe(containerRef.current)
            }

            return () => {
                try {
                    observer.disconnect()
                } catch (error) {
                    console.error('Error disconnecting observer:', error)
                }
            }
        } catch (error) {
            console.error('Error setting up IntersectionObserver:', error)
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="w-full max-w-full overflow-hidden"
            style={{ borderRadius: radius || 0, aspectRatio: aspectRatioVal }}
        >
            <div className="relative w-full h-full">
                {/* Thumbnail with reduced opacity and play button */}
                {!isPlayingVideo && (
                    <img
                        src={thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover opacity-70 transition-opacity duration-500"
                    />
                )}
                {isPlayingVideo && !isVideoLoaded && (
                    <img
                        src={thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover opacity-70 transition-opacity duration-500"
                    />
                )}

                {/* Video player with play button */}
                {isPlayingVideo ? (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover opacity-100 transition-opacity duration-500"
                        onCanPlayThrough={() => setIsVideoLoaded(true)}
                        onLoadedMetadata={handleMetadataLoad}
                        muted
                        loop
                        preload="auto"
                        playsInline
                    />
                ) : (
                    <div className="absolute inset-0 flex justify-center items-center">
                        {/* Play Button */}
                        <BsPlayCircle size={40} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoPlayer
