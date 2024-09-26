import React, { useEffect, useRef } from 'react'

interface SOUNDPROPS {
    shouldPlay: boolean // Change to boolean for better type safety
}

const NotificationSound = ({ shouldPlay }: SOUNDPROPS) => {
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const playSound = async () => {
            if (shouldPlay && audioRef.current) {
                try {
                    await audioRef.current.play()

                    const timeoutId = setTimeout(() => {
                        audioRef.current.pause()
                        audioRef.current.currentTime = 0
                    }, 10000)

                    console.log('TIMEOUT', timeoutId)

                    return () => clearTimeout(timeoutId)
                } catch (error) {
                    console.error('Error playing sound:', error)
                }
            }
        }

        playSound()
    }, [])

    return <audio ref={audioRef} src="/notifiactionMusic/order_received_grab.mp3" preload="auto" />
}

export default NotificationSound
