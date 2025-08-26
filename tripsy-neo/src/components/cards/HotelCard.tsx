"use client";
import { motion } from "framer-motion";
type Hotel = { name:string; area:string; price:string; rating:number };
export default function HotelCard({ hotels, place }:{ hotels:Hotel[]; place:string }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }} animate={{ y:0, opacity:1 }} transition={{ duration:.35, delay:.12 }}
      className="tripsy-panel tripsy-glow p-4"
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <h3 className="tripsy-title" style={{fontWeight:700}}>Stays · {place}</h3>
        <span className="tripsy-muted" style={{fontSize:12}}>sample picks</span>
      </div>
      <div style={{display:"grid",gap:10}}>
        {hotels.map((h, i) => (
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",border:"1px solid rgba(255,255,255,.06)",borderRadius:10}}>
            <div>
              <div style={{fontWeight:600}}>{h.name}</div>
              <div className="tripsy-muted" style={{fontSize:12}}>{h.area} · ★ {h.rating.toFixed(1)}</div>
            </div>
            <div style={{color:"var(--neon)",fontWeight:700}}>{h.price}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
