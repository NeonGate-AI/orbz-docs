import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createHomeVoiceController,
  type HomeVoiceElement,
  type HomeVoiceUpdate
} from '../app/home-playground.voice.ts'

class VoiceElement extends EventTarget implements HomeVoiceElement {
  voiceModel: HomeVoiceElement['voiceModel']
  speech: HomeVoiceElement['speech']
  state: HomeVoiceElement['state'] = 'idle'
  starts = 0
  stops = 0
  pendingActivation = false
  run: () => Promise<void> = () => Promise.resolve()

  startTalking() {
    this.starts += 1
    this.state = 'speaking'
    this.emit('orbz-speaking-change', { speaking: true })
    return this.run()
  }

  stopTalking() {
    this.stops += 1
    this.pendingActivation = false
    if (this.state === 'speaking') this.state = 'idle'
    this.emit('orbz-speaking-change', { speaking: false })
  }

  emit(name: string, detail: unknown) {
    this.dispatchEvent(new CustomEvent(name, { detail }))
  }
}

function setup(supported = true) {
  const element = new VoiceElement()
  const updates: HomeVoiceUpdate[] = []
  const controller = createHomeVoiceController(element, supported, (update) => {
    updates.push(update)
  })
  return { element, updates, controller }
}

test('registration stays silent; only nonblank submitted text activates speech', async () => {
  const { element, updates, controller } = setup()
  assert.equal(element.starts, 0)
  assert.deepEqual(element.voiceModel, {
    provider: 'web-speech',
    language: 'en-US'
  })
  await controller.start('   ')
  assert.equal(element.starts, 0)
  assert.ok(updates.some((update) => update.error?.includes('Enter some text')))
  await controller.start('  Hello from the preview.  ')
  assert.equal(element.starts, 1)
  assert.equal(element.speech, 'Hello from the preview.')
  controller.dispose()
})

test('an emitted activation error cancels the package retry even if start resolves', async () => {
  const { element, updates, controller } = setup()
  element.run = async () => {
    element.pendingActivation = true
    element.emit('orbz-talk-error', {
      // biome-ignore lint/nursery/noSecrets: NotAllowedError is the public browser error name under test.
      error: new DOMException('Blocked by the browser', 'NotAllowedError')
    })
  }
  await controller.start('Hello.')
  assert.equal(element.pendingActivation, false)
  assert.equal(element.state, 'idle')
  assert.equal(
    updates.at(-1)?.error,
    'Your browser blocked speech. Select Speak to try again.'
  )
  controller.dispose()
})

test('late rejection after a manual state change cannot replace the chosen state or error', async () => {
  const { element, updates, controller } = setup()
  let rejectSpeech: (reason: Error) => void = () => {
    throw new Error('Speech promise was not initialized')
  }
  element.run = () =>
    new Promise<void>((_resolve, reject) => {
      rejectSpeech = reject
    })
  const speaking = controller.start('Hello.')
  controller.selectState('listening')
  const count = updates.length
  rejectSpeech(new Error('Late stopped-run error'))
  await speaking
  assert.equal(element.state, 'listening')
  assert.equal(updates.length, count)
  assert.equal(updates.at(-1)?.state, 'listening')
  controller.dispose()
})

test('explicit Stop cancels playback while retaining event-driven error visibility', async () => {
  const { element, updates, controller } = setup()
  element.run = async () => {
    element.emit('orbz-talk-error', { error: new Error('Unavailable voice') })
    element.emit('orbz-speaking-change', { speaking: false })
  }
  await controller.start('Hello.')
  assert.equal(
    updates.at(-1)?.error,
    'Speech could not be played. Select Speak to try again.'
  )
  controller.stop()
  assert.equal(element.state, 'idle')
  assert.equal(updates.at(-1)?.speaking, false)
  controller.dispose()
})

test('unsupported speech leaves visual state selection usable', async () => {
  const { element, updates, controller } = setup(false)
  await controller.start('Hello.')
  assert.equal(element.starts, 0)
  assert.equal(element.voiceModel, undefined)
  assert.ok(updates.at(-1)?.error?.includes('unavailable'))
  controller.selectState('thinking')
  assert.equal(element.state, 'thinking')
  controller.dispose()
})

test('disposal removes listeners, cancels playback and fences late promise rejection', async () => {
  const { element, updates, controller } = setup()
  let rejectSpeech: (reason: Error) => void = () => {
    throw new Error('Speech promise was not initialized')
  }
  element.run = () =>
    new Promise<void>((_resolve, reject) => {
      rejectSpeech = reject
    })
  const speaking = controller.start('Hello.')
  controller.dispose()
  const count = updates.length
  assert.ok(element.stops > 0)
  assert.equal(element.speech, undefined)
  element.emit('orbz-talk-error', { error: new Error('Disconnected element') })
  element.emit('orbz-speaking-change', { speaking: true })
  rejectSpeech(new Error('Late completion'))
  await speaking
  await controller.start('Ignored after disposal.')
  assert.equal(element.starts, 1)
  assert.equal(updates.length, count)
})
