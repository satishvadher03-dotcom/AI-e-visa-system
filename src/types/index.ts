export type UserRole = 'customer' | 'consultant' | 'admin';

export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  country?: string;
  avatar?: string;
  createdAt: string;
}

export type TravelDirection = 'india_to_world' | 'world_to_india';

export type VisaCategory = 
  | 'tourist' 
  | 'business' 
  | 'student' 
  | 'work' 
  | 'family' 
  | 'transit' 
  | 'medical';

export interface VisaProgram {
  id: string;
  country: string;
  countryCode: string;
  direction: TravelDirection;
  category: VisaCategory;
  name: string;
  subTitle: string;
  description: string;
  validity: string;
  stayDuration: string;
  processingTime: string;
  approxGovFee: string;
  officialSourceUrl: string;
  officialSourceName: string;
  lastVerifiedDate: string;
  status: 'published' | 'draft' | 'archived';
  popular: boolean;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  keyTips: string[];
}

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'assigned'
  | 'under_review'
  | 'documents_required'
  | 'ready_for_consultant_review'
  | 'completed'
  | 'rejected_by_authority'
  | 'cancelled';

export interface Application {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  visaProgramId: string;
  visaProgramName: string;
  destinationCountry: string;
  consultantId?: string;
  consultantName?: string;
  status: ApplicationStatus;
  submissionDate: string;
  updatedAt: string;
  passportExpiry?: string;
  intendedTravelDate?: string;
  notesCount: number;
  documentsCount: number;
  consultantSummary?: string;
}

export interface ApplicationStatusHistory {
  id: string;
  applicationId: string;
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  changedBy: string;
  changedByRole: UserRole;
  reason: string;
  timestamp: string;
}

export interface CaseNote {
  id: string;
  applicationId: string;
  consultantId: string;
  consultantName: string;
  note: string;
  isInternalOnly: boolean;
  createdAt: string;
}

export interface CustomerDocument {
  id: string;
  applicationId: string;
  customerId: string;
  title: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  status: 'pending_review' | 'approved' | 'rejected_resubmit_needed';
  reviewNote?: string;
  downloadUrl?: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  consultantId?: string;
  consultantName?: string;
  consultationType: 'virtual_video' | 'phone_call' | 'in_person';
  travelDirection: TravelDirection;
  destinationCountry: string;
  visaCategory: VisaCategory;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 10:45 AM"
  timezone: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
  notes?: string;
  meetingLink?: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  travelDirection: TravelDirection;
  destinationCountry: string;
  visaCategory: VisaCategory;
  message: string;
  status: 'new' | 'assigned' | 'in_progress' | 'closed';
  assignedTo?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    url: string;
    lastVerified: string;
  }>;
  timestamp: string;
  language?: 'en' | 'hi' | 'gu';
}

export interface EligibilityQuestionnaire {
  nationality: string;
  currentResidence: string;
  destination: string;
  travelDirection: TravelDirection;
  purpose: VisaCategory;
  durationMonths: number;
  approxTravelDate: string;
  hasValidPassport: boolean;
  passportValidityMonths: number;
  previousVisaRefusals: boolean;
  employmentStatus: 'employed' | 'self_employed' | 'student' | 'retired' | 'unemployed';
  fundingMethod: 'self' | 'sponsor' | 'company' | 'scholarship';
}

export interface EligibilityResult {
  eligible: 'likely' | 'moderate' | 'unlikely' | 'needs_assessment';
  suggestedPrograms: VisaProgram[];
  recommendations: string[];
  potentialBlockers: string[];
  requiredEvidence: string[];
  officialSourceUrl: string;
  disclaimer: string;
}
