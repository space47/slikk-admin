import React, { useEffect, useRef } from 'react'

interface SOUNDPROPS {
    shouldPlay: boolean
    onSoundEnd: () => void
}

const NotificationSound = ({ shouldPlay, onSoundEnd }: SOUNDPROPS) => {
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const playSound = async () => {
            // Check if audioRef.current exists and shouldPlay is true
            if (shouldPlay && audioRef.current) {
                try {
                    // Play sound
                    await audioRef.current.play()

                    // Set a timeout to stop the sound after 10 seconds
                    const timeoutId = setTimeout(() => {
                        // Check again if audioRef.current exists before pausing
                        if (audioRef.current) {
                            audioRef.current.pause()
                            audioRef.current.currentTime = 0
                        }
                        onSoundEnd() // Signal that the sound has ended
                    }, 10000) // Adjust this duration if needed

                    return () => clearTimeout(timeoutId)
                } catch (error) {
                    console.error('Error playing sound:', error)
                    onSoundEnd() // Reset sound if an error occurs
                }
            }
        }

        playSound()
    }, [shouldPlay, onSoundEnd])

    return <audio ref={audioRef} src="/notifiactionMusic/order_received_grab.mp3" preload="auto" />
}

export default NotificationSound
