import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Clock3, HeartPulse, LogIn, LogOut, Menu, Stethoscope,
  UserPlus, Users, X, CheckCircle2, XCircle, ClipboardList, Sparkles,
  Search, MapPin, ShieldCheck
} from "lucide-react";
import { api } from "./api";

const today = new Date().toISOString().slice(0, 10);

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("clinicUser") || "null"));
  const [view, setView] = useState(user ? (user.role === "STAFF" ? "staff" : "home") : "login");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [toast, setToast] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const loadDoctors = async () => {
    try { setDoctors(await api.doctors()); }
    catch (e) { notify(e.message, "error"); }
  };

  const loadAppointments = async () => {
    if (!user) return;
    try {
      setAppointments(user.role === "STAFF"
        ? await api.appointments()
        : await api.patientAppointments(user.id));
    } catch (e) { notify(e.message, "error"); }
  };

  useEffect(() => { loadDoctors(); }, []);
  useEffect(() => { loadAppointments(); }, [user]);

  const login = (u) => {
    setUser(u);
    localStorage.setItem("clinicUser", JSON.stringify(u));
    setView(u.role === "STAFF" ? "staff" : "home");
    notify(`Welcome, ${u.name.split(" ")[0]}!`);
  };

  const logout = () => {
    localStorage.removeItem("clinicUser");
    setUser(null);
    setView("login");
    notify("Logged out.");
  };

  const navigate = (next) => {
    setView(next);
    setMobileOpen(false);
  };

  if (!user) {
    return (
      <>
        <AuthPage onLogin={login} notify={notify} />
        <Toast toast={toast} />
      </>
    );
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <button className="brand" onClick={() => navigate(user.role === "STAFF" ? "staff" : "home")}>
          <span className="brand-icon"><HeartPulse size={22}/></span>
          <span><b>BloomCare</b><small>Clinic Appointments</small></span>
        </button>
        <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X/> : <Menu/>}
        </button>
        <nav className={mobileOpen ? "nav-links open" : "nav-links"}>
          {user.role === "PATIENT" && <>
            <button className={view === "home" ? "active" : ""} onClick={() => navigate("home")}>Home</button>
            <button className={view === "doctors" ? "active" : ""} onClick={() => navigate("doctors")}>Doctors</button>
            <button className={view === "book" ? "active" : ""} onClick={() => navigate("book")}>Book</button>
            <button className={view === "my" ? "active" : ""} onClick={() => navigate("my")}>My Appointments</button>
          </>}
          {user.role === "STAFF" && <button className={view === "staff" ? "active" : ""} onClick={() => navigate("staff")}>Staff Dashboard</button>}
          <div className="user-chip"><span className="avatar">{user.name.charAt(0).toUpperCase()}</span>{user.name}</div>
          <button className="logout-btn" onClick={logout}><LogOut size={16}/> Logout</button>
        </nav>
      </header>

      <main className="page">
        {user.role === "PATIENT" && view === "home" && <Home onBook={() => navigate("book")} doctors={doctors} />}
        {user.role === "PATIENT" && view === "doctors" && <Doctors doctors={doctors} onBook={() => navigate("book")} />}
        {user.role === "PATIENT" && view === "book" && <BookAppointment user={user} doctors={doctors} onDone={() => { loadAppointments(); navigate("my"); }} notify={notify} />}
        {user.role === "PATIENT" && view === "my" && <MyAppointments appointments={appointments} onCancel={async id => { try { await api.cancel(id); notify("Appointment cancelled."); loadAppointments(); } catch(e){notify(e.message,"error")} }} />}
        {user.role === "STAFF" && view === "staff" && <StaffDashboard appointments={appointments} refresh={loadAppointments} notify={notify} />}
      </main>

      <footer><HeartPulse size={15}/> BloomCare • Simple Clinic Appointment Booking • Hackathon Edition</footer>
      <Toast toast={toast} />
    </div>
  );
}

function AuthPage({ onLogin, notify }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"PATIENT" });
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    try {
      const user = mode === "login"
        ? await api.login({ email: form.email, password: form.password })
        : await api.register(form);
      onLogin(user);
    } catch (err) { notify(err.message, "error"); }
    finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <div className="flower flower-a">✿</div><div className="flower flower-b">❀</div>
      <div className="auth-visual">
        <div className="pulse-logo"><HeartPulse size={48}/></div>
        <h1>Care that feels<br/><em>personal.</em></h1>
        <p>Book the right doctor, choose your time, and keep every appointment in one calm place.</p>
        <div className="mini-stats"><span><CheckCircle2/> Easy booking</span><span><Clock3/> No double slots</span></div>
      </div>
      <div className="auth-card">
        <div className="logo-row"><span className="brand-icon"><HeartPulse/></span><span><b>BloomCare</b><small>Clinic Appointments</small></span></div>
        <div className="tabs"><button className={mode==="login"?"selected":""} onClick={()=>setMode("login")}><LogIn size={17}/> Login</button><button className={mode==="register"?"selected":""} onClick={()=>setMode("register")}><UserPlus size={17}/> Register</button></div>
        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="muted">{mode === "login" ? "Enter your details to continue." : "Register in less than a minute."}</p>
        <form onSubmit={submit}>
          {mode === "register" && <label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Lakshmi Thota"/></label>}
          <label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
          <label>Password<input required type="password" minLength="4" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Minimum 4 characters"/></label>
          {mode === "register" && <label>Account type<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="PATIENT">Patient</option><option value="STAFF">Clinic Staff</option></select></label>}
          <button className="primary full" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Login to BloomCare" : "Create account"}</button>
        </form>
        <div className="demo-box"><ShieldCheck size={18}/><span><b>Hackathon demo staff</b><br/>staff@clinic.local / staff123</span></div>
        <small className="security-note">Demo app: no JWT, OAuth, or Spring Security is used, as requested.</small>
      </div>
    </div>
  );
}

function Home({ onBook, doctors }) {
  return <div className="fade-up">
    <section className="hero">
      <div><span className="eyebrow"><Sparkles size={15}/> SMARTER CLINIC CARE</span><h1>Your health,<br/><em>on your time.</em></h1><p>Find a specialist, choose an available slot, and book your clinic visit without waiting in line.</p><button className="primary" onClick={onBook}>Book an appointment <CalendarDays size={18}/></button></div>
      <div className="hero-art"><div className="blob"></div><div className="doctor-illustration"><Stethoscope size={68}/><span>♥</span></div><div className="floating-card"><CheckCircle2/> <span><b>Simple & quick</b><small>Your slot is reserved</small></span></div></div>
    </section>
    <section className="section"><div className="section-head"><div><span className="eyebrow">OUR DOCTORS</span><h2>Care from specialists</h2></div><span className="pill">{doctors.length} doctors</span></div><div className="doctor-grid">{doctors.slice(0,4).map(d=><DoctorCard key={d.id} doctor={d}/>)}</div></section>
    <section className="info-strip"><div><Users/><b>Patient friendly</b><span>Easy registration and booking</span></div><div><Clock3/><b>Available slots</b><span>See doctor schedules before booking</span></div><div><ClipboardList/><b>Track visits</b><span>View or cancel upcoming appointments</span></div></section>
  </div>;
}

function Doctors({ doctors, onBook }) {
  const [q, setQ] = useState("");
  const filtered = doctors.filter(d => `${d.name} ${d.specialization}`.toLowerCase().includes(q.toLowerCase()));
  return <div className="fade-up"><PageTitle icon={<Stethoscope/>} title="Our doctors" subtitle="Choose a specialist based on expertise and availability."/>
    <div className="search-box"><Search size={18}/><input placeholder="Search doctor or specialization..." value={q} onChange={e=>setQ(e.target.value)}/></div>
    <div className="doctor-grid">{filtered.map(d=><DoctorCard key={d.id} doctor={d} onBook={onBook}/>)}</div>
  </div>;
}

function DoctorCard({ doctor, onBook }) {
  return <article className="doctor-card">
    <div className="doctor-top"><div className="doctor-avatar">{doctor.name.replace("Dr. ","").split(" ").map(x=>x[0]).join("").slice(0,2)}</div><span className="available"><span/> Available</span></div>
    <h3>{doctor.name}</h3><p className="speciality">{doctor.specialization}</p>
    <div className="doctor-detail"><CalendarDays size={15}/><span>{doctor.availableDays}</span></div>
    <div className="doctor-detail"><Clock3 size={15}/><span>{doctor.slots.split(",").slice(0,3).join(" • ")}{doctor.slots.split(",").length>3?" • ...":""}</span></div>
    <div className="doctor-detail"><MapPin size={15}/><span>{doctor.room}</span></div>
    {onBook && <button className="outline full" onClick={onBook}>Book with doctor</button>}
  </article>;
}

function BookAppointment({ user, doctors, onDone, notify }) {
  const [form, setForm] = useState({ doctorId:"", date:today, timeSlot:"", reason:"" });
  const doctor = doctors.find(d => String(d.id) === String(form.doctorId));
  const available = useMemo(() => doctor ? doctor.slots.split(",").map(s=>s.trim()) : [], [doctor]);
  const dayName = form.date ? new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {weekday:"long"}) : "";
  const dayOk = doctor ? doctor.availableDays.split(",").some(d=>d.trim().toLowerCase() === dayName.toLowerCase()) : false;
  const [busy,setBusy]=useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!doctor || !dayOk || !form.timeSlot) return notify("Please choose a valid doctor, date and time slot.", "error");
    setBusy(true);
    try {
      await api.book({ patientId:user.id, doctorId:Number(form.doctorId), appointmentDate:form.date, timeSlot:form.timeSlot, reason:form.reason });
      notify("Appointment booked successfully!");
      onDone();
    } catch(e) { notify(e.message,"error"); }
    finally { setBusy(false); }
  };

  return <div className="fade-up"><PageTitle icon={<CalendarDays/>} title="Book an appointment" subtitle="Pick a doctor and an available time slot."/>
    <form className="booking-card" onSubmit={submit}>
      <div className="form-grid">
        <label>Doctor<select required value={form.doctorId} onChange={e=>setForm({...form,doctorId:e.target.value,timeSlot:""})}><option value="">Select doctor</option>{doctors.map(d=><option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}</select></label>
        <label>Appointment date<input required type="date" min={today} value={form.date} onChange={e=>setForm({...form,date:e.target.value,timeSlot:""})}/></label>
      </div>
      {doctor && <div className={dayOk ? "schedule-ok" : "schedule-warning"}>{dayOk ? <CheckCircle2/> : <XCircle/>}<span>{dayOk ? `${doctor.name} is available on ${dayName}.` : `${doctor.name} is not available on ${dayName}. Available: ${doctor.availableDays}.`}</span></div>}
      <label>Available time slot<div className="slot-grid">{available.map(slot=><button type="button" key={slot} className={form.timeSlot===slot?"slot selected":"slot"} disabled={!dayOk} onClick={()=>setForm({...form,timeSlot:slot})}><Clock3 size={15}/>{slot}</button>)}</div></label>
      <label>Reason for visit<textarea required rows="4" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} placeholder="Briefly describe why you are visiting..."/></label>
      <div className="booking-actions"><span>Logged in as <b>{user.name}</b></span><button className="primary" disabled={busy}>{busy ? "Booking..." : "Confirm appointment"} <CheckCircle2 size={18}/></button></div>
    </form>
  </div>;
}

function MyAppointments({ appointments, onCancel }) {
  const upcoming = appointments.filter(a => a.status !== "CANCELLED" && a.status !== "COMPLETED");
  return <div className="fade-up"><PageTitle icon={<ClipboardList/>} title="My appointments" subtitle="Your booked visits are stored in the clinic database."/>
    {appointments.length===0 ? <EmptyState/> : <div className="appointment-list">{appointments.map(a=><AppointmentCard key={a.id} a={a} onCancel={onCancel}/>)}</div>}
    {upcoming.length>0 && <div className="soft-note"><Sparkles size={17}/> You have {upcoming.length} upcoming appointment{upcoming.length>1?"s":""}.</div>}
  </div>;
}

function AppointmentCard({a,onCancel,staff=false,refresh,notify}) {
  return <article className="appointment-card">
    <div className="date-box"><b>{new Date(a.appointmentDate+"T00:00:00").getDate()}</b><span>{new Date(a.appointmentDate+"T00:00:00").toLocaleDateString("en-US",{month:"short"})}</span></div>
    <div className="appointment-main"><div><h3>{a.doctor.name}</h3><p>{a.doctor.specialization} • {a.doctor.room}</p><span className="reason">“{a.reason}”</span></div><div className="appointment-time"><Clock3 size={16}/>{a.timeSlot}<Status status={a.status}/></div></div>
    {onCancel && a.status === "BOOKED" && <button className="cancel-btn" onClick={()=>onCancel(a.id)}>Cancel</button>}
    {staff && a.status === "BOOKED" && <div className="staff-actions"><button onClick={async()=>{await api.updateStatus(a.id,"COMPLETED");notify("Marked completed.");refresh()}} className="complete-btn"><CheckCircle2 size={15}/> Complete</button><button onClick={async()=>{await api.updateStatus(a.id,"CANCELLED");notify("Appointment cancelled.");refresh()}} className="cancel-btn"><XCircle size={15}/> Cancel</button></div>}
  </article>;
}

function StaffDashboard({appointments,refresh,notify}) {
  const counts = {total:appointments.length, booked:appointments.filter(a=>a.status==="BOOKED").length, completed:appointments.filter(a=>a.status==="COMPLETED").length, cancelled:appointments.filter(a=>a.status==="CANCELLED").length};
  return <div className="fade-up"><PageTitle icon={<ClipboardList/>} title="Staff dashboard" subtitle="View daily appointments and update their status."/>
    <div className="metric-grid"><Metric icon={<ClipboardList/>} value={counts.total} label="Total"/><Metric icon={<CalendarDays/>} value={counts.booked} label="Booked"/><Metric icon={<CheckCircle2/>} value={counts.completed} label="Completed"/><Metric icon={<XCircle/>} value={counts.cancelled} label="Cancelled"/></div>
    <div className="section-head table-head"><div><span className="eyebrow">APPOINTMENT QUEUE</span><h2>All patient visits</h2></div></div>
    {appointments.length===0 ? <EmptyState/> : <div className="appointment-list">{appointments.map(a=><AppointmentCard key={a.id} a={a} staff refresh={refresh} notify={notify}/>)}</div>}
  </div>;
}

function Metric({icon,value,label}){return <div className="metric"><span>{icon}</span><div><b>{value}</b><small>{label}</small></div></div>}
function Status({status}){return <span className={`status ${status.toLowerCase()}`}>{status}</span>}
function PageTitle({icon,title,subtitle}){return <div className="page-title"><div className="title-icon">{icon}</div><div><h1>{title}</h1><p>{subtitle}</p></div></div>}
function EmptyState(){return <div className="empty"><ClipboardList size={34}/><h3>No appointments yet</h3><p>Your booked appointments will appear here.</p></div>}
function Toast({toast}){return toast ? <div className={`toast ${toast.type}`}><span>{toast.type==="error"?<XCircle/>:<CheckCircle2/>}</span>{toast.message}</div> : null}

export default App;
