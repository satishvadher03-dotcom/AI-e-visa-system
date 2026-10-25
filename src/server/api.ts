import { Router, Request, Response, NextFunction } from 'express';
import { db } from './db.ts';
import { generateVisaGuidance } from './ai.ts';
import { 
  User, 
  UserRole, 
  ApplicationStatus, 
  EligibilityQuestionnaire, 
  EligibilityResult,
  VisaProgram
} from '../types/index.ts';

export const apiRouter = Router();

// Simulated active session tokens (token -> user)
const activeSessions = new Map<string, { user: User; expiresAt: number }>();

// Helper to generate secure random token
function generateToken(): string {
  return 'aura_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Authentication Middleware
function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  // Attach verified user to request
  (req as any).user = session.user;
  next();
}

// Role-based Access Control Guard
function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as User;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    if (!allowedRoles.includes(user.role)) {
      db.logAction(user, 'UNAUTHORIZED_ACCESS_ATTEMPT', 'Route', req.path, `Role ${user.role} attempted to access restricted endpoint ${req.path}`);
      return res.status(403).json({ 
        error: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}. Current role is ${user.role}.` 
      });
    }
    next();
  };
}

// =========================================================================
// 1. PUBLIC ENDPOINTS
// =========================================================================

// GET /api/v1/visa-programs - Filterable directory
apiRouter.get('/visa-programs', (req: Request, res: Response) => {
  const { direction, category, search, popular } = req.query;
  
  let programs = db.visaPrograms.filter(p => p.status === 'published');

  if (direction && (direction === 'india_to_world' || direction === 'world_to_india')) {
    programs = programs.filter(p => p.direction === direction);
  }

  if (category && typeof category === 'string' && category !== 'all') {
    programs = programs.filter(p => p.category === category);
  }

  if (popular === 'true') {
    programs = programs.filter(p => p.popular);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    programs = programs.filter(p => 
      p.country.toLowerCase().includes(q) || 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: programs.length, programs });
});

// GET /api/v1/visa-programs/:id - Detailed program information
apiRouter.get('/visa-programs/:id', (req: Request, res: Response) => {
  const program = db.visaPrograms.find(p => p.id === req.params.id);
  if (!program) {
    return res.status(404).json({ error: 'Visa program not found.' });
  }
  res.json({ success: true, program });
});

// POST /api/v1/eligibility/check - Eligibility calculation engine
apiRouter.post('/eligibility/check', (req: Request, res: Response) => {
  const q: EligibilityQuestionnaire = req.body;
  if (!q.destination || !q.purpose) {
    return res.status(400).json({ error: 'Destination and travel purpose are required.' });
  }

  const matchingPrograms = db.visaPrograms.filter(p => 
    p.country.toLowerCase().includes(q.destination.toLowerCase()) &&
    p.direction === q.travelDirection
  );

  let eligible: 'likely' | 'moderate' | 'unlikely' | 'needs_assessment' = 'likely';
  const recommendations: string[] = [];
  const potentialBlockers: string[] = [];
  const requiredEvidence: string[] = [
    'Valid passport with at least 6 months remaining validity',
    'Certified 6-month bank statements demonstrating financial solvency'
  ];

  if (!q.hasValidPassport || q.passportValidityMonths < 6) {
    eligible = 'moderate';
    potentialBlockers.push('Passport validity is below the recommended 6-month international threshold.');
    recommendations.push('Renew your passport prior to scheduling biometric or consular appointments.');
  }

  if (q.previousVisaRefusals) {
    eligible = 'needs_assessment';
    potentialBlockers.push('Prior visa refusal recorded in system.');
    recommendations.push('A formal case audit with a senior consultant is strongly recommended to address previous grounds of refusal under INA or UKVI immigration rules.');
  }

  if (q.employmentStatus === 'unemployed') {
    eligible = 'moderate';
    potentialBlockers.push('Absence of formal local employment may weaken evidence of ties to home country.');
    recommendations.push('Provide evidence of financial sponsorship, immovable family property, or academic enrollment.');
  }

  if (q.travelDirection === 'world_to_india') {
    recommendations.push('International travelers should submit the Indian e-Visa application at least 4 business days before boarding.');
  }

  const result: EligibilityResult = {
    eligible,
    suggestedPrograms: matchingPrograms.length > 0 ? matchingPrograms : db.visaPrograms.slice(0, 2),
    recommendations,
    potentialBlockers,
    requiredEvidence,
    officialSourceUrl: matchingPrograms[0]?.officialSourceUrl || 'https://travel.state.gov',
    disclaimer: 'This evaluation is preliminary based upon self-reported responses. It does not guarantee visa issuance.'
  };

  res.json({ success: true, result });
});

// POST /api/v1/enquiries - Public enquiry form
apiRouter.post('/enquiries', (req: Request, res: Response) => {
  const { name, email, phone, travelDirection, destinationCountry, visaCategory, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and enquiry message are required.' });
  }

  const newEnquiry = {
    id: `enq_${Date.now()}`,
    name,
    email,
    phone: phone || '',
    travelDirection: travelDirection || 'india_to_world',
    destinationCountry: destinationCountry || 'General Enquiry',
    visaCategory: visaCategory || 'tourist',
    message,
    status: 'new' as const,
    createdAt: new Date().toISOString()
  };

  db.enquiries.unshift(newEnquiry);
  res.status(201).json({ success: true, enquiry: newEnquiry, message: 'Enquiry submitted successfully. An advisor will contact you within 24 hours.' });
});

// POST /api/v1/contact - General contact form
apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Record contact as general enquiry
  const newContact = {
    id: `cnt_${Date.now()}`,
    name,
    email,
    phone: '',
    travelDirection: 'india_to_world' as const,
    destinationCountry: 'General Inquiry',
    visaCategory: 'tourist' as const,
    message: `[Subject: ${subject || 'General'}] ${message}`,
    status: 'new' as const,
    createdAt: new Date().toISOString()
  };
  db.enquiries.unshift(newContact);

  res.json({ success: true, message: 'Your message has been received. Our support team will reply shortly.' });
});

// POST /api/v1/ai/chat - AI Visa Assistant
apiRouter.post('/ai/chat', async (req: Request, res: Response) => {
  try {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown_ip';
    const response = await generateVisaGuidance(req.body, clientIp);
    res.json({ success: true, ...response });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to generate guidance.' });
  }
});

// =========================================================================
// 2. AUTHENTICATION ENDPOINTS
// =========================================================================

// POST /api/v1/auth/login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. User does not exist.' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Account suspended. Please contact platform administration.' });
  }

  const expectedPassword = db.userPasswords.get(user.email.toLowerCase());
  if (expectedPassword !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken();
  activeSessions.set(token, {
    user,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });

  db.logAction(user, 'USER_LOGIN', 'User', user.id, `User ${user.email} logged in with role ${user.role}`);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      country: user.country
    }
  });
});

// POST /api/v1/auth/register - Strictly registers customers ONLY
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone, country } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  // Security Rule: Users can NEVER register themselves as admin or consultant
  const newUser: User = {
    id: `usr_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    role: 'customer', // strictly customer
    status: 'active',
    phone: phone || '',
    country: country || 'India',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  db.userPasswords.set(newUser.email, password);

  const token = generateToken();
  activeSessions.set(token, {
    user: newUser,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  });

  db.logAction(newUser, 'USER_REGISTERED', 'User', newUser.id, `Customer registered: ${newUser.email}`);

  res.status(201).json({
    success: true,
    token,
    user: newUser
  });
});

// POST /api/v1/auth/logout
apiRouter.post('/auth/logout', authenticate, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  const user = (req as any).user as User;
  db.logAction(user, 'USER_LOGOUT', 'User', user.id, `User logged out: ${user.email}`);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/v1/auth/me - Read verified session
apiRouter.get('/auth/me', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  res.json({ success: true, user });
});

// POST /api/v1/auth/forgot-password
apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  // Always return consistent message to prevent email enumeration
  res.json({
    success: true,
    message: 'If an account exists with this email address, a secure password reset link has been dispatched.'
  });
});

// =========================================================================
// 3. CUSTOMER PANEL ENDPOINTS (Role: customer)
// =========================================================================

// GET /api/v1/customer/applications - Only their own applications
apiRouter.get('/customer/applications', authenticate, requireRole('customer'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const userApplications = db.applications.filter(a => a.customerId === user.id);
  res.json({ success: true, applications: userApplications });
});

// POST /api/v1/customer/applications - Create a new visa application
apiRouter.post('/customer/applications', authenticate, requireRole('customer'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { visaProgramId, destinationCountry, intendedTravelDate, passportExpiry } = req.body;

  const program = db.visaPrograms.find(p => p.id === visaProgramId);

  const newApp = {
    id: `app_${Date.now()}`,
    customerId: user.id,
    customerName: user.name,
    customerEmail: user.email,
    visaProgramId: visaProgramId || 'custom_program',
    visaProgramName: program ? program.name : `${destinationCountry} Visa Application`,
    destinationCountry: destinationCountry || program?.country || 'International',
    status: 'submitted' as ApplicationStatus,
    submissionDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    passportExpiry,
    intendedTravelDate,
    notesCount: 0,
    documentsCount: 0,
    consultantSummary: 'Application submitted. Pending consultant assignment.'
  };

  db.applications.unshift(newApp);

  // Add status history
  db.statusHistories.push({
    id: `hist_${Date.now()}`,
    applicationId: newApp.id,
    fromStatus: 'draft',
    toStatus: 'submitted',
    changedBy: user.name,
    changedByRole: 'customer',
    reason: 'Application submitted by applicant.',
    timestamp: new Date().toISOString()
  });

  db.logAction(user, 'CREATE_APPLICATION', 'Application', newApp.id, `Created application for ${newApp.visaProgramName}`);

  res.status(201).json({ success: true, application: newApp });
});

// GET /api/v1/customer/applications/:id - Specific application with security ownership check
apiRouter.get('/customer/applications/:id', authenticate, requireRole('customer'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const app = db.applications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found.' });
  }
  // Enforce ownership
  if (app.customerId !== user.id) {
    return res.status(403).json({ error: 'Access denied: You do not own this application record.' });
  }

  const history = db.statusHistories.filter(h => h.applicationId === app.id);
  const docs = db.documents.filter(d => d.applicationId === app.id);
  // Note: Case notes are internal only, so we NEVER return them to customers!

  res.json({
    success: true,
    application: app,
    statusHistory: history,
    documents: docs
  });
});

// GET /api/v1/customer/documents - List customer's own documents
apiRouter.get('/customer/documents', authenticate, requireRole('customer'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const docs = db.documents.filter(d => d.customerId === user.id);
  res.json({ success: true, documents: docs });
});

// POST /api/v1/customer/documents - Secure document upload metadata simulation
apiRouter.post('/customer/documents', authenticate, requireRole('customer'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { applicationId, title, documentType, fileName, fileSize, mimeType } = req.body;

  if (!title || !fileName) {
    return res.status(400).json({ error: 'Document title and file name are required.' });
  }

  // Validate MIME type for security
  const allowedMime = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  if (mimeType && !allowedMime.includes(mimeType)) {
    return res.status(400).json({ error: 'Invalid document type. Only PDF and JPG/PNG image files are permitted.' });
  }

  const newDoc = {
    id: `doc_${Date.now()}`,
    applicationId: applicationId || '',
    customerId: user.id,
    title,
    documentType: documentType || 'supporting_evidence',
    fileName,
    fileSize: fileSize || 350000,
    mimeType: mimeType || 'application/pdf',
    uploadedAt: new Date().toISOString(),
    status: 'pending_review' as const,
    downloadUrl: `/api/v1/customer/documents/doc_${Date.now()}/download`
  };

  db.documents.unshift(newDoc);

  // Update document counter on application if provided
  if (applicationId) {
    const app = db.applications.find(a => a.id === applicationId);
    if (app && app.customerId === user.id) {
      app.documentsCount += 1;
      app.updatedAt = new Date().toISOString();
    }
  }

  db.logAction(user, 'UPLOAD_DOCUMENT', 'CustomerDocument', newDoc.id, `Uploaded document: ${title}`);

  res.status(201).json({ success: true, document: newDoc });
});

// GET /api/v1/customer/appointments - View customer's own appointments
apiRouter.get('/customer/appointments', authenticate, requireRole('customer'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const userAppointments = db.appointments.filter(a => a.customerId === user.id);
  res.json({ success: true, appointments: userAppointments });
});

// POST /api/v1/customer/appointments - Book consultation
apiRouter.post('/customer/appointments', authenticate, requireRole('customer'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { 
    consultationType, 
    travelDirection, 
    destinationCountry, 
    visaCategory, 
    date, 
    timeSlot, 
    timezone,
    notes 
  } = req.body;

  if (!date || !timeSlot) {
    return res.status(400).json({ error: 'Date and time slot are required.' });
  }

  // Check for duplicate slot booking
  const conflict = db.appointments.find(a => 
    a.date === date && 
    a.timeSlot === timeSlot && 
    a.status === 'confirmed'
  );
  if (conflict) {
    return res.status(409).json({ error: 'This time slot is already booked. Please select another time slot.' });
  }

  const assignedConsultant = db.users.find(u => u.role === 'consultant');

  const newAppointment = {
    id: `apt_${Date.now()}`,
    customerId: user.id,
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: user.phone,
    consultantId: assignedConsultant?.id || 'usr_consultant_01',
    consultantName: assignedConsultant?.name || 'Assigned Consultant',
    consultationType: consultationType || 'virtual_video',
    travelDirection: travelDirection || 'india_to_world',
    destinationCountry: destinationCountry || 'International',
    visaCategory: visaCategory || 'tourist',
    date,
    timeSlot,
    timezone: timezone || 'Asia/Kolkata (IST)',
    status: 'confirmed' as const,
    notes: notes || '',
    meetingLink: 'https://meet.google.com/aur-scheduled-session',
    createdAt: new Date().toISOString()
  };

  db.appointments.unshift(newAppointment);
  db.logAction(user, 'BOOK_APPOINTMENT', 'Appointment', newAppointment.id, `Booked session for ${date} at ${timeSlot}`);

  res.status(201).json({ success: true, appointment: newAppointment });
});

// PATCH /api/v1/customer/appointments/:id/cancel
apiRouter.patch('/customer/appointments/:id/cancel', authenticate, requireRole('customer'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const apt = db.appointments.find(a => a.id === req.params.id);
  if (!apt) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }
  if (apt.customerId !== user.id) {
    return res.status(403).json({ error: 'Access denied: You do not own this appointment.' });
  }

  apt.status = 'cancelled';
  db.logAction(user, 'CANCEL_APPOINTMENT', 'Appointment', apt.id, 'Customer cancelled appointment');
  res.json({ success: true, appointment: apt, message: 'Appointment cancelled.' });
});

// =========================================================================
// 4. CONSULTANT PANEL ENDPOINTS (Role: consultant)
// =========================================================================

// GET /api/v1/consultant/cases - Only assigned cases
apiRouter.get('/consultant/cases', authenticate, requireRole('consultant'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const assignedCases = db.applications.filter(a => a.consultantId === user.id);
  res.json({ success: true, cases: assignedCases });
});

// GET /api/v1/consultant/cases/:id - Case detail with internal notes
apiRouter.get('/consultant/cases/:id', authenticate, requireRole('consultant'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const app = db.applications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Case not found.' });
  }

  // Security check: Must be assigned to this consultant
  if (app.consultantId !== user.id) {
    return res.status(403).json({ error: 'Access denied: This case is not assigned to you.' });
  }

  const history = db.statusHistories.filter(h => h.applicationId === app.id);
  const docs = db.documents.filter(d => d.applicationId === app.id);
  const notes = db.caseNotes.filter(n => n.applicationId === app.id);

  res.json({
    success: true,
    case: app,
    statusHistory: history,
    documents: docs,
    internalNotes: notes
  });
});

// PATCH /api/v1/consultant/cases/:id/status - Update workflow status
apiRouter.patch('/consultant/cases/:id/status', authenticate, requireRole('consultant'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { newStatus, reason } = req.body;
  const app = db.applications.find(a => a.id === req.params.id);

  if (!app) {
    return res.status(404).json({ error: 'Case not found.' });
  }
  if (app.consultantId !== user.id) {
    return res.status(403).json({ error: 'Access denied: You are not assigned to this case.' });
  }

  const oldStatus = app.status;
  app.status = newStatus;
  app.updatedAt = new Date().toISOString();

  const historyEntry = {
    id: `hist_${Date.now()}`,
    applicationId: app.id,
    fromStatus: oldStatus,
    toStatus: newStatus,
    changedBy: user.name,
    changedByRole: 'consultant' as UserRole,
    reason: reason || `Status updated to ${newStatus}`,
    timestamp: new Date().toISOString()
  };
  db.statusHistories.push(historyEntry);

  db.logAction(user, 'UPDATE_CASE_STATUS', 'Application', app.id, `Updated status from ${oldStatus} to ${newStatus}`);

  res.json({ success: true, case: app, historyEntry });
});

// POST /api/v1/consultant/cases/:id/notes - Add internal note (hidden from customer)
apiRouter.post('/api/v1/consultant/cases/:id/notes', authenticate, requireRole('consultant'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { note } = req.body;
  if (!note || !note.trim()) {
    return res.status(400).json({ error: 'Note content cannot be empty.' });
  }

  const app = db.applications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Case not found.' });
  }
  if (app.consultantId !== user.id) {
    return res.status(403).json({ error: 'Access denied: You are not assigned to this case.' });
  }

  const newNote = {
    id: `note_${Date.now()}`,
    applicationId: app.id,
    consultantId: user.id,
    consultantName: user.name,
    note,
    isInternalOnly: true,
    createdAt: new Date().toISOString()
  };

  db.caseNotes.push(newNote);
  app.notesCount += 1;

  db.logAction(user, 'ADD_CASE_NOTE', 'CaseNote', newNote.id, `Added internal note to case ${app.id}`);

  res.status(201).json({ success: true, note: newNote });
});

// GET /api/v1/consultant/appointments - Appointments assigned to consultant
apiRouter.get('/consultant/appointments', authenticate, requireRole('consultant'), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const assigned = db.appointments.filter(a => a.consultantId === user.id);
  res.json({ success: true, appointments: assigned });
});

// =========================================================================
// 5. ADMIN PANEL ENDPOINTS (Role: admin)
// =========================================================================

// GET /api/v1/admin/users - User management
apiRouter.get('/admin/users', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  res.json({ success: true, users: db.users });
});

// PATCH /api/v1/admin/users/:id/role - Update user role
apiRouter.patch('/admin/users/:id/role', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  const adminUser = (req as any).user as User;
  const { role } = req.body;

  if (!['customer', 'consultant', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role provided.' });
  }

  const targetUser = db.users.find(u => u.id === req.params.id);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const oldRole = targetUser.role;
  targetUser.role = role;

  db.logAction(adminUser, 'CHANGE_USER_ROLE', 'User', targetUser.id, `Changed role of ${targetUser.email} from ${oldRole} to ${role}`);

  res.json({ success: true, user: targetUser });
});

// PATCH /api/v1/admin/users/:id/status - Activate or suspend user
apiRouter.patch('/admin/users/:id/status', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  const adminUser = (req as any).user as User;
  const { status } = req.body;

  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  const targetUser = db.users.find(u => u.id === req.params.id);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  targetUser.status = status;
  db.logAction(adminUser, 'CHANGE_USER_STATUS', 'User', targetUser.id, `Set status of ${targetUser.email} to ${status}`);

  res.json({ success: true, user: targetUser });
});

// GET /api/v1/admin/applications - All applications
apiRouter.get('/admin/applications', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  res.json({ success: true, applications: db.applications });
});

// POST /api/v1/admin/assign - Assign case to consultant
apiRouter.post('/admin/assign', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  const adminUser = (req as any).user as User;
  const { applicationId, consultantId } = req.body;

  const app = db.applications.find(a => a.id === applicationId);
  if (!app) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  const consultant = db.users.find(u => u.id === consultantId && u.role === 'consultant');
  if (!consultant) {
    return res.status(404).json({ error: 'Valid consultant not found.' });
  }

  app.consultantId = consultant.id;
  app.consultantName = consultant.name;
  if (app.status === 'submitted') {
    app.status = 'assigned';
  }
  app.updatedAt = new Date().toISOString();

  db.statusHistories.push({
    id: `hist_${Date.now()}`,
    applicationId: app.id,
    fromStatus: 'submitted',
    toStatus: 'assigned',
    changedBy: adminUser.name,
    changedByRole: 'admin',
    reason: `Assigned to consultant ${consultant.name}`,
    timestamp: new Date().toISOString()
  });

  db.logAction(adminUser, 'ASSIGN_CASE', 'Application', app.id, `Assigned case to consultant ${consultant.email}`);

  res.json({ success: true, application: app, consultant });
});

// POST /api/v1/admin/visa-programs - Create visa program
apiRouter.post('/admin/visa-programs', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  const adminUser = (req as any).user as User;
  const data = req.body;

  const newProgram: VisaProgram = {
    id: `visa_${Date.now()}`,
    country: data.country,
    countryCode: data.countryCode || 'INT',
    direction: data.direction || 'india_to_world',
    category: data.category || 'tourist',
    name: data.name,
    subTitle: data.subTitle || '',
    description: data.description,
    validity: data.validity || 'As approved',
    stayDuration: data.stayDuration || '90 days',
    processingTime: data.processingTime || '15-20 days',
    approxGovFee: data.approxGovFee || '$100 USD',
    officialSourceUrl: data.officialSourceUrl,
    officialSourceName: data.officialSourceName,
    lastVerifiedDate: new Date().toISOString().split('T')[0],
    status: data.status || 'published',
    popular: !!data.popular,
    eligibilityCriteria: data.eligibilityCriteria || [],
    requiredDocuments: data.requiredDocuments || [],
    keyTips: data.keyTips || []
  };

  db.visaPrograms.push(newProgram);
  db.logAction(adminUser, 'CREATE_VISA_PROGRAM', 'VisaProgram', newProgram.id, `Created visa program: ${newProgram.name}`);

  res.status(201).json({ success: true, program: newProgram });
});

// PATCH /api/v1/admin/visa-programs/:id - Update visa program
apiRouter.patch('/admin/visa-programs/:id', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  const adminUser = (req as any).user as User;
  const index = db.visaPrograms.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Visa program not found.' });
  }

  db.visaPrograms[index] = {
    ...db.visaPrograms[index],
    ...req.body,
    lastVerifiedDate: new Date().toISOString().split('T')[0]
  };

  db.logAction(adminUser, 'UPDATE_VISA_PROGRAM', 'VisaProgram', req.params.id, `Updated program ${db.visaPrograms[index].name}`);

  res.json({ success: true, program: db.visaPrograms[index] });
});

// GET /api/v1/admin/audit-logs - View audit trail
apiRouter.get('/admin/audit-logs', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  res.json({ success: true, auditLogs: db.auditLogs });
});

// GET /api/v1/admin/reports - Operational metrics
apiRouter.get('/admin/reports', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  const totalUsers = db.users.length;
  const totalCustomers = db.users.filter(u => u.role === 'customer').length;
  const totalConsultants = db.users.filter(u => u.role === 'consultant').length;
  const totalApplications = db.applications.length;
  const activeApplications = db.applications.filter(a => !['completed', 'cancelled', 'rejected_by_authority'].includes(a.status)).length;
  const totalAppointments = db.appointments.length;
  const totalEnquiries = db.enquiries.length;

  res.json({
    success: true,
    metrics: {
      totalUsers,
      totalCustomers,
      totalConsultants,
      totalApplications,
      activeApplications,
      totalAppointments,
      totalEnquiries,
      verifiedVisaProgramsCount: db.visaPrograms.length
    }
  });
});
