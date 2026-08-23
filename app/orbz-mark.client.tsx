'use client'

import {
  talk,
  type OrbzElement,
  type OrbzPresetName,
  type OrbzState,
  type OrbzTalkStep,
  type OrbzVoiceEnginePort
} from '@neongate-ai/orbz'
import '@neongate-ai/orbz/browser'
import { useEffect, useRef } from 'react'

interface OrbzMarkProps {
  elevated?: boolean
  preset?: OrbzPresetName
  size: string
  speed?: number
  states?: readonly OrbzState[]
}

const DEFAULT_STATES = ['idle', 'listening', 'thinking', 'speaking'] as const

const SILENT_TALK_FLOW = [
  talk.welcoming
] as const satisfies readonly OrbzTalkStep[]

const SILENT_VOICE_ENGINE: OrbzVoiceEnginePort = Object.freeze({
  speak: () => Promise.resolve(),
  stop: () => undefined
})

export function OrbzMark({
  elevated = false,
  preset = 'neongate',
  size,
  speed = 0.9,
  states = DEFAULT_STATES
}: Readonly<OrbzMarkProps>) {
  const hostRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const orb = document.createElement('orb-z') as OrbzElement

    // Header/footer marks are visual presence only. Orbz 0.3.0 automatically
    // starts its talk flow when connected, so give these marks a valid one-step
    // flow backed by a silent engine instead of assigning an invalid empty flow.
    orb.voiceEngine = SILENT_VOICE_ENGINE
    orb.talkFlow = SILENT_TALK_FLOW
    orb.setAttribute('preset', preset)
    orb.setAttribute('reduced-motion', 'system')
    orb.setAttribute('size', size)
    orb.setAttribute('speed', String(speed))
    if (elevated) orb.setAttribute('elevated', '')

    const sequence = states.length > 0 ? states : DEFAULT_STATES
    let index = 0
    orb.setAttribute('state', sequence[index] ?? 'idle')
    host.append(orb)

    const timer = window.setInterval(() => {
      index = (index + 1) % sequence.length
      orb.setAttribute('state', sequence[index] ?? 'idle')
    }, 2800)

    return () => {
      window.clearInterval(timer)
      orb.stopTalking()
      orb.remove()
    }
  }, [elevated, preset, size, speed, states])

  return (
    <span
      aria-hidden="true"
      className="neongate-orbz-mark"
      ref={hostRef}
      style={{ blockSize: size, inlineSize: size }}
    />
  )
}
