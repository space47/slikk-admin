import React from 'react'

interface VideoPlayerProps {
    url: string
}

const VideoFrame: React.FC<VideoPlayerProps> = ({ url }) => {
    return (
        <div>
            <video
                controls
                width="300"
                src={url}
                title="Video player"
                className="overflow-clip h-[300px] rounded-xl"
            >
                <h4>NO VIDEO AVAILABLE</h4>
            </video>
        </div>
    )
}

export default VideoFrame
