import { useEffect, useRef, useState } from 'react'
const Preview = ({ data }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const handlePostMessage = () => {
        iframeRef.current?.contentWindow?.postMessage(data, 'https://page-section.vercel.app/')
    }
    useEffect(() => {
        handlePostMessage()
    }, [data])
    return (
        <div className="h-screen sticky">
            <iframe ref={iframeRef} src="https://page-section.vercel.app/" width={'100%'} height={'100%'}></iframe>
        </div>
    )
}

export default Preview
