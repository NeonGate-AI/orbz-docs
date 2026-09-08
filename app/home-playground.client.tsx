'use client'

import '@neongate-ai/orbz/browser'
import '@neongate-ai/orbz/react-types'
import {
  DEFAULT_ORBZ_COLORS,
  type OrbzColors,
  type OrbzElement
} from '@neongate-ai/orbz'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AppearanceControls, SpeechControls } from './home-playground.controls'
import { HOME_SPEECH_EXAMPLE } from './home-playground.data'
import {
  createHomeVoiceController,
  type HomeVoiceController,
  type HomeVoiceUpdate
} from './home-playground.voice'
import './home-playground.css'

export function HomePlayground({ children }: { children: ReactNode }) {
  const orbRef = useRef<OrbzElement>(null)
  const controllerRef = useRef<HomeVoiceController | null>(null)
  const [colors, setColors] = useState<OrbzColors>({ ...DEFAULT_ORBZ_COLORS })
  const [size, setSize] = useState(100)
  const [paused, setPaused] = useState(false)
  const [ready, setReady] = useState(false)
  const [supported, setSupported] = useState(false)
  const [text, setText] = useState(
    'Hello! Give your next voice assistant a visible pulse.'
  )
  const [voice, setVoice] = useState<HomeVoiceUpdate>({
    state: 'idle',
    speaking: false,
    error: null
  })

  useEffect(() => {
    const orb = orbRef.current
    if (!orb) return
    const available =
      typeof globalThis.speechSynthesis !== 'undefined' &&
      typeof globalThis.SpeechSynthesisUtterance === 'function'
    const controller = createHomeVoiceController(orb, available, setVoice)
    controllerRef.current = controller
    setSupported(available)
    setReady(true)
    return () => {
      controllerRef.current = null
      controller.dispose()
    }
  }, [])

  const scale = size / 100
  const orbSize = `clamp(${10 * scale}rem, ${18.6667 * scale}vw, ${14.6667 * scale}rem)`

  return (
    <div className="orbz-playground">
      <div className="orbz-playground-workspace">
        <div className="orbz-playground-editor">{children}</div>
        <AppearanceControls
          colors={colors}
          onColorChange={(channel, value) =>
            setColors((current) => ({ ...current, [channel]: value }))
          }
          onSizeChange={setSize}
          onStateChange={(state) => controllerRef.current?.selectState(state)}
          ready={ready}
          size={size}
          state={voice.state}
        />
        <div className="orbz-component-proof">
          <p className="orbz-component-proof-title">Your text input to Voice</p>
          <ul className="orbz-proof">
            <li>Native custom element, no third-party libs</li>
            <li>Closed Shadow DOM</li>
            <li>SSR-safe entry points</li>
          </ul>
        </div>
      </div>
      <div className="orbz-playground-preview">
        <div className="orbz-preview-caption">
          <span className="orbz-live-label">
            <span aria-hidden="true" className="orbz-live-dot" />
            Live component
          </span>
          <span className="orbz-preview-state">{voice.state}</span>
          {paused ? <span>Motion paused</span> : null}
        </div>
        <div aria-hidden="true" className="orbz-playground-stage">
          <orb-z
            color-accent={colors.accent}
            color-background={colors.background}
            color-highlight={colors.highlight}
            color-primary={colors.primary}
            color-secondary={colors.secondary}
            paused={paused}
            reduced-motion="system"
            ref={orbRef}
            size={orbSize}
            speed={0.85}
            state={voice.state}
            tabIndex={-1}
          />
        </div>
        <dl
          aria-label="OpenAI speech example settings"
          className="orbz-voice-badges"
        >
          <div>
            <dt>Model</dt>
            <dd>{HOME_SPEECH_EXAMPLE.model}</dd>
          </div>
          <div>
            <dt>Voice</dt>
            <dd>{HOME_SPEECH_EXAMPLE.voice}</dd>
          </div>
        </dl>
        <SpeechControls
          error={voice.error}
          onPause={() => setPaused((current) => !current)}
          onSpeak={() => {
            void controllerRef.current?.start(text)
          }}
          onStop={() => controllerRef.current?.stop()}
          onTextChange={setText}
          paused={paused}
          ready={ready}
          speaking={voice.speaking}
          supported={supported}
          text={text}
        />
      </div>
    </div>
  )
}
