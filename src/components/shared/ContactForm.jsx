import { useState, useCallback } from 'react';

export default function ContactForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      onSubmitSuccess?.();
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  }, [onSubmitSuccess]);

  const inputStyle = {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: 'var(--star-white)',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  const labelStyle = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    display: 'block',
    marginBottom: '0.4rem',
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Name</label>
        <input
          name="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(61,95,196,0.4)';
            e.target.style.boxShadow = '0 0 20px rgba(61,95,196,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Email</label>
        <input
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(61,95,196,0.4)';
            e.target.style.boxShadow = '0 0 20px rgba(61,95,196,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Message</label>
        <textarea
          name="message"
          placeholder="Send a signal into the cosmos..."
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(61,95,196,0.4)';
            e.target.style.boxShadow = '0 0 20px rgba(61,95,196,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          padding: '0.75rem 1.75rem',
          border: 'none',
          borderRadius: '100px',
          background: status === 'sent' ? 'var(--uranus-teal)' : 'var(--sun-gold)',
          color: '#000',
          cursor: status === 'sending' ? 'wait' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: status === 'sending' ? 0.7 : 1,
        }}
      >
        {status === 'idle' && 'Transmit Message'}
        {status === 'sending' && 'Transmitting...'}
        {status === 'sent' && 'Signal Sent!'}
      </button>
    </form>
  );
}
