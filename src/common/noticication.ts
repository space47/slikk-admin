export const playNotificationSound = () => {
    const audio = new Audio('/notifiactionMusic/order_received_grab.mp3')

    // Attempt to play the audio and handle errors
    audio.play().catch((error) => {
        console.error('Playback failed:', error)
    })

    setTimeout(() => {
        audio.pause()
        audio.currentTime = 0
    }, 10000)
}
