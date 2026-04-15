import { useState, useEffect, useRef } from "react";
import { CiLocationOn } from "react-icons/ci";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import logo from "../../assets/alumni/ruetlogo.png";



// ── API Base ────────────────────────────────────────────────────
const API = import.meta.env.VITE_ALUMNI_API_BASE_URL || "https://alumni-backend-ouyo.onrender.com/api/alumni";
const IMG = import.meta.env.VITE_ALUMNI_IMAGE_BASE_URL || "https://alumni-backend-ouyo.onrender.com";

const api = {
  getAll:   (search = "") =>
    fetch(`${API}${search ? `?search=${encodeURIComponent(search)}` : ""}`).then(r => r.json()),

  register: (formData) =>
    fetch(`${API}/register`, { method: "POST", body: formData }).then(r => r.json()),

  login:    (roll) =>
    fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roll }),
    }).then(r => r.json()),

  update:   (roll, formData) =>
    fetch(`${API}/${roll}`, { method: "PUT", body: formData }).then(r => r.json()),
};

// ── Helpers ─────────────────────────────────────────────────────
const initials = (name = "") =>
  name.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase()).join("");

const SERIES_COLORS = [
  // "from-violet-500 to-purple-600",
  // "from-cyan-500 to-blue-600",
  // "from-emerald-500 to-teal-600",
  // "from-rose-500 to-pink-600",
  // "from-amber-500 to-orange-600",
  "from-indigo-500 to-blue-700",
];
const seriesColor = (series) =>
  SERIES_COLORS[Number(String(series).slice(-1)) % SERIES_COLORS.length];

// ── Msg Component ────────────────────────────────────────────────
const Msg = ({ type, text }) => {
  if (!text) return null;
  return (
    <div className={`rounded-xl px-4 py-3 text-sm mb-4 border backdrop-blur-sm ${
      type === "error"
        ? "bg-red-500/10 border-red-500/30 text-red-300"
        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
    }`}>
      {text}
    </div>
  );
};

// ── Input Component ──────────────────────────────────────────────
const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    <input
      className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/30 transition-all"
      {...props}
    />
  </div>
);

// ── Register Modal ───────────────────────────────────────────────
function RegisterModal({ onSuccess, onClose }) {
  const [form, setForm] = useState({
    name: "", roll: "", series: "", presentAddress: "",
    hometown: "", job: "", email: "", phone: "",
  });
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState({ type: "", text: "" });
  const fileRef               = useRef();

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const pickFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    const required = ["name","roll","series","presentAddress","hometown","job","email","phone"];
    if (required.some(k => !form[k]))
      return setMsg({ type: "error", text: "Please fill in all fields" });

    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      const fd = new FormData();
      required.forEach(k => fd.append(k, form[k]));
      if (picture) fd.append("picture", picture);

      const res = await api.register(fd);
      if (!res.success) return setMsg({ type: "error", text: res.message });
      setMsg({ type: "success", text: "✓ Registered successfully!" });
      setTimeout(() => { onSuccess(res.data); onClose(); }, 1000);
    } catch {
      setMsg({ type: "error", text: "Cannot connect to the server." });
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-slate-900/95 border border-slate-700/60 rounded-2xl p-6 overflow-y-auto max-h-[90vh] shadow-2xl shadow-violet-500/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Register
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">Register Alumni Information</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl transition-colors">✕</button>
        </div>

        <Msg {...msg} />

        {/* Picture upload */}
        <div className="mb-5 flex flex-col items-center">
          <div
            onClick={() => fileRef.current.click()}
            className="w-20 h-20 rounded-full border-2 border-dashed border-violet-500/50 flex items-center justify-center cursor-pointer overflow-hidden hover:border-violet-400 transition-all bg-slate-800/50 group"
          >
            {preview
              ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
              : <div className="text-center">
                  <div className="text-2xl">📷</div>
                  <div className="text-slate-500 text-xs mt-0.5 group-hover:text-violet-400">Photo</div>
                </div>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
          <p className="text-slate-600 text-xs mt-2">Click to upload photo (max 5MB)</p>
        </div>

        {/* Two-column grid for fields */}
        <div className="grid grid-cols-2 gap-x-4">
          <div className="col-span-2"><Input label="Full Name" name="name" placeholder="Full Name" value={form.name} onChange={set} /></div>
          <Input label="Roll Number" name="roll" placeholder="e.g. 2018-CS-001" value={form.roll} onChange={set} />
          <Input label="Series " name="series" type="number" placeholder="e.g. 18" value={form.series} onChange={set} />
          <div className="col-span-2"><Input label="Present Adress" name="presentAddress" placeholder="Present Address" value={form.presentAddress} onChange={set} /></div>
          <div className="col-span-2"><Input label="Parmanent Adress" name="hometown" placeholder="Hometown" value={form.hometown} onChange={set} /></div>
          <div className="col-span-2"><Input label=" Job" name="job" placeholder="e.g. Software Engineer @ Google" value={form.job} onChange={set} /></div>
          <Input label="Email" name="email" type="email" placeholder="email@example.com" value={form.email} onChange={set} />
          <Input label="Phone" name="phone" placeholder="+880 1XXX-XXXXXX" value={form.phone} onChange={set} />
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-linear-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 text-sm"
          >
            {loading ? "Saving..." : "Register"}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 border border-slate-600 text-slate-300 rounded-xl hover:border-slate-400 transition-all text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Login Modal — roll verify করে সরাসরি UpdateModal খোলে ──────
function LoginModal({ onSuccess, onClose }) {
  const [roll, setRoll] = useState("");
  const [loading, setL] = useState(false);
  const [msg, setMsg]   = useState({ type: "", text: "" });

  const submit = async () => {
    if (!roll.trim()) return setMsg({ type: "error", text: "Give your roll number" });
    setL(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await api.login(roll.trim());
      if (!res.success) {
        setMsg({ type: "error", text: res.message });
        setL(false);
        return;
      }
      // Login modal বন্ধ করে সরাসরি UpdateModal এ পাঠাও
      onSuccess(res.data);
    } catch {
      setMsg({ type: "error", text: "Server connect করা যাচ্ছে না।" });
      setL(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-slate-900/95 border border-slate-700/60 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Login
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Enter your roll number — update your profile directly.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl transition-colors">✕</button>
        </div>

        <Msg {...msg} />

        <Input
          label="Roll Number"
          placeholder="Give your roll number"
          value={roll}
          onChange={e => setRoll(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          autoFocus
        />

        <div className="flex gap-3 mt-2">
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-linear-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </span>
            ) : "Continue →"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-600 text-slate-300 rounded-xl hover:border-slate-400 transition-all text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Update Modal ─────────────────────────────────────────────────
function UpdateModal({ user, onSuccess, onClose }) {
  const [form, setForm] = useState({
    name:           user.name           || "",
    series:         user.series         || "",
    presentAddress: user.presentAddress || "",
    hometown:       user.hometown       || "",
    job:            user.job            || "",
    email:          user.email          || "",
    phone:          user.phone          || "",
  });
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(user.picture ? `${IMG}${user.picture}` : null);
  const [loading, setL]       = useState(false);
  const [msg, setMsg]         = useState({ type: "", text: "" });
  const fileRef               = useRef();

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const pickFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    setL(true);
    setMsg({ type: "", text: "" });
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (picture) fd.append("picture", picture);

      const res = await api.update(user.roll, fd);
      if (!res.success) return setMsg({ type: "error", text: res.message });
      setMsg({ type: "success", text: "✓ Information updated!" });
      setTimeout(() => { onSuccess(res.data); onClose(); }, 900);
    } catch {
      setMsg({ type: "error", text: "Cannot connect to the server." });
    }
    setL(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-slate-900/95 border border-slate-700/60 rounded-2xl p-6 overflow-y-auto max-h-[90vh] shadow-2xl shadow-violet-500/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Update Profile</h2>
            <p className="text-slate-500 text-xs mt-0.5">Roll: <span className="text-violet-400 font-mono">{user.roll}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl transition-colors">✕</button>
        </div>
        <Msg {...msg} />

        {/* Photo */}
        <div className="mb-5 flex flex-col items-center">
          <div
            onClick={() => fileRef.current.click()}
            className="w-20 h-20 rounded-full border-2 border-dashed border-violet-500/50 flex items-center justify-center cursor-pointer overflow-hidden hover:border-violet-400 transition-all bg-slate-800/50"
          >
            {preview
              ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
              : <div className="text-2xl">📷</div>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
          <p className="text-slate-600 text-xs mt-1.5">Click to change photo</p>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <div className="col-span-2"><Input label="Full Name" name="name" value={form.name} onChange={set} /></div>
          <Input label="Series (Year)" name="series" type="number" value={form.series} onChange={set} />
          <Input label="Phone" name="phone" value={form.phone} onChange={set} />
          <div className="col-span-2"><Input label="Present Adress" name="presentAddress" value={form.presentAddress} onChange={set} /></div>
          <div className="col-span-2"><Input label="Parmanent Adress" name="hometown" value={form.hometown} onChange={set} /></div>
          <div className="col-span-2"><Input label=" Job" name="job" value={form.job} onChange={set} /></div>
          <div className="col-span-2"><Input label="Email" name="email" type="email" value={form.email} onChange={set} /></div>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-linear-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 text-sm"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 border border-slate-600 text-slate-300 rounded-xl hover:border-slate-400 transition-all text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Alumni Card ──────────────────────────────────────────────────


// ── Alumni Card  (Sci-Fi HUD design) ────────────────────────────
function AlumniCard({ alumni }) {
  const GLOW_COLORS = [
    // { ring: "#a855f7,#06b6d4", corner: "#7c3aed", glow: "rgba(168,85,247,0.45)" },
    // { ring: "#06b6d4,#6366f1", corner: "#0891b2", glow: "rgba(6,182,212,0.45)"  },
    // { ring: "#10b981,#06b6d4", corner: "#059669", glow: "rgba(16,185,129,0.45)" },
    // { ring: "#f43f5e,#a855f7", corner: "#be123c", glow: "rgba(244,63,94,0.45)"  },
    // { ring: "#f59e0b,#ef4444", corner: "#d97706", glow: "rgba(245,158,11,0.45)" },
    { ring: "#6366f1,#a855f7", corner: "#4338ca", glow: "rgba(99,102,241,0.45)" },
  ];
  const c = GLOW_COLORS[Number(String(alumni.series || 0).slice(-1)) % GLOW_COLORS.length];
  const [c1, c2] = c.ring.split(",");
 
  return (
    <div
      className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 60%, #0a0a1a 100%)",
        border: `1px solid ${c1}55`,
        borderRadius: "16px",
        boxShadow: `0 0 32px ${c.glow}, inset 0 0 32px rgba(0,0,0,0.6)`,
      }}
    >
      {/* ── Starfield background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: "16px" }}>
        {[...Array(28)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width:   i % 5 === 0 ? "2px" : "1px",
              height:  i % 5 === 0 ? "2px" : "1px",
              top:     `${(i * 37 + 11) % 100}%`,
              left:    `${(i * 53 + 7)  % 100}%`,
              opacity: i % 3 === 0 ? 0.6 : 0.25,
            }}
          />
        ))}
      </div>
 
      {/* ── Corner brackets (HUD frame) ── */}
      {[
        { top: 0,    left: 0,    bt: "t", bl: "l" },
        { top: 0,    right: 0,   bt: "t", bl: "r" },
        { bottom: 0, left: 0,    bt: "b", bl: "l" },
        { bottom: 0, right: 0,   bt: "b", bl: "r" },
      ].map((pos, i) => (
        <div key={i} className="absolute w-5 h-5 pointer-events-none" style={{ ...pos }}>
          <div style={{
            position: "absolute",
            [pos.bt]: 0, [pos.bl]: 0,
            width: "100%", height: "2px",
            background: c.corner,
            boxShadow: `0 0 6px ${c.corner}`,
          }} />
          <div style={{
            position: "absolute",
            [pos.bt]: 0, [pos.bl]: 0,
            width: "2px", height: "100%",
            background: c.corner,
            boxShadow: `0 0 6px ${c.corner}`,
          }} />
        </div>
      ))}
 
      {/* ── Series badge (top center) ── */}
      <div className="flex justify-center pt-4 pb-1 relative z-10">
        <div
          className="text-white text-[11px] font-bold px-5 py-1 tracking-widest"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
            border: `1px solid ${c1}66`,
            borderRadius: "0 0 12px 12px",
            clipPath: "polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%)",
            boxShadow: `0 2px 12px ${c.glow}`,
          }}
        >
          Series {alumni.series}
        </div>
      </div>
 
      {/* ── Avatar with neon ring ── */}
      <div className="flex justify-center mt-3 mb-4 relative z-10">
        <div className="relative">
          {/* Outer glow ring */}
          <div
            className="absolute -inset-1.5 rounded-full"
            style={{
              background: `conic-gradient(${c1}, ${c2}, ${c1})`,
              filter: "blur(2px)",
              opacity: 0.85,
            }}
          />
          {/* White separator ring */}
          <div className="absolute -inset-0.5 rounded-full bg-[#0d0d2b]" />
          {/* Photo */}
          {alumni.picture ? (
            <img
              src={`${IMG}${alumni.picture}`}
              alt={alumni.name}
              className="relative w-24 h-24 rounded-full object-cover z-10"
              style={{ boxShadow: `0 0 20px ${c.glow}` }}
            />
          ) : (
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center z-10 text-white font-extrabold text-3xl"
              style={{
                background: `linear-gradient(135deg, ${c1}, ${c2})`,
                boxShadow: `0 0 20px ${c.glow}`,
              }}
            >
              {initials(alumni.name)}
            </div>
          )}
        </div>
      </div>
 
      {/* ── Name + Roll + Job ── */}
      <div className="text-center px-5 pb-1 relative z-10">
        <h3 className="text-white font-bold text-lg leading-tight tracking-wide">{alumni.name}</h3>
        <p
          className="text-xs font-mono mt-0.5 tracking-[0.18em]"
          style={{ color: c1 }}
        >
          {alumni.roll}
        </p>
        {/* Divider line under name */}
        <div
          className="mx-auto my-2.5 h-px"
          style={{
            width: "70%",
            background: `linear-gradient(90deg, transparent, ${c1}88, ${c2}88, transparent)`,
          }}
        />
        <p className="text-slate-300 text-[13px] font-medium">{alumni.job}</p>
      </div>
 
      {/* ── Divider ── */}
      <div
        className="mx-5 my-3 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${c1}44, ${c2}44, transparent)` }}
      />
 
      {/* ── Info rows ── */}
      <div className="px-5 pb-5 space-y-2.5 relative z-10">
        
        <div className="flex items-center  gap-2">
             <p style={{ color: c1, borderColor: c1  }}  className="border  opacity-85  p-1 rounded-md"> <CiLocationOn className="" color={c1} size={17} /></p>
              <p className="text-[13px] pl-1 opacity-85">{alumni.presentAddress}</p>
         </div>
        <div className="flex items-center  gap-2">
             <p style={{ color: c1, borderColor: c1  }}  className="border  opacity-85  p-1 rounded-md"> <AiOutlineHome className="" color={c1} size={17} /></p>
              <p className="text-[13px] pl-1 opacity-85">{alumni.hometown}</p>
         </div>
        <div className="flex items-center  gap-2">
             <p style={{ color: c1, borderColor: c1  }}  className="border  opacity-85  p-1 rounded-md"> <MdOutlineMailOutline className="" color={c1} size={17} /></p>
              <p className="text-[13px] pl-1 opacity-85">{alumni.email}</p>
         </div>
        <div className="flex items-center  gap-2">
             <p style={{ color: c1, borderColor: c1  }}  className="border  opacity-85  p-1 rounded-md"> <MdOutlinePhone   className="" color={c1} size={17} /></p>
              <p className="text-[13px] pl-1 opacity-85">{alumni.phone}</p>
         </div>
        {/* <HudRow icon="⌂" svg color={c1} value={alumni.hometown} />
        <HudRow icon="◈" svg color={c1} value={alumni.email} />
        <HudRow icon="◎" svg color={c1} value={alumni.phone} /> */}
      </div>
    </div>
  );
}
 
function HudRow({ icon, color, value }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-7 h-7 shrink-0 flex items-center justify-center rounded-md text-sm font-bold"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}44`,
          color: color,
          boxShadow: `0 0 8px ${color}33`,
        }}
      >
        {icon}
      </div>
      <span className="text-slate-300 text-[13px] leading-snug break-all">{value}</span>
    </div>
  );
}

// ── Series Group Header ──────────────────────────────────────────
function SeriesHeader({ series }) {
  const grad = seriesColor(series);
  return (
    <div className="col-span-full flex items-center gap-4 mt-6 mb-2">
      <div className={`h-px flex-1 bg-linear-to-r ${grad} opacity-40`} />
      <div className={`bg-linear-to-r ${grad} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow`}>
        ✦ Series {series}
      </div>
      <div className={`h-px flex-1 bg-linear-to-l ${grad} opacity-40`} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  MAIN — AlumniPage
// ════════════════════════════════════════════════════════════════
export default function AlumniPage() {
  const [alumni,       setAlumni]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState("");
  const [modal,        setModal]        = useState(null); // "register"|"login"|"update"
  const [editTarget,   setEditTarget]   = useState(null);
  const [search,       setSearch]       = useState("");
  const [searchInput,  setSearchInput]  = useState("");
  const debounceRef = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────
  const fetchAlumni = async (q = search) => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await api.getAll(q);
      setAlumni(res.data || []);
    } catch {
      setFetchError("Cannot connect to the server. Please make sure node server.js is running.");
    }
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await api.getAll("");
        if (active) setAlumni(res.data || []);
      } catch {
        if (active) setFetchError("Cannot connect to the server.");
      }
      if (active) setLoading(false);
    };
    load();
    return () => { active = false; };
  }, []);

  // ── Debounced search ───────────────────────────────────────
  const handleSearch = (val) => {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      fetchAlumni(val);
    }, 400);
  };

  // ── Group alumni by series ─────────────────────────────────
  const grouped = alumni.reduce((acc, a) => {
    const s = a.series || "Unknown";
    if (!acc[s]) acc[s] = [];
    acc[s].push(a);
    return acc;
  }, {});
  const sortedSeries = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));

  // ── Handlers ──────────────────────────────────────────────
  const closeModal = ()       => { setModal(null); setEditTarget(null); };

  const onRegister = (newAlumni) => {
    setAlumni(prev => [...prev, newAlumni].sort((a, b) => a.series - b.series || a.roll.localeCompare(b.roll)));
  };

  const onUpdateSuccess = (updated) => {
    setAlumni(prev => prev.map(a => a.roll === updated.roll ? updated : a));
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-x-hidden">

      {/* ── Background grid ──────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Navbar ───────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {/* <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-500/30">
              <img src="/src/assets/ruetlogo.png" alt="" />
            </div> */}
            <img className="w-auto h-13 rounded-lg  " src={logo} alt="" />
            <span className="font-bold text-lg bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              Alumni Portal
            </span>
          </div>

          {/* Search bar */}
          <div className="flex-1 hidden md:block max-w-sm relative">
            {/* <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span> */}
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"><CiSearch /></span>
            <input
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all"
              placeholder="Search Name, Roll, Series ....."
              value={searchInput}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setModal("login")}
              className="px-4 py-2 text-sm font-medium text-slate-300 border border-slate-600/60 rounded-xl hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => setModal("register")}
              className="px-4 py-2 text-sm font-semibold bg-linear-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl transition-all shadow-lg shadow-violet-500/20"
            >
              Register
            </button>
          </div>
        </div>
      </nav>
     <div className="flex-1 m-4 md:hidden max-w-sm relative">
            {/* <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span> */}
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"><CiSearch /></span>
            <input
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all"
              placeholder="Search Name, Roll, Series ....."
              value={searchInput}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
      {/* ── Hero ─────────────────────────────────────────── */}
      {/* <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center"> */}
        {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-400 text-xs font-medium mb-5">
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
          RUET Alumni Network
        </div> */}
        {/* <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Connect with
          </span>
          <br />
          <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Our Alumni
          </span>
        </h1> */}
        {/* <p className="text-slate-400 text-base max-w-xl mx-auto mb-8">
          সকল alumni-দের তথ্য একটি জায়গায় — Series অনুযায়ী সাজানো
        </p> */}

        {/* Stats */}
        {/* <div className="inline-flex gap-8 px-8 py-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <StatBox value={alumni.length}      label="Total Alumni" color="text-violet-400" />
          <div className="w-px bg-slate-800" />
          <StatBox value={sortedSeries.length} label="Series"       color="text-cyan-400" />
          <div className="w-px bg-slate-800" />
        </div> */}
      {/* </div> */}

      {/* ── Content ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Loading alumni data...</p>
          </div>
        ) : fetchError ? (
          <div className="max-w-md mx-auto py-12">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
              <div className="text-3xl mb-3">⚠️</div>
              <p className="text-red-300 text-sm mb-4">{fetchError}</p>
              <button
                onClick={() => fetchAlumni("")}
                className="px-5 py-2 bg-linear-to-r from-violet-600 to-cyan-600 text-white text-sm rounded-xl"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : alumni.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-slate-400 text-base">
              {searchInput ? "No Result Found" : "No alumni have registered yet."}
            </p>
          </div>
        ) : (
          <>
            {sortedSeries.map(series => (
              <div key={series}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <SeriesHeader series={series} />
                  {grouped[series].map(a => (
                    <AlumniCard
                      key={a._id}
                      alumni={a}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-slate-600 text-xs">
        Alumni Portal • RUET • Express + MongoDB • {new Date().getFullYear()}
      </footer>

      {/* ── Modals ───────────────────────────────────────── */}
      {modal === "register" && (
        <RegisterModal onSuccess={onRegister} onClose={closeModal} />
      )}
      {modal === "login" && (
        <LoginModal
          onSuccess={u => {
            // setLoggedInUser(u);
            setEditTarget(u);
            setModal("update");
          }}
          onClose={closeModal}
        />
      )}
      {modal === "update" && editTarget && (
        <UpdateModal user={editTarget} onSuccess={onUpdateSuccess} onClose={closeModal} />
      )}
    </div>
  );
}

// ── Stat box ─────────────────────────────────────────────────────
function StatBox({ value, label, color }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-slate-500 text-xs mt-0.5">{label}</div>
    </div>
  );
}