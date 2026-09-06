import type { OrbzState, OrbzVoiceModel } from '@neongate-ai/orbz'

/** The published native element boundary used by this documentation preview. */
export interface HomeVoiceElement extends EventTarget {
  voiceModel: OrbzVoiceModel | null | undefined
  speech: string | null | undefined
  state: OrbzState
  startTalking(): Promise<void>
  stopTalking(): void
}

export interface HomeVoiceUpdate {
  state: OrbzState
  speaking: boolean
  error: string | null
}

export function createHomeVoiceController(
  orb: HomeVoiceElement,
  supported: boolean,
  onUpdate: (update: HomeVoiceUpdate) => void
) {
  let disposed = false
  let run = 0
  let speaking = false
  let error: string | null = null

  function publish() {
    if (!disposed) onUpdate({ state: orb.state, speaking, error })
  }

  function stop() {
    if (disposed) return
    run += 1
    orb.stopTalking()
    speaking = false
    publish()
  }

  function fail(reason: unknown) {
    if (disposed) return
    // Orbz may queue another document activation after a blocked attempt.
    // Stopping cancels that retry as well as any active utterance.
    const name = reason instanceof Error ? reason.name : undefined
    // biome-ignore lint/nursery/noSecrets: NotAllowedError is a standardized browser error name.
    const blocked = name === 'NotAllowedError'
    error = blocked
      ? 'Your browser blocked speech. Select Speak to try again.'
      : 'Speech could not be played. Select Speak to try again.'
    stop()
  }

  function handleSpeaking(event: Event) {
    if (!(event instanceof CustomEvent)) return
    const detail: unknown = event.detail
    if (!detail || typeof detail !== 'object' || !('speaking' in detail)) return
    if (typeof detail.speaking !== 'boolean') return
    speaking = detail.speaking
    publish()
  }

  function handleError(event: Event) {
    if (!(event instanceof CustomEvent)) return
    const detail: unknown = event.detail
    fail(
      detail && typeof detail === 'object' && 'error' in detail
        ? detail.error
        : undefined
    )
  }

  orb.addEventListener('orbz-speaking-change', handleSpeaking)
  orb.addEventListener('orbz-talk-error', handleError)
  if (supported) {
    orb.voiceModel = { provider: 'web-speech', language: 'en-US' }
  }

  return {
    async start(text: string) {
      if (disposed) return
      if (!supported || !text.trim()) {
        error = supported
          ? 'Enter some text before selecting Speak.'
          : 'Browser speech is unavailable here. You can still customize the orb.'
        publish()
        return
      }
      stop()
      error = null
      orb.speech = text.trim()
      const activeRun = ++run
      publish()
      try {
        // Do not defer activation out of the caller's button/form interaction.
        await orb.startTalking()
      } catch (reason) {
        if (!disposed && activeRun === run) fail(reason)
      }
    },
    stop,
    selectState(state: OrbzState) {
      if (disposed) return
      stop()
      orb.state = state
      publish()
    },
    dispose() {
      if (disposed) return
      disposed = true
      run += 1
      orb.removeEventListener('orbz-speaking-change', handleSpeaking)
      orb.removeEventListener('orbz-talk-error', handleError)
      orb.stopTalking()
      orb.speech = undefined
    }
  }
}

export type HomeVoiceController = ReturnType<typeof createHomeVoiceController>
