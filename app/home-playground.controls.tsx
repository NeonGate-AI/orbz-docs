import type { OrbzColors, OrbzState } from '@neongate-ai/orbz'
import { useId } from 'react'

const colorChannels = [
  ['primary', 'Primary'],
  ['secondary', 'Secondary'],
  ['accent', 'Accent'],
  ['highlight', 'Highlight'],
  ['background', 'Background']
] as const

const states: OrbzState[] = [
  'idle',
  'listening',
  'thinking',
  'speaking',
  'asleep'
]

interface AppearanceControlsProps {
  colors: OrbzColors
  size: number
  state: OrbzState
  ready: boolean
  onColorChange: (channel: keyof OrbzColors, value: string) => void
  onSizeChange: (value: number) => void
  onStateChange: (value: OrbzState) => void
}

export function AppearanceControls({
  colors,
  size,
  state,
  ready,
  onColorChange,
  onSizeChange,
  onStateChange
}: AppearanceControlsProps) {
  const id = useId()
  return (
    <div className="orbz-appearance-controls">
      <fieldset className="orbz-state-controls" disabled={!ready}>
        <legend>Preview a state</legend>
        <div className="orbz-state-buttons">
          {states.map((value) => (
            <button
              aria-pressed={state === value}
              key={value}
              onClick={() => onStateChange(value)}
              type="button"
            >
              {value}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="orbz-color-controls" disabled={!ready}>
        <legend>Make it yours</legend>
        <div className="orbz-color-grid">
          {colorChannels.map(([channel, label]) => (
            <label className="orbz-color-control" key={channel}>
              <input
                aria-label={`${label} color`}
                onChange={(event) => onColorChange(channel, event.target.value)}
                type="color"
                value={colors[channel]}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="orbz-size-control">
        <label htmlFor={`${id}-size`}>
          Size <output>{size}%</output>
        </label>
        <input
          aria-valuetext={`${size}%`}
          disabled={!ready}
          id={`${id}-size`}
          max={150}
          min={60}
          onChange={(event) => onSizeChange(Number(event.target.value))}
          step={5}
          type="range"
          value={size}
        />
      </div>
    </div>
  )
}

interface SpeechControlsProps {
  text: string
  paused: boolean
  ready: boolean
  supported: boolean
  speaking: boolean
  error: string | null
  onTextChange: (value: string) => void
  onSpeak: () => void
  onStop: () => void
  onPause: () => void
}

export function SpeechControls({
  text,
  paused,
  ready,
  supported,
  speaking,
  error,
  onTextChange,
  onSpeak,
  onStop,
  onPause
}: SpeechControlsProps) {
  const id = useId()
  const message =
    error ??
    (ready && !supported
      ? 'Browser speech is unavailable here. You can still customize the orb.'
      : speaking
        ? 'Browser speech active.'
        : '')

  return (
    <form
      className="orbz-speech-controls"
      onSubmit={(event) => {
        event.preventDefault()
        onSpeak()
      }}
    >
      <label htmlFor={`${id}-speech`}>
        Give it a voice <span>Browser voice preview</span>
      </label>
      <div className="orbz-speech-input-row">
        <input
          aria-describedby={`${id}-status`}
          autoComplete="off"
          disabled={!ready || !supported}
          id={`${id}-speech`}
          maxLength={280}
          name="speech"
          onChange={(event) => onTextChange(event.target.value)}
          readOnly={speaking}
          type="text"
          value={text}
        />
        <button
          disabled={!ready || !supported || speaking || !text.trim()}
          type="submit"
        >
          Speak
        </button>
        <button disabled={!speaking} onClick={onStop} type="button">
          Stop
        </button>
        <button
          className="orbz-motion-button"
          disabled={!ready}
          onClick={onPause}
          type="button"
        >
          <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
          {paused ? 'Resume motion' : 'Pause motion'}
        </button>
      </div>
      <output
        aria-live="polite"
        className="orbz-speech-status"
        id={`${id}-status`}
      >
        {message}
      </output>
    </form>
  )
}
