"use client";

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface DecryptedTextProps {
  text: string
  speed?: number
  maxIterations?: number
  sequential?: boolean
  revealDirection?: 'start' | 'end' | 'center'
  useOriginalCharsOnly?: boolean
  characters?: string
  className?: string
  parentClassName?: string
  encryptedClassName?: string
  animateOn?: 'view' | 'hover'
  [key: string]: any
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'view',
  ...props
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let interval: any
    let currentIteration = 0

    const startAnimation = () => {
      interval = setInterval(() => {
        setDisplayText((prevText) =>
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return char
              if (isRevealed) return char

              if (sequential) {
                if (index < currentIteration / maxIterations) {
                  return text[index]
                }
              }

              const availableChars = useOriginalCharsOnly ? text : characters
              return availableChars[Math.floor(Math.random() * availableChars.length)]
            })
            .join('')
        )

        currentIteration++
        if (currentIteration >= text.length * maxIterations) {
          setIsRevealed(true)
          setDisplayText(text)
          clearInterval(interval)
        }
      }, speed)
    }

    if (animateOn === 'view' && !hasAnimated) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startAnimation()
            setHasAnimated(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      if (containerRef.current) observer.observe(containerRef.current)
      return () => observer.disconnect()
    }

    if (animateOn === 'hover' && isHovering && !isRevealed) {
      startAnimation()
    }

    return () => clearInterval(interval)
  }, [text, speed, maxIterations, sequential, revealDirection, useOriginalCharsOnly, characters, isHovering, animateOn, hasAnimated, isRevealed])

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block ${parentClassName}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        if (animateOn === 'hover') {
          setIsRevealed(false)
          setDisplayText(text)
        }
      }}
      {...props}
    >
      <span className={className}>{displayText}</span>
    </motion.span>
  )
}
