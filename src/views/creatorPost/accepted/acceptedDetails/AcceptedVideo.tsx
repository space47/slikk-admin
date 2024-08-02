import React from 'react'

interface VideoPlayerProps {
    url: string
}

const VideoFrame: React.FC<VideoPlayerProps> = ({ url }) => {
    return (
        <div>
            <iframe
                allowFullScreen
                width="600"
                height="460"
                src={url}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="overflow-clip"
            ></iframe>
        </div>
    )
}

export default VideoFrame
