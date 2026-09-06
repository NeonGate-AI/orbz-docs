import './home-playground.css'

const example = `import '@neongate-ai/orbz/browser'

const orb = document.querySelector('orb-z')

orb.voiceModel = {
  provider: 'openai-realtime',
  model: 'gpt-realtime-2'
}

orb.realtimeSession = {
  endpoint: '/api/voice/session'
}

// Connect this to your Start button.
const startVoice = () => orb.startConversation()`

function highlightExample() {
  const pattern = /(\/\/[^\n]*|'[^'\n]*'|\b(?:import|const)\b)/g
  return example.split(pattern).map((part, index) => {
    const kind = part.startsWith('//')
      ? 'comment'
      : part.startsWith("'")
        ? 'string'
        : /^(import|const)$/.test(part)
          ? 'keyword'
          : undefined
    // The immutable token sequence has no insertions or interactive identity.
    return kind ? (
      <span className={`orbz-code-${kind}`} key={`${index}-${part}`}>
        {part}
      </span>
    ) : (
      part
    )
  })
}

export function HomeVoiceExample() {
  return (
    <figure className="orbz-voice-example">
      <figcaption className="orbz-editor-heading">
        <span className="orbz-editor-file">
          <span aria-hidden="true" className="orbz-editor-icon">
            {'</>'}
          </span>{' '}
          voice.js
        </span>
        <span>JavaScript</span>
      </figcaption>
      <section
        aria-label="JavaScript voice model integration example"
        className="orbz-editor-source"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: The scrollable code example needs keyboard access.
        tabIndex={0}
      >
        <pre>
          <code>{highlightExample()}</code>
        </pre>
      </section>
      <p className="orbz-editor-note">
        Your server authorizes the session. Provider keys stay on the server.{' '}
        <a href="/orbz/guides/voice-assistant">Voice integration guide ↗</a>
      </p>
    </figure>
  )
}
