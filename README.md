# LEONI MEP1 Operations Dashboard

A professional, real-time production monitoring system built for LEONI Berrechid's Volvo MEP1 production line.

## 🎯 Features

### Safety & Compliance ⭐
- **Live Safety Monitor** - Real-time injury tracking with visual body part heat mapping
- **Automatic Safety Counter** - 24-hour auto-increment for consecutive safe-day tracking
- **Incident Timeline** - 7-day historical safety trends with detailed incident history
- **Risk Assessment** - Low/Medium/High risk level calculation based on recent incidents

### Production Metrics
- **Quality Assurance** - Non-Conformance Reporting (NCR), daily quality status tracking
- **Efficiency Analysis** - Line-by-line performance monitoring vs. targets (CMA2, CMA3, MEP1, SPA3)
- **Scrap Analysis** - Material waste tracking with monthly rolling data and segment performance
- **Capacity Planning** - Produced hours tracking by shift and day of week

### Team Management
- **5S Dashboard** - Lean methodology audit results tracking by segment
- **Shift Scheduling** - Team availability and shift coordination
- **Kaizen Board** - Continuous improvement initiatives management
- **Employee Satisfaction** - Team morale and satisfaction metrics
- **Team Photos** - Visual team identification and engagement

### Data & Administration
- **Data Entry** - Comprehensive production data input form with validation
- **Excel Import** - Bulk scrap data import with automatic mapping (supports "rebut" sheet)
- **System Administration** - User and role management (Supervisor, Operator, Admin)

## 💻 Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Motion.js
- **State Management:** React Context API with auto-sync
- **Visualization:** Recharts for production metrics
- **Backend:** Express.js, PostgreSQL
- **Authentication:** JWT with role-based access control
- **Data Export:** XLSX (Excel) support

## 🏗️ Architecture

### Role-Based Access
- **Supervisor** - Full production data entry, team management
- **Operator** - Production data entry, quality logging
- **Admin** - System-wide user management and configuration

### Real-time Features
- Automatic backend synchronization (600ms debounce)
- Live safety counter with daily auto-increment
- Responsive dashboard updates
- Data persistence with localStorage fallback

## 🚀 Running Locally

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)

### Installation & Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# Setup database
npm run db:setup

# Run application (frontend + backend)
npm run dev

# Or run separately:
npm run dev:frontend    # React app on port 5173
npm run dev:backend     # Express server on port 3000
```

## 📊 Dashboard Sections

### Main Dashboard
Centralized view showing:
- Live Safety Monitor (injury tracking)
- Safety Timeline (7-day incident history)
- Quality Calendar (OK/NOK status)
- Efficiency metrics across all production lines
- Scrap rates and analysis
- Satisfaction scores
- 5S audit results
- Team photos and engagement

### Data Entry (`/data`)
Comprehensive form for inputting:
- Line efficiency (%) for each segment
- Scrap rates and objectives
- LPA (Labor Productivity Analysis) scores
- 5S audit scores
- Detailed satisfaction metrics
- Produced hours by day of week
- Quality status
- Safety incidents (optional)
- Excel bulk import for scrap data

### Quality Log (`/quality`)
- Daily quality status tracking
- Non-Conformance Reporting (NCR)
- Quality audit calendar
- Historical quality trends

### Production Pages
- **5S Dashboard** - Lean methodology tracking by production line
- **Kaizen Board** - Continuous improvement initiatives
- **Shift Schedule** - Team scheduling and shift management
- **Satisfaction** - Employee satisfaction metrics visualization

### System Administration (`/admin`)
- Create new user accounts
- Assign roles (Supervisor, Operator, Admin)
- User management interface

## 📁 Project Structure

```
src/
├── components/
│   ├── cards/                 # Dashboard metric cards
│   ├── shared/               # Reusable UI components
│   ├── AdminPage.tsx         # System administration
│   ├── DataEntryPage.tsx     # Production data entry
│   ├── QualityLogPage.tsx    # Quality tracking
│   ├── FiveSPage.tsx         # 5S audit tracking
│   ├── KaizenBoardPage.tsx   # Improvement initiatives
│   ├── ShiftSchedulePage.tsx # Team scheduling
│   ├── SatisfactionPage.tsx  # Employee satisfaction
│   ├── Sidebar.tsx           # Navigation
│   └── TopBar.tsx            # Header bar
├── context/
│   └── DashboardContext.tsx  # Global state management
├── api.ts                    # API client & authentication
├── App.tsx                   # Main app component
└── main.tsx                  # Entry point
```

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (RBAC)
- Automatic token refresh
- Secure password hashing (bcrypt)

## 📈 Key Metrics

The dashboard tracks:
- **Safety:** Days without accident, incident severity, body part affected
- **Quality:** OK/NOK status, NCR count, defect tracking
- **Efficiency:** % vs. target by production line
- **Scrap:** % waste vs. objective by segment
- **Capacity:** Produced hours per shift
- **LPA:** Labor productivity analysis scores
- **5S:** Lean methodology audit results
- **Satisfaction:** Team morale and engagement scores

## 🔄 Data Persistence

- All data syncs automatically to PostgreSQL backend
- LocalStorage fallback for offline functionality
- Automatic sync debounce (600ms) to reduce server load
- Incident data with full timestamp and user tracking

## 📝 Environment Variables

```env
VITE_API_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/leoni_db
JWT_SECRET=your_jwt_secret_here
```

## 📖 Database

See `README-POSTGRES.md` for complete database schema documentation.

## 🎨 Design Philosophy

- **Volvo Brand Compliance** - Professional blue (#1B4299) throughout
- **Safety-First** - Safety metrics prominently featured
- **Data-Driven** - Real-time KPI visualization
- **Responsive Design** - Works on desktop, tablet, mobile
- **Smooth Animations** - Professional transitions and interactions
- **Accessibility** - Proper color contrast, keyboard navigation

## 🛠️ Development

Build production bundle:
```bash
npm run build
npm run preview  # Preview production build locally
```

Linting:
```bash
npm run lint     # Type check with TypeScript
```

## 📄 License

Apache License 2.0 - See LICENSE file

## 🤝 Contributing

This is a portfolio project for LEONI Berrechid. Contributions and suggestions welcome!

## 📞 Support

For issues or questions, please contact the development team or submit an issue on GitHub.

---

**Built with ❤️ for LEONI Berrechid MEP1 Production Line**
