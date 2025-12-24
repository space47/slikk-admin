import { Point } from '@/views/slikkLogistics/riderZone/riderZoneUtils/riderZoneCommon'
import { useCallback, useEffect, useRef, useState } from 'react'

export const usePolygonDrawing = (polygonPoints: Point[], setPolygonPoints: React.Dispatch<React.SetStateAction<Point[]>>) => {
    const [isDrawing, setIsDrawing] = useState(false)
    const isDrawingRef = useRef(isDrawing)

    useEffect(() => {
        isDrawingRef.current = isDrawing
    }, [isDrawing])

    const addPoint = useCallback(
        (point: Point) => {
            if (!isDrawingRef.current) return
            setPolygonPoints((prev) => [...prev, point])
        },
        [setPolygonPoints],
    )

    const startDrawing = () => {
        setPolygonPoints([])
        setIsDrawing(true)
    }

    const completeDrawing = () => {
        if (polygonPoints.length < 3) return
        setIsDrawing(false)
    }

    const clearDrawing = () => {
        setPolygonPoints([])
        setIsDrawing(false)
    }

    const removePoint = (index: number) => {
        if (!isDrawingRef.current) return
        setPolygonPoints((prev) => prev.filter((_, i) => i !== index))
    }

    return {
        isDrawing,
        startDrawing,
        completeDrawing,
        clearDrawing,
        addPoint,
        removePoint,
    }
}
