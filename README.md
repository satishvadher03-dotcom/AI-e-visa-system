# AuraVisa Global — AI Visa & Immigration Consultancy Platform

AuraVisa Global is a full-stack, production-oriented visa and immigration consultancy platform providing end-to-end guidance for travelers between India and international destinations worldwide.

---

## 1. Design System & Theme Architecture

The platform strictly adheres to a **modern, premium WHITE THEME**:
- **Main Canvas Background**: `#FFFFFF`
- **Secondary Background**: `#F8FAFC`
- **Subtle Surface Background**: `#F1F5F9`
- **Primary Action Blue**: `#2563EB` (Hover: `#1D4ED8`)
- **Main Text**: `#1F2937`
- **Secondary Text**: `#64748B`
- **Borders & Dividers**: `#E2E8F0`
- **Strictly Prohibited**: No navy blue backgrounds, no gold or yellow accents, no dark mode full-page backgrounds.

---

## 2. Travel Corridors & Visa Knowledge Base

The platform serves two primary bilateral corridors:
1. **India to World (Outbound)**:
   - **United States**: B1/B2 Visitor Visa, F-1 Academic Visa (`travel.state.gov`)
   - **United Kingdom**: Standard Visitor Visa, Student Visa (`gov.uk`)
   - **Canada**: Temporary Resident Visa (TRV) (`canada.ca`)
   - **Schengen Area (Germany / France)**: Uniform Short-Stay Visa Category C (`india.diplo.de`)
   - **Australia**: Subclass 600 Visitor Visa (`immi.homeaffairs.gov.au`)
   - **United Arab Emirates (UAE)**: GDRFA Tourist & Remote Work Visas
   - **Singapore & Japan**: ICA & MOFA Consular entry visas

2. **World to India (Inbound)**:
   - **India e-Tourist Visa (eTV)**: 30-Day, 1-Year, 5-Year multiple entry (`indianvisaonline.gov.in`)
   - **India e-Business Visa**: Commercial meetings and trade fairs (`indianvisaonline.gov.in`)
   - **India e-Medical Visa**: Triple entry specialized healthcare treatment (`indianvisaonline.gov.in`)
   - **India Academic & Employment Visas**

*All visa requirements and statutory fees are grounded in published government portals with active verification timestamps.*

---

## 3. Strict Role Separation & Security Architecture

The platform enforces three completely isolated panels:

### A. Customer Panel (`/customer/*`)
- **Dashboard**: Active application status, assigned advisor, vault summary.
- **My Applications**: Document checklists, workflow tracking, application creation.
- **Appointments**: Consultation scheduling with Google Meet links, cancellation handling.
- **Document Vault**: Encrypted private storage for bank statements, passports, and employer letters.
- **Profile**: Contact information and passport details.
- *Strict customer isolation: Customers can never view another customer's applications, documents, or notes.*

### B. Consultant Panel (`/consultant/*`)
- **Dashboard**: Queue overview, pending reviews, document deficiencies.
- **Assigned Cases**: Review document completeness, request missing items, update statuses (`under_review`, `documents_required`, `completed`).
- **Internal Case Notes**: Confidential notes visible only to advisors and administrators (completely hidden from clients).
- **Consultation Schedule**: Dedicated calendar for client advisory sessions.
- *Strict assignment restriction: Consultants can only access cases specifically allocated to them.*

### C. Admin Panel (`/admin/*`)
- **Executive Dashboard**: System-wide operational metrics and KPI summaries.
- **User Directory**: User management, activating/suspending accounts, role elevation.
- **Case Dispatch**: Allocate client applications to accredited consultants.
- **Visa Knowledge Base (CRUD)**: Update statutory criteria, source URLs, and publication status.
- **Audit Logs**: Immutable event trail recording all logins, case assignments, and role modifications.

---

## 4. Built-in Demo Credentials

For testing the three separate portals with real server-side session authentication:

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@auravisa.com` | `Admin@1234` | `/admin/dashboard` |
| **Consultant** | `consultant@auravisa.com` | `Consultant@1234` | `/consultant/dashboard` |
| **Customer** | `rahul.sharma@example.com` | `Customer@1234` | `/customer/dashboard` |
| **Inbound Customer** | `sarah.jenkins@example.com` | `Customer@1234` | `/customer/dashboard` |

*Registration at `/register` strictly forces the `customer` role by default. Users cannot elevate their own role.*

---

## 5. Development & Testing Commands

```bash
# Run the full-stack development server on port 3000
npm run dev

# Run automated test suite (19 test assertions)
npm test

# Run TypeScript type checks
npm run lint

# Compile production bundle
npm run build
```

---

## 6. Official Consular Disclaimers

AuraVisa Global is an independent visa documentation consultancy and is not affiliated with or endorsed by any government agency or foreign embassy. Final visa adjudication is the statutory prerogative of consular officers at the port of entry. AuraVisa Global does not guarantee visa issuance.
