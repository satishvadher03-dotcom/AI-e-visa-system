import { 
  User, 
  VisaProgram, 
  Application, 
  ApplicationStatusHistory, 
  CaseNote, 
  CustomerDocument, 
  Appointment, 
  Enquiry, 
  AuditLog, 
  UserRole,
  ApplicationStatus
} from '../types/index.ts';

// In-memory relational database state with initial seed data
class DatabaseStore {
  public users: User[] = [];
  public userPasswords: Map<string, string> = new Map(); // email -> password hash/plain
  public visaPrograms: VisaProgram[] = [];
  public applications: Application[] = [];
  public statusHistories: ApplicationStatusHistory[] = [];
  public caseNotes: CaseNote[] = [];
  public documents: CustomerDocument[] = [];
  public appointments: Appointment[] = [];
  public enquiries: Enquiry[] = [];
  public auditLogs: AuditLog[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Initial Users
    const adminUser: User = {
      id: 'usr_admin_01',
      name: 'Dr. Vikramaditya Sen',
      email: 'admin@auravisa.com',
      role: 'admin',
      status: 'active',
      phone: '+91 98201 12345',
      country: 'India',
      createdAt: '2026-01-10T08:00:00Z'
    };

    const consultantUser: User = {
      id: 'usr_consultant_01',
      name: 'Ananya Deshmukh (Reg. Immigration Advisor)',
      email: 'consultant@auravisa.com',
      role: 'consultant',
      status: 'active',
      phone: '+91 98202 23456',
      country: 'India',
      createdAt: '2026-01-15T09:30:00Z'
    };

    const customerUser1: User = {
      id: 'usr_customer_01',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      role: 'customer',
      status: 'active',
      phone: '+91 98111 55667',
      country: 'India',
      createdAt: '2026-02-01T10:00:00Z'
    };

    const customerUser2: User = {
      id: 'usr_customer_02',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      role: 'customer',
      status: 'active',
      phone: '+1 415 555 2671',
      country: 'United States',
      createdAt: '2026-02-12T14:20:00Z'
    };

    this.users = [adminUser, consultantUser, customerUser1, customerUser2];
    this.userPasswords.set('admin@auravisa.com', 'Admin@1234');
    this.userPasswords.set('consultant@auravisa.com', 'Consultant@1234');
    this.userPasswords.set('rahul.sharma@example.com', 'Customer@1234');
    this.userPasswords.set('sarah.jenkins@example.com', 'Customer@1234');

    // 2. Verified Visa Programs
    this.visaPrograms = [
      // India to World
      {
        id: 'visa_us_b1b2',
        country: 'United States',
        countryCode: 'US',
        direction: 'india_to_world',
        category: 'tourist',
        name: 'US B1/B2 Visitor Visa',
        subTitle: 'Tourism, Family Visits & Business Meetings',
        description: 'Non-immigrant visa for temporary visitors for business (B-1) or pleasure (B-2). Requires DS-160 filing, fee receipt, and consulate interview appointment.',
        validity: 'Up to 10 years (multiple entry)',
        stayDuration: 'Up to 6 months per entry (determined at Port of Entry)',
        processingTime: 'Varies by consulate (Consulate wait time + 3-5 days dispatch)',
        approxGovFee: '$185 USD (MRV Fee)',
        officialSourceUrl: 'https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html',
        officialSourceName: 'U.S. Department of State - Bureau of Consular Affairs',
        lastVerifiedDate: '2026-02-15',
        status: 'published',
        popular: true,
        eligibilityCriteria: [
          'Proof of binding ties to India (employment, property, family)',
          'Clear, documented purpose of travel and detailed itinerary',
          'Sufficient liquid funds for travel and stay without working in the US',
          'Intent to depart the US upon conclusion of authorized stay'
        ],
        requiredDocuments: [
          'Valid passport with at least 6 months validity beyond intended stay',
          'Form DS-160 confirmation barcode page',
          'Visa application fee payment receipt',
          'Appointment confirmation letter for VAC (Biometrics) & Embassy Interview',
          'Recent 6 months bank statements with bank seal/stamp',
          'Employment verification letter or business registration certificates',
          'Income Tax Returns (ITR-V) for the last 3 assessment years'
        ],
        keyTips: [
          'DS-160 answers must be consistent with in-person interview statements.',
          'Consular officers presume immigrant intent under INA 214(b) unless overcome by ties.'
        ]
      },
      {
        id: 'visa_uk_standard_visitor',
        country: 'United Kingdom',
        countryCode: 'GB',
        direction: 'india_to_world',
        category: 'tourist',
        name: 'UK Standard Visitor Visa',
        subTitle: 'Leisure, Family, Business & Short-term Training',
        description: 'Covers tourism, visiting friends and family, business activities like attending conferences, and short academic courses under 6 months.',
        validity: '6 months, 2 years, 5 years, or 10 years (multiple entry)',
        stayDuration: 'Up to 6 months per visit',
        processingTime: 'Standard: 3 weeks from biometric appointment',
        approxGovFee: '£115 GBP (Standard 6-month)',
        officialSourceUrl: 'https://www.gov.uk/standard-visitor',
        officialSourceName: 'UK Visas and Immigration (Gov.uk)',
        lastVerifiedDate: '2026-02-20',
        status: 'published',
        popular: true,
        eligibilityCriteria: [
          'Genuine intention to visit and leave the UK at the end of the visit',
          'Financial capacity to cover all travel, accommodation, and return costs',
          'No intention to live in the UK through successive visits or undertake paid work'
        ],
        requiredDocuments: [
          'Current valid passport with at least one blank page',
          'Online visa application declaration',
          'Certified bank statements for past 6 months showing legitimate source of funds',
          'Leave sanction letter from Indian employer or Company Incorporation documents',
          'Proof of accommodation (hotel bookings or host invitation with proof of legal status)',
          'Day-by-day travel plan and return flight reservations (provisional)'
        ],
        keyTips: [
          'Explain any large recent deposits in bank accounts with documentary proof.'
        ]
      },
      {
        id: 'visa_canada_visitor',
        country: 'Canada',
        countryCode: 'CA',
        direction: 'india_to_world',
        category: 'tourist',
        name: 'Canada Temporary Resident Visa (TRV)',
        subTitle: 'Visitor Visa for Indian Citizens',
        description: 'Allows Indian passport holders to enter Canada for tourism, family visits, or business consultations. Submitted online via IRCC Portal.',
        validity: 'Up to 10 years or until passport expiry',
        stayDuration: 'Up to 6 months per entry',
        processingTime: '20 to 35 business days (IRCC global processing tracker)',
        approxGovFee: '$100 CAD application fee + $85 CAD biometrics fee',
        officialSourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/about-visitor-visa.html',
        officialSourceName: 'Immigration, Refugees and Citizenship Canada (IRCC)',
        lastVerifiedDate: '2026-02-18',
        status: 'published',
        popular: true,
        eligibilityCriteria: [
          'Clean criminal record and medical admissibility',
          'Strong economic and social ties to India (job, family, property)',
          'Evidence of sufficient funds to support oneself and dependents in Canada'
        ],
        requiredDocuments: [
          'Valid passport scan (all marked and stamped pages)',
          'Completed IMM 5257 and IMM 5645 (Family Information) forms',
          'Bank statement and Proof of Means of Financial Support',
          'Purpose of Travel statement / Cover Letter detailing planned itinerary',
          'Letter of Invitation (if visiting family/friends in Canada) with host PR/Citizenship copy',
          'Digital photo meeting IRCC biometric specifications'
        ],
        keyTips: [
          'A comprehensive Purpose of Travel cover letter significantly strengthens the application.'
        ]
      },
      {
        id: 'visa_schengen_germany',
        country: 'Germany / Schengen Area',
        countryCode: 'DE',
        direction: 'india_to_world',
        category: 'tourist',
        name: 'Schengen Uniform Visa (Category C)',
        subTitle: 'Travel Across 29 European Schengen Member States',
        description: 'Short-stay visa allowing free movement across the Schengen Area for up to 90 days within any 180-day period. Must apply at the consulate of the main destination.',
        validity: 'Single or Multiple entry based on itinerary and travel history',
        stayDuration: 'Max 90 days per 180-day rolling window',
        processingTime: '15 calendar days from biometric submission at VFS',
        approxGovFee: '€90 EUR (Standard adult visa fee)',
        officialSourceUrl: 'https://india.diplo.de/in-en/service/visa-einreise',
        officialSourceName: 'Federal Foreign Office - German Missions in India',
        lastVerifiedDate: '2026-02-10',
        status: 'published',
        popular: true,
        eligibilityCriteria: [
          'Germany must be primary destination (longest stay) or country of first entry',
          'Mandatory travel medical insurance with minimum €30,000 coverage including repatriation',
          'Confirmed round-trip flight bookings and accommodation vouchers'
        ],
        requiredDocuments: [
          'Valid passport issued within the last 10 years with at least 2 blank pages',
          'VIDEX Schengen application form signed by applicant',
          'Travel Health Insurance policy with minimum €30,000 coverage across all Schengen countries',
          'Proof of financial means: 3 months personal bank statements attested by bank',
          'Detailed day-to-day itinerary with inter-country train/flight bookings',
          'Proof of employment/student status in India with leave approval'
        ],
        keyTips: [
          'Insurance policy must specifically cover COVID-19 and repatriation of remains.'
        ]
      },
      {
        id: 'visa_australia_600',
        country: 'Australia',
        countryCode: 'AU',
        direction: 'india_to_world',
        category: 'tourist',
        name: 'Australia Visitor Visa (Subclass 600)',
        subTitle: 'Tourist & Sponsored Family Stream',
        description: 'Digital visa (e-Visa) allowing visits to Australia for holiday, sightseeing, social or recreational reasons, or to visit relatives.',
        validity: '3, 6, or 12 months (single or multiple entry)',
        stayDuration: 'Up to 3 or 12 months depending on grant notice',
        processingTime: '15 to 25 days (Department of Home Affairs standard service)',
        approxGovFee: '$190 AUD',
        officialSourceUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600',
        officialSourceName: 'Australian Government - Department of Home Affairs',
        lastVerifiedDate: '2026-02-22',
        status: 'published',
        popular: true,
        eligibilityCriteria: [
          'Meet Genuine Temporary Entrant (GTE) criteria',
          'Meet Australian health and character requirements',
          'Sufficient funds for the entire duration of stay'
        ],
        requiredDocuments: [
          'National identity card and passport biodata page',
          'Evidence of financial capacity (Tax returns, bank accounts, payslips)',
          'Cover letter outlining intended activities in Australia',
          'Evidence of commitments in India to return to (property, job, business)'
        ],
        keyTips: [
          'All documents in Indian regional languages must be accompanied by certified NAATI translations.'
        ]
      },
      // World to India Programs
      {
        id: 'visa_india_etourist',
        country: 'India',
        countryCode: 'IN',
        direction: 'world_to_india',
        category: 'tourist',
        name: 'India e-Tourist Visa (eTV)',
        subTitle: 'Official Government of India Electronic Travel Authorization',
        description: 'Facilitates fast digital visa processing for citizens of eligible countries visiting India for recreation, sightseeing, casual visits to friends or relatives.',
        validity: 'Available in 30-Day (Double Entry), 1-Year (Multiple), and 5-Year (Multiple) options',
        stayDuration: 'Continuous stay during each visit shall not exceed 90 days (180 days for US, UK, Canada, Japan)',
        processingTime: '72 hours to 4 calendar days online',
        approxGovFee: '$25 USD (30-day peak) / $40 USD (1-year) / $80 USD (5-year)',
        officialSourceUrl: 'https://indianvisaonline.gov.in/evisa/tvoa.html',
        officialSourceName: 'Bureau of Immigration, Ministry of Home Affairs, Government of India',
        lastVerifiedDate: '2026-02-24',
        status: 'published',
        popular: true,
        eligibilityCriteria: [
          'Hold passport of eligible e-Visa country with at least 6 months validity from arrival date',
          'Hold confirmed return ticket or onward journey ticket with sufficient money to spend in India',
          'Not available to diplomatic/official passport holders or Laissez-passer travel document holders'
        ],
        requiredDocuments: [
          'Digital photograph with white background (JPEG, 10 KB to 1 MB)',
          'Scanned Bio Page of passport showing photograph and personal details (PDF, 10 KB to 300 KB)',
          'Confirmed flight details (entry via 29 designated international airports or 5 designated seaports)'
        ],
        keyTips: [
          'Apply at least 4 days before expected arrival date in India.',
          'Biometrics of visitors are mandatorily captured upon arrival at Immigration counters.'
        ]
      },
      {
        id: 'visa_india_ebusiness',
        country: 'India',
        countryCode: 'IN',
        direction: 'world_to_india',
        category: 'business',
        name: 'India e-Business Visa',
        subTitle: 'Commercial Meetings, Trade Fairs, Technical Consultations',
        description: 'For foreign nationals visiting India to establish industrial/commercial ventures, explore business opportunities, purchase/sell goods, or deliver technical lectures.',
        validity: '1 Year (Multiple Entries)',
        stayDuration: 'Up to 180 days per calendar year with registration required if continuous stay exceeds 180 days',
        processingTime: '3 to 5 business days',
        approxGovFee: '$100 USD (Subject to country reciprocity)',
        officialSourceUrl: 'https://indianvisaonline.gov.in/evisa/tvoa.html',
        officialSourceName: 'Bureau of Immigration, Government of India',
        lastVerifiedDate: '2026-02-24',
        status: 'published',
        popular: true,
        eligibilityCriteria: [
          'Letter of invitation from Indian counterpart firm stating nature of business and duration',
          'Business card or corporate profile of foreign national'
        ],
        requiredDocuments: [
          'Passport bio page scan in PDF',
          'Business card or company credential of the applicant',
          'Formal invitation letter from host Indian business organization'
        ],
        keyTips: [
          'Not valid for employment in India or long-term staff deployment (requires regular Employment Visa).'
        ]
      },
      {
        id: 'visa_india_emedical',
        country: 'India',
        countryCode: 'IN',
        direction: 'world_to_india',
        category: 'medical',
        name: 'India e-Medical Visa',
        subTitle: 'Specialized Medical Treatment in Recognized Indian Hospitals',
        description: 'For international patients seeking treatment in recognized, specialized hospitals or wellness centers in India. Up to 2 Medical Attendants may accompany on e-Medical Attendant Visa.',
        validity: '60 days from date of first entry (Triple Entry)',
        stayDuration: 'Up to 60 days per entry (extendable in India via FRRO)',
        processingTime: '72 hours to 4 business days',
        approxGovFee: '$80 USD',
        officialSourceUrl: 'https://indianvisaonline.gov.in/evisa/tvoa.html',
        officialSourceName: 'Ministry of Health & Family Welfare / Bureau of Immigration India',
        lastVerifiedDate: '2026-02-14',
        status: 'published',
        popular: false,
        eligibilityCriteria: [
          'Official recommendation letter from medical specialist in patient home country',
          'Formal letter of admission/provisional appointment on letterhead of recognized Indian hospital'
        ],
        requiredDocuments: [
          'Passport bio page PDF',
          'Hospital letterhead confirmation from Indian healthcare facility stating tentative treatment plan'
        ],
        keyTips: [
          'Eligible for triple entry within the 60-day validity window for follow-up evaluations.'
        ]
      }
    ];

    // 3. Initial Applications
    const app1: Application = {
      id: 'app_2026_001',
      customerId: 'usr_customer_01',
      customerName: 'Rahul Sharma',
      customerEmail: 'rahul.sharma@example.com',
      visaProgramId: 'visa_us_b1b2',
      visaProgramName: 'US B1/B2 Visitor Visa',
      destinationCountry: 'United States',
      consultantId: 'usr_consultant_01',
      consultantName: 'Ananya Deshmukh',
      status: 'under_review',
      submissionDate: '2026-02-14T11:00:00Z',
      updatedAt: '2026-02-18T15:30:00Z',
      passportExpiry: '2031-08-15',
      intendedTravelDate: '2026-06-10',
      notesCount: 2,
      documentsCount: 4,
      consultantSummary: 'Initial DS-160 information reviewed. Bank statements verified. Waiting for updated salary slips for December and January.'
    };

    const app2: Application = {
      id: 'app_2026_002',
      customerId: 'usr_customer_02',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.jenkins@example.com',
      visaProgramId: 'visa_india_etourist',
      visaProgramName: 'India e-Tourist Visa (eTV)',
      destinationCountry: 'India',
      consultantId: 'usr_consultant_01',
      consultantName: 'Ananya Deshmukh',
      status: 'submitted',
      submissionDate: '2026-02-22T08:15:00Z',
      updatedAt: '2026-02-22T08:15:00Z',
      passportExpiry: '2030-04-19',
      intendedTravelDate: '2026-04-05',
      notesCount: 0,
      documentsCount: 2,
      consultantSummary: 'New submission pending initial consultant assignment review.'
    };

    this.applications = [app1, app2];

    // 4. Status History
    this.statusHistories = [
      {
        id: 'hist_001',
        applicationId: 'app_2026_001',
        fromStatus: 'draft',
        toStatus: 'submitted',
        changedBy: 'Rahul Sharma',
        changedByRole: 'customer',
        reason: 'Customer completed questionnaire and submitted primary documents.',
        timestamp: '2026-02-14T11:00:00Z'
      },
      {
        id: 'hist_002',
        applicationId: 'app_2026_001',
        fromStatus: 'submitted',
        toStatus: 'assigned',
        changedBy: 'Dr. Vikramaditya Sen',
        changedByRole: 'admin',
        reason: 'Case assigned to Senior Advisor Ananya Deshmukh.',
        timestamp: '2026-02-15T09:00:00Z'
      },
      {
        id: 'hist_003',
        applicationId: 'app_2026_001',
        fromStatus: 'assigned',
        toStatus: 'under_review',
        changedBy: 'Ananya Deshmukh',
        changedByRole: 'consultant',
        reason: 'Consultant initiated DS-160 document consistency audit.',
        timestamp: '2026-02-18T15:30:00Z'
      }
    ];

    // 5. Internal Consultant Notes
    this.caseNotes = [
      {
        id: 'note_001',
        applicationId: 'app_2026_001',
        consultantId: 'usr_consultant_01',
        consultantName: 'Ananya Deshmukh',
        note: 'Customer has clean travel record with previous visits to Singapore and Dubai. Employment history is steady with 4 years at current tech firm.',
        isInternalOnly: true,
        createdAt: '2026-02-16T14:10:00Z'
      },
      {
        id: 'note_002',
        applicationId: 'app_2026_001',
        consultantId: 'usr_consultant_01',
        consultantName: 'Ananya Deshmukh',
        note: 'Requested applicant to provide bank statement in official A4 format with bank branch manager round seal before Embassy interview date.',
        isInternalOnly: true,
        createdAt: '2026-02-18T15:25:00Z'
      }
    ];

    // 6. Documents
    this.documents = [
      {
        id: 'doc_001',
        applicationId: 'app_2026_001',
        customerId: 'usr_customer_01',
        title: 'Passport Biodata Page',
        documentType: 'passport_scan',
        fileName: 'sharma_rahul_passport_scan.pdf',
        fileSize: 452000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-02-14T10:45:00Z',
        status: 'approved',
        downloadUrl: '/api/v1/customer/documents/doc_001/download'
      },
      {
        id: 'doc_002',
        applicationId: 'app_2026_001',
        customerId: 'usr_customer_01',
        title: 'HDFC Bank Statement (6 Months)',
        documentType: 'bank_statement',
        fileName: 'hdfc_statement_aug25_jan26.pdf',
        fileSize: 1240000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-02-14T10:50:00Z',
        status: 'approved',
        downloadUrl: '/api/v1/customer/documents/doc_002/download'
      },
      {
        id: 'doc_003',
        applicationId: 'app_2026_001',
        customerId: 'usr_customer_01',
        title: 'Form 16 / ITR-V (Last 2 Years)',
        documentType: 'tax_return',
        fileName: 'itr_acknowledgement_ay2526.pdf',
        fileSize: 820000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-02-14T10:55:00Z',
        status: 'pending_review',
        downloadUrl: '/api/v1/customer/documents/doc_003/download'
      },
      {
        id: 'doc_004',
        applicationId: 'app_2026_001',
        customerId: 'usr_customer_01',
        title: 'Employer Leave Approval Letter',
        documentType: 'employment_letter',
        fileName: 'infosys_leave_approval_letter.pdf',
        fileSize: 310000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-02-14T10:58:00Z',
        status: 'approved',
        downloadUrl: '/api/v1/customer/documents/doc_004/download'
      },
      {
        id: 'doc_005',
        applicationId: 'app_2026_002',
        customerId: 'usr_customer_02',
        title: 'US Passport Biodata Page',
        documentType: 'passport_scan',
        fileName: 'jenkins_sarah_passport_biodata.pdf',
        fileSize: 580000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-02-22T08:10:00Z',
        status: 'pending_review',
        downloadUrl: '/api/v1/customer/documents/doc_005/download'
      }
    ];

    // 7. Appointments
    this.appointments = [
      {
        id: 'apt_2026_001',
        customerId: 'usr_customer_01',
        customerName: 'Rahul Sharma',
        customerEmail: 'rahul.sharma@example.com',
        customerPhone: '+91 98111 55667',
        consultantId: 'usr_consultant_01',
        consultantName: 'Ananya Deshmukh',
        consultationType: 'virtual_video',
        travelDirection: 'india_to_world',
        destinationCountry: 'United States',
        visaCategory: 'tourist',
        date: '2026-03-02',
        timeSlot: '11:00 AM - 11:45 AM',
        timezone: 'Asia/Kolkata (IST)',
        status: 'confirmed',
        notes: 'Discussion on DS-160 interview preparation and travel itinerary ties.',
        meetingLink: 'https://meet.google.com/aur-avisa-prep',
        createdAt: '2026-02-19T10:00:00Z'
      },
      {
        id: 'apt_2026_002',
        customerId: 'usr_customer_02',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah.jenkins@example.com',
        customerPhone: '+1 415 555 2671',
        consultantId: 'usr_consultant_01',
        consultantName: 'Ananya Deshmukh',
        consultationType: 'virtual_video',
        travelDirection: 'world_to_india',
        destinationCountry: 'India',
        visaCategory: 'tourist',
        date: '2026-03-05',
        timeSlot: '04:00 PM - 04:45 PM',
        timezone: 'Asia/Kolkata (IST)',
        status: 'confirmed',
        notes: 'Guidance on India 1-Year e-Tourist Visa and arrival ports (Delhi/Mumbai).',
        meetingLink: 'https://meet.google.com/aur-india-evisa',
        createdAt: '2026-02-22T09:30:00Z'
      }
    ];

    // 8. Enquiries
    this.enquiries = [
      {
        id: 'enq_001',
        name: 'Pooja Patel',
        email: 'pooja.patel@example.com',
        phone: '+91 98765 43210',
        travelDirection: 'india_to_world',
        destinationCountry: 'United Kingdom',
        visaCategory: 'student',
        message: 'Applying for MSc in Data Science at University of Manchester for September 2026 intake. Need guidance regarding CAS document and bank statement deposit timing.',
        status: 'in_progress',
        assignedTo: 'usr_consultant_01',
        createdAt: '2026-02-20T16:00:00Z'
      },
      {
        id: 'enq_002',
        name: 'Michael Vance',
        email: 'mvance@transworld-logistics.com',
        phone: '+44 20 7946 0192',
        travelDirection: 'world_to_india',
        destinationCountry: 'India',
        visaCategory: 'business',
        message: 'Representing a UK supply chain group setting up vendor audit in Chennai and Bengaluru. Need 1-Year e-Business Visa verification.',
        status: 'new',
        createdAt: '2026-02-24T12:45:00Z'
      }
    ];

    // 9. Audit Logs
    this.auditLogs = [
      {
        id: 'log_001',
        actorId: 'usr_admin_01',
        actorEmail: 'admin@auravisa.com',
        actorRole: 'admin',
        action: 'ASSIGN_CONSULTANT',
        targetType: 'Application',
        targetId: 'app_2026_001',
        details: 'Assigned application app_2026_001 to consultant Ananya Deshmukh (usr_consultant_01)',
        timestamp: '2026-02-15T09:00:00Z'
      },
      {
        id: 'log_002',
        actorId: 'usr_consultant_01',
        actorEmail: 'consultant@auravisa.com',
        actorRole: 'consultant',
        action: 'UPDATE_STATUS',
        targetType: 'Application',
        targetId: 'app_2026_001',
        details: 'Changed status from assigned to under_review',
        timestamp: '2026-02-18T15:30:00Z'
      },
      {
        id: 'log_003',
        actorId: 'usr_consultant_01',
        actorEmail: 'consultant@auravisa.com',
        actorRole: 'consultant',
        action: 'ADD_INTERNAL_NOTE',
        targetType: 'CaseNote',
        targetId: 'note_002',
        details: 'Created internal review note regarding bank seal requirements',
        timestamp: '2026-02-18T15:25:00Z'
      }
    ];
  }

  // Helper Methods
  public logAction(actor: User, action: string, targetType: string, targetId: string, details: string) {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    return log;
  }
}

// Global Singleton Store
export const db = new DatabaseStore();
