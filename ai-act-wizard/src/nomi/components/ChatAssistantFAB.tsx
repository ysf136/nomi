import React, { useState } from "react";
import novaLogo from "../../assets/nova_logo_hexagon.png";

const ChatAssistantFAB: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <style>{`
        @keyframes fab-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }

        @keyframes rotate-glow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .fab-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 52px;
          height: 52px;
          min-width: 52px;
          min-height: 52px;
          max-width: 52px;
          max-height: 52px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          background: white;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.8), 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .fab-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: calc(100% + 20px);
          height: calc(100% + 20px);
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            #3FB292 0deg,
            #3FB292 60deg,
            #85d4c0 90deg,
            #ff1d8a 180deg,
            #ff1d8a 240deg,
            #85d4c0 270deg,
            #3FB292 360deg
          );
          filter: blur(6px);
          opacity: 1;
          z-index: -1;
          animation: rotate-glow 10s linear infinite;
          pointer-events: none;
          mask-image: radial-gradient(
            circle at center,
            transparent 0%,
            transparent 47%,
            black 52%,
            black 100%
          );
          -webkit-mask-image: radial-gradient(
            circle at center,
            transparent 0%,
            transparent 47%,
            black 52%,
            black 100%
          );
        }

        .fab-button:hover {
          transform: scale(1.05);
        }

        .fab-button:hover::before {
          filter: blur(7px);
        }

        .fab-button:active {
          transform: scale(0.98);
        }

        .fab-button-pulse::before {
          animation: rotate-glow 10s linear infinite, fab-pulse 4s ease-in-out infinite;
        }

        .fab-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .fab-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        @media (max-width: 640px) {
          .fab-button {
            bottom: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
          }

          .fab-icon {
            width: 28px;
            height: 28px;
          }
        }

        /* Accessibility: Focus state */
        .fab-button:focus-visible {
          outline: 2px solid #3FB292;
          outline-offset: 2px;
        }
      `}</style>

      <button
        className={`fab-button ${!isHovered ? "fab-button-pulse" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat mit NOMI öffnen"
        title="Fragen Sie unseren KI-Assistenten NOMI"
      >
        <div className="fab-icon">
          <img src={novaLogo} alt="NOMI" />
        </div>
      </button>
    </>
  );
};

export default ChatAssistantFAB;
