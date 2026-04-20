import { useState, useCallback, useRef } from 'react';

const FIELDS = [
  { name: 'name',    type: 'text',  label: 'Your name',    placeholder: 'Mani Dodla',                num: '01' },
  { name: 'email',   type: 'email', label: 'Your email',   placeholder: 'hello@somewhere.com',       num: '02' },
  { name: 'message', type: null,    label: 'Your message', placeholder: 'What are you building?',    num: '03' },
];

function Field({ field, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  const sharedProps = {
    name: field.name,
    value,
    onChange,
    required: true,
    onFocus: () => setFocused(true),
    onBlur:  () => setFocused(false),
    placeholder: focused ? field.placeholder : '',
    style: {
      display: 'block',
      width: '100%',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--star-white)',
      fontFamily: 'var(--font-body)',
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      fontWeight: 400,
      lineHeight: 1.5,
      padding: '0.6rem 0 0.75rem',
      resize: 'none',
    },
  };

  return (
    <div style={{ position: 'relative', paddingTop: '1.6rem', marginBottom: '0.25rem' }}>

      {/* Floating label */}
      <label style={{
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '0.55rem',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: focused ? 'var(--neptune-blue)' : 'rgba(232,244,248,0.25)',
          transition: 'color 0.3s ease',
          lineHeight: 1,
        }}>
          {field.num}
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: focused ? 'rgba(232,244,248,0.6)' : 'rgba(232,244,248,0.25)',
          transition: 'color 0.3s ease',
        }}>
          {field.label}
        </span>
      </label>

      {/* Input or textarea */}
      {field.type ? (
        <input type={field.type} {...sharedProps} />
      ) : (
        <textarea rows={4} {...sharedProps} />
      )}

      {/* Underline */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
      }}>
        <div style={{
          height: '100%',
          background: 'var(--neptune-blue)',
          transform: `scaleX(${focused ? 1 : 0})`,
          transformOrigin: 'left',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
    </div>
  );
}

export default function ContactForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus]     = useState('idle'); // idle | sending | sent
  const progressRef = useRef(null);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      onSubmitSuccess?.();
      setTimeout(() => setStatus('idle'), 4000);
    }, 1400);
  }, [onSubmitSuccess]);

  const isSending = status === 'sending';
  const isSent    = status === 'sent';

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>

      {FIELDS.map((field) => (
        <Field
          key={field.name}
          field={field}
          value={formData[field.name]}
          onChange={handleChange}
        />
      ))}

      {/* Submit — full-width flat bar */}
      <div style={{ marginTop: '3rem' }}>
        <button
          type="submit"
          disabled={isSending || isSent}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '1.1rem 1.5rem',
            background: isSent ? 'rgba(115,194,190,0.08)' : 'transparent',
            border: `1px solid ${isSent ? 'rgba(115,194,190,0.3)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: '4px',
            color: isSent ? 'var(--uranus-teal)' : 'var(--star-white)',
            cursor: isSending ? 'wait' : 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            transition: 'border-color 0.3s ease, background 0.3s ease, color 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            if (isSending || isSent) return;
            e.currentTarget.style.borderColor = 'rgba(61,95,196,0.55)';
            e.currentTarget.style.background = 'rgba(61,95,196,0.06)';
          }}
          onMouseLeave={(e) => {
            if (isSent) return;
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {/* Sending progress bar */}
          {isSending && (
            <span style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(61,95,196,0.08)',
              animation: 'transmitSweep 1.4s cubic-bezier(0.4,0,0.2,1) forwards',
            }} />
          )}

          <span style={{ position: 'relative', zIndex: 1 }}>
            {isSending ? 'Transmitting…' : isSent ? 'Signal received' : 'Send transmission'}
          </span>

          <span style={{
            position: 'relative',
            zIndex: 1,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            opacity: isSent ? 1 : 0.45,
            color: isSent ? 'var(--uranus-teal)' : 'inherit',
            letterSpacing: '0.1em',
          }}>
            {isSent ? '✓ ACK' : '→'}
          </span>
        </button>
      </div>
    </form>
  );
}
