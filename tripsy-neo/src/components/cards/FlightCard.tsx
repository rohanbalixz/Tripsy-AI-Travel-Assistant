"use client";
import { motion } from "framer-motion";
type Flight = { from:string; to:string; date:string; price:string; carrier:string };
export default function FlightCard({ flights, place }:{ flights:Flight[]; place:string }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }} animate={{ y:0, opacity:1 }} transition={{ duration:.35, delay:.05 }}
      className="tripsy-panel tripsy-glow p-4"
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <h3 className="tripsy-title" style={{fontWeight:700}}>Flights · {place}</h3>
        <span className="tripsy-muted" style={{fontSize:12}}>sample prices</span>
      </div>
      <div style={{display:"grid",gap:10}}>
        {flights.map((f, i) => (
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",border:"1px solid rgba(255,255,255,.06)",borderRadius:10}}>
            <div>
              <div style={{fontWeight:600}}>{f.from} → {f.to}</div>
              <div className="tripsy-muted" style={{fontSize:12}}>{f.date} · {f.carrier}</div>
            </div>
            <div style={{color:"var(--neon)",fontWeight:700}}>{f.price}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
