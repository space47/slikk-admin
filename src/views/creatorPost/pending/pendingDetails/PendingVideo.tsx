import React, { useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface VideoPlayerProps {
    url: string
}

const VideoFrame: React.FC<VideoPlayerProps> = ({ url }) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
            if (Hls.isSupported()) {
                const hls = new Hls()
                hls.loadSource(url)
                hls.attachMedia(videoRef.current)
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoRef.current?.play()
                })
            } else if (
                videoRef.current.canPlayType('application/vnd.apple.mpegurl')
            ) {
                // For Safari browsers that support HLS natively
                videoRef.current.src = url
                videoRef.current.play()
            }
        }
    }, [url])

    return (
        <div>
            <video
                ref={videoRef}
                controls
                width="300"
                className="overflow-clip h-[400px] rounded-xl"
            >
                <h4>NO VIDEO AVAILABLE</h4>
            </video>
        </div>
    )
}

export default VideoFrame
