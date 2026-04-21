import { useState, useCallback } from 'react';

function PillField({ name, type = 'text', placeholder, value, onChange, flex = '1 1 160px' }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        flex,
        minWidth: 0,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: 'var(--star-white)',
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.82rem, 1.1vw, 0.9rem)',
        fontWeight: 400,
        padding: '0 1.25rem',
        height: '100%',
        caretColor: 'var(--neptune-blue)',
      }}
    />
  );
}

function Divider() {
  return (
    <div style={{
      width: '1px',
      alignSelf: 'stretch',
      background: 'rgba(255,255,255,0.08)',
      margin: '0.75rem 0',
      flexShrink: 0,
    }} />
  );
}

export default function ContactForm({ onSubmitSuccess }) {
  const [form, setForm]     = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const onChange = useCallback((e) => setForm(p => ({ ...p, [e.target.name]: e.target.value })), []);
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      onSubmitSuccess?.();
      setTimeout(() => setStatus('idle'), 4000);
    }, 1200);
  }, [onSubmitSuccess]);

  const isSending = status === 'sending';
  const isSent    = status === 'sent';

  if (isSent) {
    return (
      /* Outer bezel */
      <div style={{
        background: 'rgba(115,194,190,0.04)',
        border: '1px solid rgba(115,194,190,0.2)',
        borderRadius: '100px',
        padding: '3px',
      }}>
        {/* Inner core */}
        <div style={{
          background: 'rgba(115,194,190,0.04)',
          borderRadius: 'calc(100px - 3px)',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--uranus-teal)',
          }}>
            ✓ Message sent — I'll be in touch soon
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {/* ── Desktop pill ── */}
      <div className="contact-pill-desktop">
        {/* Outer bezel shell */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '100px',
          padding: '3px',
          transition: 'border-color 0.5s cubic-bezier(0.32,0.72,0,1)',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(61,95,196,0.35)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          {/* Inner core */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '56px',
            borderRadius: 'calc(100px - 3px)',
            background: 'rgba(255,255,255,0.02)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.04)',
            overflow: 'hidden',
          }}>
            <PillField
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={onChange}
              flex="0 1 180px"
            />
            <Divider />
            <PillField
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={onChange}
              flex="0 1 220px"
            />
            <Divider />
            <PillField
              name="message"
              placeholder="What are you building?"
              value={form.message}
              onChange={onChange}
              flex="1 1 200px"
            />

            {/* Button-in-button CTA */}
            <div style={{ padding: '4px 4px 4px 8px', flexShrink: 0 }}>
              <button
                type="submit"
                disabled={isSending}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0 0.6rem 0 1.25rem',
                  height: '48px',
                  borderRadius: '100px',
                  border: 'none',
                  background: isSending
                    ? 'rgba(61,95,196,0.55)'
                    : 'var(--neptune-blue)',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  cursor: isSending ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.4s cubic-bezier(0.32,0.72,0,1)',
                  boxShadow: '0 2px 16px rgba(61,95,196,0.4)',
                }}
                onMouseEnter={(e) => {
                  if (isSending) return;
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(61,95,196,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 16px rgba(61,95,196,0.4)';
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1.03)'; }}
              >
                <span>{isSending ? 'Sending…' : 'Send it'}</span>
                {/* Nested icon circle */}
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'transform 0.4s cubic-bezier(0.32,0.72,0,1)',
                  fontSize: '0.95rem',
                }}>
                  {isSending ? '…' : '↗'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile stacked layout ── */}
      <div className="contact-pill-mobile">
        {/* Outer bezel */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '3px',
        }}>
          {/* Inner core */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '17px',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.04)',
            overflow: 'hidden',
          }}>
            {[
              { name: 'name',    type: 'text',  placeholder: 'Your name'             },
              { name: 'email',   type: 'email', placeholder: 'your@email.com'         },
              { name: 'message', type: 'text',  placeholder: 'What are you building?' },
            ].map((f, i) => (
              <div key={f.name}>
                {i > 0 && <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 1rem' }} />}
                <input
                  name={f.name}
                  type={f.type}
                  value={form[f.name]}
                  onChange={onChange}
                  placeholder={f.placeholder}
                  required
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--star-white)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    padding: '1rem 1.25rem',
                    boxSizing: 'border-box',
                    caretColor: 'var(--neptune-blue)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSending}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            marginTop: '0.75rem',
            padding: '0.85rem',
            borderRadius: '100px',
            border: 'none',
            background: 'var(--neptune-blue)',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: isSending ? 'wait' : 'pointer',
            transition: 'opacity 0.3s ease',
            opacity: isSending ? 0.7 : 1,
          }}
        >
          {isSending ? 'Sending…' : 'Send it ↗'}
        </button>
      </div>
    </form>
  );
}
