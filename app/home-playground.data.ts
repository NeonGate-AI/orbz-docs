/** OpenAI integration example settings; the interactive demo uses browser speech. */
export const HOME_SPEECH_EXAMPLE = Object.freeze({
  provider: 'openai-speech',
  model: 'gpt-4o-mini-tts',
  voice: 'marin',
  endpoint: '/api/voice/speech'
} as const)
