import React, { useEffect, useState } from "react";

export default function NovaWelcome() {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 1500);
    const remove = setTimeout(() => setVisible(false), 2000);
    return () => { clearTimeout(timer); clearTimeout(remove); };
  }, []);

  if (!visible) return null;
  return (
    <div className="nova-welcome" style={{ animation: fade ? "fadeOutNova 0.5s forwards" : undefined }}>
      <div className="nova-welcome-text">Willkommen bei NOVA</div>
    </div>
  );
}
