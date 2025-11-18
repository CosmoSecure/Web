"use client"

import { useEffect, useState } from 'react'

interface Comet {
    id: number
    left: number
    animationDuration: number
    animationDelay: number
    size: number
    opacity: number
}

export function CometShower() {
    const [comets, setComets] = useState<Comet[]>([])

    useEffect(() => {
        // Check if mobile view
        const isMobile = window.innerWidth < 768
        const cometCount = isMobile ? 8 : 15 // Fewer comets on mobile for better spacing

        // Generate multiple comets with random properties
        const generatedComets: Comet[] = Array.from({ length: cometCount }, (_, i) => ({
            id: i,
            left: Math.random() * 100, // Random position from 0-100%
            animationDuration: 2 + Math.random() * 3, // 2-5 seconds
            animationDelay: Math.random() * 5, // 0-5 seconds delay
            size: 60 + Math.random() * 100, // 60-160px length
            opacity: 0.3 + Math.random() * 0.4, // 0.3-0.7 opacity
        }))
        setComets(generatedComets)

        // Update on window resize
        const handleResize = () => {
            const isMobile = window.innerWidth < 768
            const cometCount = isMobile ? 8 : 15
            const generatedComets: Comet[] = Array.from({ length: cometCount }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                animationDuration: 2 + Math.random() * 3,
                animationDelay: Math.random() * 5,
                size: 60 + Math.random() * 100,
                opacity: 0.3 + Math.random() * 0.4,
            }))
            setComets(generatedComets)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {comets.map((comet) => (
                <div
                    key={comet.id}
                    className="comet"
                    style={{
                        left: `${comet.left}%`,
                        top: '-200px',
                        animationDuration: `${comet.animationDuration}s`,
                        animationDelay: `${comet.animationDelay}s`,
                        transform: 'rotate(45deg)',
                        '--comet-size': `${comet.size}px`,
                        '--comet-opacity': comet.opacity,
                    } as React.CSSProperties}
                >
                    <div className="comet-tail" />
                </div>
            ))}
        </div>
    )
}
