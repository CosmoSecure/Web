'use client'

import React, { ReactNode, useRef, useEffect, useState } from 'react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

interface AnimatedElementProps {
    children: ReactNode
    className?: string
    animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'scaleUp' | 'rotateIn'
    delay?: number
    duration?: number
    threshold?: number
}

export function AnimatedElement({
    children,
    className,
    animation = 'fadeIn',
    delay = 0,
    duration = 600,
    threshold = 0.1,
}: AnimatedElementProps) {
    const { ref, isVisible } = useScrollAnimation({ threshold })

    return (
        <div
            ref={ref as React.Ref<HTMLDivElement>}
            className={cn(
                'transition-all',
                !isVisible && 'invisible opacity-0',
                isVisible && `animate-${animation}`,
                className
            )}
            style={{
                animationDelay: `${delay}ms`,
                animationDuration: `${duration}ms`,
            } as React.CSSProperties}
        >
            {children}
        </div>
    )
}

interface AnimatedCardProps {
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
}

export function AnimatedCard({
    children,
    className,
    delay = 0,
    duration = 600,
}: AnimatedCardProps) {
    return (
        <AnimatedElement
            animation="slideUp"
            delay={delay}
            duration={duration}
            className={cn('card-hover h-full', className)}
        >
            {children}
        </AnimatedElement>
    )
}

interface AnimatedSectionProps {
    children: ReactNode
    className?: string
    animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight'
}

export function AnimatedSection({
    children,
    className,
    animation = 'slideUp',
}: AnimatedSectionProps) {
    return (
        <AnimatedElement
            animation={animation}
            duration={800}
            className={cn('w-full', className)}
        >
            {children}
        </AnimatedElement>
    )
}

interface StaggeredContainerProps {
    children: ReactNode
    className?: string
    delay?: number
    itemDelay?: number
}

export function StaggeredContainer({
    children,
    className,
    delay = 0,
    itemDelay = 100,
}: StaggeredContainerProps) {
    const childArray = React.Children.toArray(children)

    return (
        <div className={className}>
            {childArray.map((child, index) => (
                <AnimatedElement
                    key={index}
                    animation="slideUp"
                    delay={delay + index * itemDelay}
                    duration={600}
                >
                    {child}
                </AnimatedElement>
            ))}
        </div>
    )
}

interface ParallaxElementProps {
    children: ReactNode
    className?: string
    speed?: number
}

export function ParallaxElement({
    children,
    className,
    speed = 0.5,
}: ParallaxElementProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const elementTop = ref.current.offsetTop
                const scrollTop = window.scrollY
                const distance = scrollTop - elementTop
                setOffset(distance * speed)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [speed])

    return (
        <div
            ref={ref}
            className={className}
            style={{
                transform: `translateY(${offset}px)`,
            }}
        >
            {children}
        </div>
    )
}
