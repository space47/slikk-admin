import { useEffect, useRef } from 'react'

interface LottieViewProps {
    animationData?: object
    path?: string
    loop?: boolean
    autoplay?: boolean
    width?: number | string
    height?: number | string
}

const LottieView = ({ animationData, path, loop = true, autoplay = true, width = 140, height = 140 }: LottieViewProps) => {
    const container = useRef<HTMLDivElement>(null)
    const animationInstanceRef = useRef<any>(null)

    useEffect(() => {
        if (!path && !animationData) {
            console.warn('LottieView: Either `path` or `animationData` must be provided.')
            return
        }

        import('lottie-web').then((lottie) => {
            if (container.current && !animationInstanceRef.current) {
                const animationConfig: any = {
                    container: container.current,
                    renderer: 'svg',
                    loop,
                    autoplay,
                }

                if (path) animationConfig.path = path
                if (animationData) animationConfig.animationData = animationData

                animationInstanceRef.current = lottie.default.loadAnimation(animationConfig)
            }
        })

        return () => {
            if (animationInstanceRef.current) {
                animationInstanceRef.current.destroy()
                animationInstanceRef.current = null
            }
        }
    }, [path, animationData, loop, autoplay])

    return (
        <div
            ref={container}
            style={{
                width: width,
                height: height,
                overflow: 'hidden', // Ensures no overflow outside the container
                pointerEvents: 'none', // Prevents the animation from blocking clicks
            }}
        />
    )
}

export default LottieView
