import { getBackendInfo, resetBackendURI, setBackendURI } from '@/utils/runtimeConfig';
import React, { useEffect, useState } from 'react';

/**
 * Developer tool for switching backend URLs at runtime
 * Only visible in development mode
 */
export const DevBackendSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [backendInfo, setBackendInfo] = useState(getBackendInfo());
  const [customUrl, setCustomUrl] = useState('');
  const [presetUrls] = useState([
    { label: 'Dev API', url: 'https://dev-api.slikk.club/' },
    { label: 'UAT API', url: 'https://uat-api.slikk.club/' },
    { label: 'Local API', url: 'http://localhost:8000/' },
  ]);

  useEffect(() => {
    setBackendInfo(getBackendInfo());
  }, []);

  const handleSetBackend = (url: string) => {
    setBackendURI(url);
    setBackendInfo(getBackendInfo());
    alert('Backend URL updated! Reloading page...');
    setTimeout(() => window.location.reload(), 500);
  };

  const handleReset = () => {
    resetBackendURI();
    setBackendInfo(getBackendInfo());
    alert('Reset to default backend! Reloading page...');
    setTimeout(() => window.location.reload(), 500);
  };
  console.log("VITE_DEV value:", import.meta.env.VITE_DEV, "Type:", typeof import.meta.env.VITE_DEV);

  // Properly handle string "false" from .env files
  const isDevMode = import.meta.env.VITE_DEV === true || import.meta.env.VITE_DEV === 'true';

  if (!isDevMode) {
    return null; // Only show in development
  }

  return (
    <>
      <style>{`
        @keyframes devSwitcherPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.5); }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
            }}
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              fontSize: '24px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            title="Backend Switcher (Dev Tool)"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: 'relative', zIndex: 1 }}
            >
              {/* Server icon with swap arrows */}
              <rect x="3" y="3" width="18" height="5" rx="1" stroke="white" strokeWidth="2" fill="none" />
              <rect x="3" y="10" width="18" height="5" rx="1" stroke="white" strokeWidth="2" fill="none" />
              <rect x="3" y="17" width="18" height="4" rx="1" stroke="white" strokeWidth="2" fill="none" />
              <circle cx="6" cy="5.5" r="0.8" fill="white" />
              <circle cx="6" cy="12.5" r="0.8" fill="white" />
              <circle cx="6" cy="19" r="0.8" fill="white" />
              {/* Swap/refresh indicator */}
              <path
                d="M17 6L19 5.5L17 5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 13L13 12.5L15 12"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Animated gradient overlay */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
              animation: 'devSwitcherPulse 2s ease-in-out infinite',
              pointerEvents: 'none'
            }} />
          </button>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            padding: '20px',
            width: '350px',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Backend Switcher</h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              background: '#f3f4f6',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '13px'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Current:</strong>
                <div style={{ wordBreak: 'break-all', color: '#8b5cf6', fontWeight: 'bold' }}>
                  {backendInfo.current}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Source: {backendInfo.source}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ display: 'block', marginBottom: '10px', fontSize: '14px' }}>Quick Presets:</strong>
              {presetUrls.map((preset) => (
                <button
                  key={preset.url}
                  onClick={() => handleSetBackend(preset.url)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    marginBottom: '8px',
                    background: backendInfo.current === preset.url ? '#1a1a1a' : '#f3f4f6',
                    color: backendInfo.current === preset.url ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: backendInfo.current === preset.url ? 'bold' : 'normal'
                  }}
                >
                  {preset.label}
                  <div style={{
                    fontSize: '11px',
                    opacity: 0.8,
                    marginTop: '4px',
                    wordBreak: 'break-all'
                  }}>
                    {preset.url}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Custom URL:</strong>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://your-api.com/"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  marginBottom: '8px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={() => customUrl && handleSetBackend(customUrl)}
                disabled={!customUrl}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: customUrl ? '#10b981' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: customUrl ? 'pointer' : 'not-allowed',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}
              >
                Set Custom URL
              </button>
            </div>

            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '10px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold'
              }}
            >
              Reset to Default
            </button>

            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: '#fef3c7',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#92400e'
            }}>
              <strong>💡 Pro tip:</strong> You can also use URL params:
              <code style={{ display: 'block', marginTop: '4px', background: 'white', padding: '4px', borderRadius: '4px' }}>
                ?backend=https://your-api.com
              </code>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
