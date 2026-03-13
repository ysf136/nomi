import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuth } from "../../auth/AuthContext";
import { tokens } from "../../styles/tokens";

interface ProfileData {
  displayName: string;
  role: string;
}

interface DsbData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface NotifData {
  newIncident: boolean;
  deadlineReminder: boolean;
  weeklyReport: boolean;
}

export default function Einstellungen() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const NOVA_GREEN = tokens.colors.brand.primary;
  const NOVA_DARK = tokens.colors.neutral[900];

  // Profile
  const [profile, setProfile] = useState<ProfileData>({ displayName: "", role: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");

  // DSB
  const [dsb, setDsb] = useState<DsbData>({ name: "", email: "", phone: "", company: "" });
  const [dsbSaving, setDsbSaving] = useState(false);
  const [dsbMsg, setDsbMsg] = useState("");

  // Notifications
  const [notif, setNotif] = useState<NotifData>({ newIncident: true, deadlineReminder: true, weeklyReport: false });
  const [notifSaving, setNotifSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setProfile({ displayName: d.displayName || user.displayName || "", role: d.role || "" });
        if (d.dsb) setDsb(d.dsb);
        if (d.notifications) setNotif(d.notifications);
      } else {
        setProfile({ displayName: user.displayName || "", role: "" });
      }
    });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setProfileSaving(true);
    setProfileMsg("");
    try {
      await setDoc(doc(db, "users", user.uid), { displayName: profile.displayName, role: profile.role }, { merge: true });
      setProfileMsg("Gespeichert ✓");
    } catch {
      setProfileMsg("Fehler beim Speichern.");
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(""), 3000);
    }
  };

  const savePassword = async () => {
    if (!user?.email) return;
    if (newPw !== confirmPw) { setPwMsg("Passwörter stimmen nicht überein."); return; }
    if (newPw.length < 8) { setPwMsg("Passwort muss mindestens 8 Zeichen haben."); return; }
    setPwSaving(true);
    setPwMsg("");
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("Nicht eingeloggt");
      const cred = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(firebaseUser, cred);
      await updatePassword(firebaseUser, newPw);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setPwMsg("Passwort erfolgreich geändert ✓");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setPwMsg("Aktuelles Passwort ist falsch.");
      } else {
        setPwMsg("Fehler: " + msg);
      }
    } finally {
      setPwSaving(false);
      setTimeout(() => setPwMsg(""), 5000);
    }
  };

  const saveDsb = async () => {
    if (!user) return;
    setDsbSaving(true);
    setDsbMsg("");
    try {
      await setDoc(doc(db, "users", user.uid), { dsb }, { merge: true });
      setDsbMsg("Gespeichert ✓");
    } catch {
      setDsbMsg("Fehler beim Speichern.");
    } finally {
      setDsbSaving(false);
      setTimeout(() => setDsbMsg(""), 3000);
    }
  };

  const saveNotif = async (updated: NotifData) => {
    if (!user) return;
    setNotifSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), { notifications: updated }, { merge: true });
    } finally {
      setNotifSaving(false);
    }
  };

  const toggleNotif = (key: keyof NotifData) => {
    const updated = { ...notif, [key]: !notif[key] };
    setNotif(updated);
    saveNotif(updated);
  };

  const handleLogout = async () => {
    await logout();
    nav("/");
  };

  // ── Shared styles ──
  const sectionCard: React.CSSProperties = {
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 20,
    padding: "1.75rem",
    marginBottom: "1.25rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
  };
  const label: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" };
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.1)",
    fontSize: 14, background: "rgba(255,255,255,0.9)", color: NOVA_DARK, outline: "none", boxSizing: "border-box",
  };
  const msgStyle = (isError: boolean): React.CSSProperties => ({
    fontSize: 13, color: isError ? "#EF4444" : NOVA_GREEN, fontWeight: 500, marginTop: 8,
  });

  return (
    <div style={{ padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <h1 style={{ margin: "0 0 6px", color: NOVA_DARK, fontSize: 26 }}>⚙️ Einstellungen</h1>
          <p style={{ margin: 0, color: "#6B7280", fontSize: 14 }}>Konto, Profil und Datenschutzbeauftragter verwalten</p>
        </div>

        {/* Profile */}
        <section style={sectionCard}>
          <h2 style={{ margin: "0 0 1.25rem", color: NOVA_DARK, fontSize: 17 }}>👤 Profil</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Anzeigename</label>
              <input
                style={inputStyle}
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                placeholder="z.B. Max Mustermann"
              />
            </div>
            <div>
              <label style={label}>Rolle / Funktion</label>
              <input
                style={inputStyle}
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                placeholder="z.B. Datenschutzkoordinator"
              />
            </div>
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <label style={label}>E-Mail-Adresse</label>
            <input style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} value={user?.email || ""} disabled />
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>E-Mail-Änderung bitte über den Support anfragen.</div>
          </div>
          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={saveProfile} disabled={profileSaving} className="nova-btn nova-btn-primary" style={{ borderRadius: 999, padding: "9px 24px" }}>
              {profileSaving ? "Speichere…" : "Speichern"}
            </button>
            {profileMsg && <span style={msgStyle(!profileMsg.includes("✓"))}>{profileMsg}</span>}
          </div>
        </section>

        {/* Password */}
        <section style={sectionCard}>
          <h2 style={{ margin: "0 0 1.25rem", color: NOVA_DARK, fontSize: 17 }}>🔐 Passwort ändern</h2>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div>
              <label style={label}>Aktuelles Passwort</label>
              <input style={inputStyle} type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="Aktuelles Passwort" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={label}>Neues Passwort</label>
                <input style={inputStyle} type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 8 Zeichen" />
              </div>
              <div>
                <label style={label}>Passwort bestätigen</label>
                <input style={inputStyle} type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Wiederholen" />
              </div>
            </div>
          </div>
          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={savePassword} disabled={pwSaving || !currentPw || !newPw || !confirmPw} className="nova-btn nova-btn-primary" style={{ borderRadius: 999, padding: "9px 24px", opacity: (!currentPw || !newPw || !confirmPw) ? 0.5 : 1 }}>
              {pwSaving ? "Ändere…" : "Passwort ändern"}
            </button>
            {pwMsg && <span style={msgStyle(!pwMsg.includes("✓"))}>{pwMsg}</span>}
          </div>
        </section>

        {/* DSB Stammdaten */}
        <section style={sectionCard}>
          <h2 style={{ margin: "0 0 4px", color: NOVA_DARK, fontSize: 17 }}>🛡️ Datenschutzbeauftragter</h2>
          <p style={{ margin: "0 0 1.25rem", color: "#6B7280", fontSize: 13 }}>Diese Daten werden in Berichten und Dokumenten verwendet.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Name</label>
              <input style={inputStyle} value={dsb.name} onChange={(e) => setDsb({ ...dsb, name: e.target.value })} placeholder="Vor- und Nachname" />
            </div>
            <div>
              <label style={label}>E-Mail</label>
              <input style={inputStyle} type="email" value={dsb.email} onChange={(e) => setDsb({ ...dsb, email: e.target.value })} placeholder="dsb@unternehmen.de" />
            </div>
            <div>
              <label style={label}>Telefon</label>
              <input style={inputStyle} value={dsb.phone} onChange={(e) => setDsb({ ...dsb, phone: e.target.value })} placeholder="+49 000 000000" />
            </div>
            <div>
              <label style={label}>Unternehmen</label>
              <input style={inputStyle} value={dsb.company} onChange={(e) => setDsb({ ...dsb, company: e.target.value })} placeholder="Firmenname" />
            </div>
          </div>
          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={saveDsb} disabled={dsbSaving} className="nova-btn nova-btn-primary" style={{ borderRadius: 999, padding: "9px 24px" }}>
              {dsbSaving ? "Speichere…" : "Speichern"}
            </button>
            {dsbMsg && <span style={msgStyle(!dsbMsg.includes("✓"))}>{dsbMsg}</span>}
          </div>
        </section>

        {/* Notifications */}
        <section style={sectionCard}>
          <h2 style={{ margin: "0 0 1rem", color: NOVA_DARK, fontSize: 17 }}>🔔 Benachrichtigungen</h2>
          {[
            { key: "newIncident" as keyof NotifData, label: "Neuer Vorfall gemeldet", desc: "Sofort-Benachrichtigung bei neuen Datenpannen" },
            { key: "deadlineReminder" as keyof NotifData, label: "Fristenhinweise", desc: "3 Tage vor Ablauf wichtiger Fristen" },
            { key: "weeklyReport" as keyof NotifData, label: "Wöchentlicher Statusbericht", desc: "Jeden Montag eine Zusammenfassung" },
          ].map((item) => (
            <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <div>
                <div style={{ fontWeight: 600, color: NOVA_DARK, fontSize: 14 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{item.desc}</div>
              </div>
              <button
                onClick={() => toggleNotif(item.key)}
                disabled={notifSaving}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative",
                  background: notif[item.key] ? NOVA_GREEN : "#D1D5DB",
                  transition: "background 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: 3, left: notif[item.key] ? 23 : 3,
                  width: 18, height: 18, borderRadius: "50%", background: "white",
                  transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>
          ))}
        </section>

        {/* Account actions */}
        <section style={sectionCard}>
          <h2 style={{ margin: "0 0 1rem", color: NOVA_DARK, fontSize: 17 }}>Konto</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={handleLogout} className="nova-btn nova-btn-ghost" style={{ borderRadius: 999 }}>
              Abmelden
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
