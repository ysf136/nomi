import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../assets/calendar-custom.css";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "../../styles/tokens";

export default function GespraechVereinbaren() {
  const [date, setDate] = useState<Date | null>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookedDates() {
      const q = query(collection(db, "Termine"));
      const snapshot = await getDocs(q);
      const dates = snapshot.docs
        .map((doc) => (doc.data() as any)?.date)
        .filter(Boolean);
      setBookedDates(dates as string[]);
    }
    fetchBookedDates();
  }, []);

  function isDateBooked(d: Date) {
    const iso = d.toISOString().slice(0, 10);
    return bookedDates.includes(iso);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!date || !name.trim() || !email.trim()) {
      setError("Bitte alle Felder ausfüllen und ein Datum wählen.");
      setLoading(false);
      return;
    }
    if (isDateBooked(date)) {
      setError("Dieses Datum ist bereits gebucht.");
      setLoading(false);
      return;
    }

    try {
      const dateISO = date.toISOString().slice(0, 10);

      await addDoc(collection(db, "Termine"), {
        name,
        email,
        date: dateISO,
        created: new Date().toISOString(),
      });

  navigate("/booking-confirmation", {
        state: {
          title: "Beratungsgespräch mit NOVA",
          date: dateISO,
          name,
          email,
        },
        replace: true,
      });
    } catch (err) {
      setError("Fehler bei der Buchung. Bitte versuchen Sie es erneut.");
      setLoading(false);
    }
  }

  return (
    <motion.div
      style={{
        paddingTop: 48,
        paddingBottom: 48,
        display: "flex",
        justifyContent: "center",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="nova-glass-static"
        style={{
          padding: 32,
          borderRadius: 20,
          maxWidth: 600,
          width: "100%",
        }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          style={{
            fontSize: 28,
            marginBottom: 16,
            textAlign: "center",
            color: tokens.colors.neutral[900],
          }}
        >
          Gespräch vereinbaren
        </h1>
        <p style={{ fontSize: 16, marginBottom: 24, textAlign: "center", color: tokens.colors.neutral[500] }}>
          Wählen Sie einen Termin für Ihr persönliches Beratungsgespräch mit unserem Team.
        </p>

        <motion.div
          style={{ marginBottom: 24 }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Calendar
            onChange={(value) => setDate(value instanceof Date ? value : null)}
            value={date}
            tileDisabled={({ date }) => isDateBooked(date) || date < new Date()}
            className="nova-calendar"
          />
        </motion.div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <motion.input
            whileFocus={{ scale: 1.02, borderColor: tokens.colors.brand.primary, boxShadow: "0 0 0 3px rgba(63,178,146,0.2)" }}
            transition={{ duration: 0.2 }}
            type="text"
            placeholder="Ihr Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="nova-input"
            style={{
              fontSize: 15,
              color: "#111",
            }}
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02, borderColor: tokens.colors.brand.primary, boxShadow: "0 0 0 3px rgba(63,178,146,0.2)" }}
            transition={{ duration: 0.2 }}
            type="email"
            placeholder="Ihre E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="nova-input"
            style={{
              fontSize: 15,
              color: "#111",
            }}
            required
          />

          <motion.button
            type="submit"
            disabled={loading || !date || isDateBooked(date)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="nova-btn nova-btn-primary nova-btn-lg"
            style={{
              cursor: "pointer",
            }}
          >
            {loading ? "Wird gebucht ..." : "Termin buchen"}
          </motion.button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              style={{ color: tokens.colors.status.error, marginTop: 16, textAlign: "center" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
