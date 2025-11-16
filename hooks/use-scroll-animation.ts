'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollAnimationOptions {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
    const {
        threshold = 0.1,
        rootMargin = '0px 0px -50px 0px',
        triggerOnce = true,
    } = options

    const ref = useRef<HTMLElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [hasTriggered, setHasTriggered] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (triggerOnce) {
                        setHasTriggered(true)
                        observer.unobserve(entry.target)
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false)
                }
            },
            {
                threshold,
                rootMargin,
            }
        )

        const currentRef = ref.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [threshold, rootMargin, triggerOnce])

    return {
        ref,
        isVisible: triggerOnce ? hasTriggered || isVisible : isVisible,
    }
}
