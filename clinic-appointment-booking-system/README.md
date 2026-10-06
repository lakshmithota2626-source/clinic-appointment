# 🌸 BloomCare Clinic Appointment Booking System

Hackathon-ready **Java Full Stack** web application based on Problem Statement #12:
**Clinic Appointment Booking System**

### Stack
- Frontend: React + Vite
- Backend: Java 17 + Spring Boot + Spring Data JPA (Hibernate)
- Local database: H2 file database
- Deployment database option: PostgreSQL
- No Spring Security, JWT, OAuth, or tokens
- Responsive floral UI + small animations

## Features
### Patient
- Registration and login
- Doctor list with specialization, room and available days
- Appointment date and time-slot selection
- Prevents booking a past date
- Prevents double booking of doctor/date/time
- View upcoming/past appointments
- Cancel upcoming appointment
- Data is stored in database

### Clinic Staff
- Staff dashboard
- View all appointments
- See patient + doctor + date + time + reason
- Mark appointment Completed
- Cancel appointment
- Dashboard counts

### Demo staff
`staff@clinic.local`  
`staff123`

This is intentionally a simple hackathon login. Passwords are stored as plain text and there is no authentication token/security layer because the requirement explicitly asked for no security.

---

# 1. Install before running

Install:
1. JDK 17 or newer
2. Maven 3.9+
3. Node.js 18+ (20+ recommended)
4. VS Code
5. Git

Check:
```bash
java -version
mvn -version
node -v
npm -v
git --version
```

---

# 2. Run backend in VS Code

Open the project folder in VS Code.

Open Terminal:
```bash
cd backend
mvn clean spring-boot:run
```

Backend:
`http://localhost:8080`

Health check:
`http://localhost:8080/api/health`

H2 console:
`http://localhost:8080/h2-console`

For H2 console use:
- JDBC URL: `jdbc:h2:file:./data/clinicdb`
- User: `sa`
- Password: empty

The first run automatically creates doctors and a staff account.

---

# 3. Run frontend

Open a SECOND VS Code terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally:
`http://localhost:5173`

The frontend calls:
`http://localhost:8080/api`

If your backend is deployed, create `frontend/.env.local`:
```env
VITE_API_BASE_URL=https://YOUR-RENDER-BACKEND.onrender.com/api
```
Then restart the frontend.

---

# 4. Recommended hackathon demo flow

### Patient demo
1. Register a patient.
2. Login.
3. Open Doctors.
4. Open Book.
5. Select doctor.
6. Select a date when that doctor works.
7. Select a slot.
8. Enter reason.
9. Confirm.
10. Open My Appointments.

### Double-booking demo
Try booking the exact same doctor/date/time using another patient. The backend returns:
`That time slot is already booked.`

### Staff demo
Logout.
Login:
`staff@clinic.local`
`staff123`

Show:
- total appointments
- booked appointments
- completed appointments
- cancelled appointments

Click Complete or Cancel.

---

# 5. GitHub

From the project root:
```bash
git init
git add .
git commit -m "Initial clinic appointment booking system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/clinic-appointment-booking.git
git push -u origin main
```

If you already created the GitHub repository, use its URL in the `git remote add origin` command.

---

# 6. Deploy backend on Render

Create a Render Web Service from your GitHub repository.

Important settings if your repository root contains `backend`:
- Root Directory: `backend`
- Runtime: Java
- Build Command:
```bash
mvn clean package -DskipTests
```
- Start Command:
```bash
java -jar target/clinic-appointment-booking-1.0.0.jar
```

Render will set `PORT`; Spring Boot already uses `${PORT:8080}`.

### Database
For a quick hackathon demo, you can run with the default H2 file database, but cloud filesystem data can reset on redeploy/restart.

For persistent production-like data, create a PostgreSQL database on Render and add these backend environment variables:
```text
DB_URL=jdbc:postgresql://HOST:5432/DATABASE?sslmode=require
DB_USERNAME=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_DRIVER=org.postgresql.Driver
```

After deployment copy the backend URL, for example:
`https://clinic-appointment-api.onrender.com`

Test:
`https://clinic-appointment-api.onrender.com/api/health`

---

# 7. Deploy frontend on Vercel

Import the same GitHub repository.

Project settings:
- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Environment Variable:
```text
VITE_API_BASE_URL=https://YOUR-RENDER-BACKEND.onrender.com/api
```

Deploy.

### Netlify alternative
Import the same repository and use:
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`

Set:
`VITE_API_BASE_URL=https://YOUR-RENDER-BACKEND.onrender.com/api`

`netlify.toml` is already included.

---

# 8. Important deployment note

Do NOT put database passwords or private credentials inside GitHub.

The frontend has no token because this is the intentionally simple hackathon version.

For a real production system, add:
- Spring Security
- hashed passwords
- JWT/session authentication
- role-based authorization
- HTTPS
- proper secret management

---

# 9. Folder structure

```text
clinic-appointment-booking/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/hackathon/clinic/
│       ├── ClinicAppointmentApplication.java
│       ├── config/
│       ├── controller/
│       ├── dto/
│       ├── model/
│       └── repository/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── netlify.toml
│   ├── vercel.json
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── main.jsx
│       └── styles.css
└── README.md
```
