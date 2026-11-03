export interface SeedIndustry {
  key: string;
  name: string;
  nameTh: string;
  description: string;
  icon: string;
  professions: {
    key: string;
    name: string;
    nameTh: string;
    description: string;
    suggestedSkills: string[];
    professionSpecificFields?: Record<string, any>;
  }[];
}

export interface SeedCategory {
  key: string;
  name: string;
  nameTh: string;
  description: string;
  subcategories: { key: string; name: string; nameTh: string }[];
}

export interface SeedInterviewFormat {
  key: string;
  name: string;
  nameTh: string;
  description: string;
}

export interface SeedSeniority {
  category: 'career' | 'academic' | 'healthcare_licensed' | 'scholarship';
  key: string;
  name: string;
  nameTh: string;
  minYearsExp?: number;
  maxYearsExp?: number;
}

export interface SeedSkillCategory {
  key: string;
  name: string;
  nameTh: string;
  skills: { name: string; nameTh?: string; description?: string }[];
}

export const SEED_INDUSTRIES: SeedIndustry[] = [
  // 1. Technology & Information Technology
  {
    key: 'tech',
    name: 'Technology & Information Technology',
    nameTh: 'เทคโนโลยีและสารสนเทศ',
    description: 'Software development, cloud computing, artificial intelligence, data engineering, and IT infrastructure.',
    icon: 'Laptop',
    professions: [
      { key: 'software_engineer', name: 'Software Engineer', nameTh: 'วิศวกรซอฟต์แวร์', description: 'Designs and builds software systems and applications.', suggestedSkills: ['Data Structures', 'TypeScript', 'Python', 'System Design', 'Git', 'Clean Code'] },
      { key: 'frontend_developer', name: 'Frontend Developer', nameTh: 'นักพัฒนาฟรอนต์เอนด์', description: 'Develops client-facing web and mobile user interfaces.', suggestedSkills: ['React', 'Next.js', 'CSS/Tailwind', 'TypeScript', 'Web Performance'] },
      { key: 'backend_developer', name: 'Backend Developer', nameTh: 'นักพัฒนาแบ็กเอนด์', description: 'Builds server-side logic, microservices, and databases.', suggestedSkills: ['NestJS', 'Go', 'PostgreSQL', 'Redis', 'API Design', 'Docker'] },
      { key: 'fullstack_developer', name: 'Full-stack Developer', nameTh: 'นักพัฒนาฟูลสแต็ก', description: 'Delivers end-to-end full stack web applications.', suggestedSkills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'GraphQL', 'TypeScript'] },
      { key: 'mobile_developer', name: 'Mobile Developer', nameTh: 'นักพัฒนาแอปมือถือ', description: 'Builds native and cross-platform mobile apps for iOS and Android.', suggestedSkills: ['Flutter', 'Swift', 'Kotlin', 'React Native', 'Mobile UI/UX'] },
      { key: 'ai_engineer', name: 'AI Engineer', nameTh: 'วิศวกรปัญญาประดิษฐ์', description: 'Develops and integrates generative AI, LLMs, and agentic systems.', suggestedSkills: ['LLM Orchestration', 'Prompt Engineering', 'LangChain', 'Python', 'Vector DB', 'PyTorch'] },
      { key: 'machine_learning_engineer', name: 'Machine Learning Engineer', nameTh: 'วิศวกรการเรียนรู้ของเครื่อง', description: 'Designs, trains, and operationalizes machine learning models.', suggestedSkills: ['PyTorch', 'TensorFlow', 'MLOps', 'Feature Engineering', 'Model Evaluation'] },
      { key: 'data_scientist', name: 'Data Scientist', nameTh: 'นักวิทยาศาสตร์ข้อมูล', description: 'Analyzes complex datasets to extract predictive insights.', suggestedSkills: ['Statistical Modeling', 'Python', 'SQL', 'Predictive Analytics', 'Pandas'] },
      { key: 'data_analyst', name: 'Data Analyst', nameTh: 'นักวิเคราะห์ข้อมูล', description: 'Transforms raw data into dashboards and executive business intelligence.', suggestedSkills: ['Power BI', 'Tableau', 'Advanced SQL', 'Excel', 'Storytelling'] },
      { key: 'data_engineer', name: 'Data Engineer', nameTh: 'วิศวกรข้อมูล', description: 'Builds reliable ETL/ELT pipelines and big data warehouses.', suggestedSkills: ['Apache Spark', 'Kafka', 'PostgreSQL', 'Airflow', 'dbt', 'Snowflake'] },
      { key: 'cybersecurity_engineer', name: 'Cybersecurity Specialist', nameTh: 'ผู้เชี่ยวชาญความมั่นคงปลอดภัยไซเบอร์', description: 'Protects enterprise systems against cyber threats and vulnerabilities.', suggestedSkills: ['Penetration Testing', 'SIEM', 'Network Security', 'OWASP Top 10', 'ISO 27001'] },
      { key: 'cloud_engineer', name: 'Cloud Engineer', nameTh: 'วิศวกรคลาวด์', description: 'Provisions and monitors resilient multi-cloud architectures.', suggestedSkills: ['AWS', 'Google Cloud', 'Terraform', 'Kubernetes', 'Cloud Security'] },
      { key: 'devops_engineer', name: 'DevOps Engineer', nameTh: 'วิศวกรเดฟออปส์', description: 'Automates deployment pipelines and ensures infrastructure reliability.', suggestedSkills: ['CI/CD Pipelines', 'Docker', 'Kubernetes', 'Prometheus', 'Linux Administration'] },
      { key: 'system_administrator', name: 'System Administrator', nameTh: 'ผู้ดูแลระบบคอมพิวเตอร์', description: 'Maintains enterprise servers, networks, and IT services.', suggestedSkills: ['Linux/Unix', 'Active Directory', 'Network Protocols', 'Virtualization', 'Bash'] },
      { key: 'ui_ux_designer', name: 'UI/UX Designer', nameTh: 'นักออกแบบส่วนประสานและประสบการณ์ผู้ใช้', description: 'Conducts user research and crafts user interfaces and experiences.', suggestedSkills: ['Figma', 'Wireframing', 'User Testing', 'Design Systems', 'Interaction Design'] },
      { key: 'product_manager', name: 'Product Manager', nameTh: 'ผู้จัดการผลิตภัณฑ์', description: 'Defines product roadmaps, user personas, and feature priorities.', suggestedSkills: ['Product Strategy', 'Agile/Scrum', 'Data-driven Decisions', 'Stakeholder Management', 'User Stories'] },
      { key: 'it_project_manager', name: 'IT Project Manager', nameTh: 'ผู้จัดการโครงการไอที', description: 'Orchestrates technology projects on budget and on schedule.', suggestedSkills: ['PMP Methodologies', 'Scrum', 'Risk Management', 'Jira', 'Resource Planning'] },
      { key: 'software_architect', name: 'Software Architect', nameTh: 'สถาปนิกซอฟต์แวร์', description: 'Designs high-level software system architecture and patterns.', suggestedSkills: ['Distributed Systems', 'Domain-Driven Design', 'Event-Driven Architecture', 'Cloud Patterns'] },
    ],
  },

  // 2. Finance, Banking & Fintech
  {
    key: 'finance',
    name: 'Finance, Banking & Fintech',
    nameTh: 'การเงิน การธนาคาร และฟินเทค',
    description: 'Corporate accounting, financial planning, auditing, taxation, investment analysis, and fintech.',
    icon: 'DollarSign',
    professions: [
      { key: 'financial_analyst', name: 'Financial Analyst', nameTh: 'นักวิเคราะห์การเงิน', description: 'Performs corporate budgeting, forecasting, and financial modeling.', suggestedSkills: ['Financial Modeling', 'DCF Valuation', 'Budgeting & Forecasting', 'Excel Power Query'] },
      { key: 'investment_analyst', name: 'Investment Analyst', nameTh: 'นักวิเคราะห์การลงทุน', description: 'Evaluates securities, portfolio allocations, and capital market trends.', suggestedSkills: ['Equity Research', 'Valuation Models', 'Macroeconomics', 'Portfolio Management'] },
      { key: 'auditor', name: 'Auditor', nameTh: 'ผู้ตรวจสอบบัญชี', description: 'Assesses financial statements, internal governance, and regulatory compliance.', suggestedSkills: ['Audit Standards', 'Risk Assessment', 'Substantive Testing', 'Sampling Methodology'] },
      { key: 'accountant', name: 'Accountant', nameTh: 'นักบัญชี', description: 'Maintains financial ledgers, balance sheets, and statutory reports.', suggestedSkills: ['IFRS / TFRS', 'General Ledger', 'SAP ERP', 'Tax Filing', 'Financial Statements'] },
      { key: 'financial_controller', name: 'Financial Controller', nameTh: 'ผู้อำนวยการฝ่ายการเงินและบัญชี', description: 'Oversees accounting operations, statutory compliance, and internal audits.', suggestedSkills: ['Internal Controls', 'Consolidation', 'Audit Readiness', 'Treasury Management'] },
      { key: 'risk_analyst', name: 'Risk Analyst', nameTh: 'นักวิเคราะห์ความเสี่ยงทางการเงิน', description: 'Quantifies credit, market, and operational risk metrics.', suggestedSkills: ['Value at Risk (VaR)', 'Stress Testing', 'Basel III', 'Credit Scoring'] },
      { key: 'banking_officer', name: 'Banking Officer', nameTh: 'เจ้าหน้าที่ธนาคารพาณิชย์', description: 'Provides credit underwriting, retail banking, and trade finance.', suggestedSkills: ['Credit Analysis', 'Know Your Customer (KYC)', 'Trade Finance', 'Underwriting'] },
      { key: 'financial_advisor', name: 'Financial Advisor', nameTh: 'ที่ปรึกษาทางการเงิน', description: 'Guides clients on wealth management, retirement, and asset allocation.', suggestedSkills: ['Wealth Planning', 'Retirement Planning', 'Insurance Products', 'Mutual Funds'] },
      { key: 'fintech_product_specialist', name: 'FinTech Product Specialist', nameTh: 'ผู้เชี่ยวชาญผลิตภัณฑ์การเงินดิจิทัล', description: 'Builds digital payment systems and regulatory compliant fintech products.', suggestedSkills: ['Payment Gateway Architecture', 'AML/CFT Compliance', 'Open Banking API', 'Stripe/PromptPay Integration'] },
    ],
  },

  // 3. Healthcare & Medical
  {
    key: 'healthcare',
    name: 'Healthcare & Medical',
    nameTh: 'การแพทย์และการดูแลสุขภาพ',
    description: 'Clinical medicine, patient care, nursing, pharmaceuticals, health informatics, and clinical research.',
    icon: 'HeartPulse',
    professions: [
      { key: 'physician', name: 'Physician / Medical Doctor', nameTh: 'แพทย์ / แพทย์เวชปฏิบัติ', description: 'Diagnoses and treats patient illnesses, prescribing therapeutic regimens.', suggestedSkills: ['Clinical Diagnostics', 'Evidence-Based Medicine', 'Patient Communication', 'Emergency Triage', 'Medical Ethics'] },
      { key: 'nurse', name: 'Registered Nurse', nameTh: 'พยาบาลวิชาชีพ', description: 'Administers patient bedside care, medication, and clinical monitoring.', suggestedSkills: ['Patient Assessment', 'Medication Administration', 'BLS/ACLS', 'Wound Care', 'Nursing Process'] },
      { key: 'pharmacist', name: 'Pharmacist', nameTh: 'เภสัชกร', description: 'Dispenses medications, monitors pharmacotherapy, and counsels patients.', suggestedSkills: ['Pharmacology', 'Drug Interactions', 'Clinical Pharmacy', 'Good Pharmacy Practice'] },
      { key: 'physical_therapist', name: 'Physical Therapist', nameTh: 'นักกายภาพบำบัด', description: 'Restores patient mobility and rehabilitates musculoskeletal injuries.', suggestedSkills: ['Rehabilitation Techniques', 'Kinetic Assessment', 'Therapeutic Exercise', 'Ergonomic Evaluation'] },
      { key: 'medical_technologist', name: 'Medical Technologist', nameTh: 'นักเทคนิคการแพทย์', description: 'Performs clinical laboratory testing on specimens to assist diagnostic accuracy.', suggestedSkills: ['Hematology', 'Clinical Chemistry', 'Immunohematology', 'Microbiology', 'Quality Control'] },
      { key: 'public_health_specialist', name: 'Public Health Specialist', nameTh: 'นักวิชาการสาธารณสุข', description: 'Develops epidemiological surveillance and community health prevention initiatives.', suggestedSkills: ['Epidemiology', 'Health Policy Analysis', 'Community Intervention', 'Biostatistics'] },
      { key: 'medical_researcher', name: 'Medical Researcher', nameTh: 'นักวิจัยทางการแพทย์', description: 'Designs and executes clinical trials, genomics, and translational research.', suggestedSkills: ['ICH-GCP Guidelines', 'Clinical Trial Protocols', 'Translational Medicine', 'IRB Ethics Submissions'] },
      { key: 'hospital_administrator', name: 'Hospital Administrator', nameTh: 'ผู้บริหารโรงพยาบาลและบริการสุขภาพ', description: 'Manages clinical operations, healthcare accreditation, and hospital governance.', suggestedSkills: ['Healthcare Accreditation (HA/JCI)', 'Hospital Resource Management', 'Clinical Governance', 'Revenue Cycle Management'] },
    ],
  },

  // 4. Engineering & Industrial
  {
    key: 'engineering',
    name: 'Engineering & Industrial',
    nameTh: 'วิศวกรรมและอุตสาหกรรม',
    description: 'Mechanical, civil, electrical, chemical, industrial automation, and manufacturing engineering.',
    icon: 'Cog',
    professions: [
      { key: 'civil_engineer', name: 'Civil Engineer', nameTh: 'วิศวกรโยธา', description: 'Supervises infrastructure, structural concrete, and construction projects.', suggestedSkills: ['Structural Analysis', 'AutoCAD / Revit', 'Site Inspection', 'Quantity Surveying', 'Safety Standards'] },
      { key: 'electrical_engineer', name: 'Electrical Engineer', nameTh: 'วิศวกรไฟฟ้า', description: 'Designs power distribution, circuit boards, and electrical systems.', suggestedSkills: ['Circuit Design', 'PLC Programming', 'Power Systems', 'AutoCAD Electrical', 'MATLAB'] },
      { key: 'mechanical_engineer', name: 'Mechanical Engineer', nameTh: 'วิศวกรเครื่องกล', description: 'Designs thermal, HVAC, and mechanical machinery systems.', suggestedSkills: ['SolidWorks', 'Thermodynamics', 'AutoCAD', 'Finite Element Analysis', 'HVAC Design'] },
      { key: 'chemical_engineer', name: 'Chemical Engineer', nameTh: 'วิศวกรเคมี', description: 'Designs chemical synthesis processes, reactors, and refinery plants.', suggestedSkills: ['Process Simulation (Aspen)', 'Mass & Energy Balance', 'Process Safety Management', 'P&ID'] },
      { key: 'industrial_engineer', name: 'Industrial Engineer', nameTh: 'วิศวกรอุตสาหการ', description: 'Improves assembly line ergonomics, factory layouts, and cycle times.', suggestedSkills: ['Lean Manufacturing', 'Time & Motion Study', 'Supply Chain Flow', 'Quality Management', 'Kaizen'] },
      { key: 'automation_engineer', name: 'Automation & Robotics Engineer', nameTh: 'วิศวกรอัตโนมัติและหุ่นยนต์', description: 'Builds robotic automation lines, sensors, and SCADA systems.', suggestedSkills: ['PLC / SCADA', 'Robotics Kinematics', 'Industrial IoT', 'Sensors & Actuators'] },
      { key: 'qa_engineer_mfg', name: 'Quality Assurance Engineer (Manufacturing)', nameTh: 'วิศวกรควบคุมคุณภาพอุตสาหกรรม', description: 'Ensures ISO 9001 quality compliance, FMEA audits, and statistical process controls.', suggestedSkills: ['Statistical Process Control (SPC)', 'Six Sigma', 'FMEA', 'Root Cause Analysis (8D)', 'ISO 9001'] },
      { key: 'project_engineer', name: 'Project Engineer', nameTh: 'วิศวกรโครงการ', description: 'Coordinates engineering deliverables, contractor submittals, and milestone schedules.', suggestedSkills: ['Project Scheduling', 'EPC Contracting', 'Cost Estimation', 'Commissioning Protocol'] },
    ],
  },

  // 5. Business & Management
  {
    key: 'business',
    name: 'Business & Management',
    nameTh: 'ธุรกิจและการจัดการ',
    description: 'Corporate strategy, operations, business development, HR, marketing, and entrepreneurship.',
    icon: 'Briefcase',
    professions: [
      { key: 'business_analyst', name: 'Business Analyst', nameTh: 'นักวิเคราะห์ธุรกิจ', description: 'Bridges business requirements with technology solutions.', suggestedSkills: ['Requirement Elicitation', 'BPMN', 'Gap Analysis', 'Data Analysis', 'Agile BA'] },
      { key: 'business_development_executive', name: 'Business Development Executive', nameTh: 'เจ้าหน้าที่พัฒนาธุรกิจ', description: 'Expands client partnerships and identifies new commercial opportunities.', suggestedSkills: ['B2B Sales', 'Partnership Structuring', 'Pitching', 'Market Research'] },
      { key: 'marketing_manager', name: 'Marketing Manager', nameTh: 'ผู้จัดการฝ่ายการตลาด', description: 'Leads multichannel marketing campaigns and brand positioning.', suggestedSkills: ['Brand Strategy', 'Campaign Planning', 'Market Segmentation', 'Customer Lifetime Value'] },
      { key: 'digital_marketing_specialist', name: 'Digital Marketing Specialist', nameTh: 'ผู้เชี่ยวชาญการตลาดดิจิทัล', description: 'Executes paid ads, SEO, and social media growth strategies.', suggestedSkills: ['SEO/SEM', 'Google Analytics', 'Meta Ads', 'Conversion Rate Optimization'] },
      { key: 'sales_executive', name: 'Sales Executive', nameTh: 'เจ้าหน้าที่ฝ่ายขาย', description: 'Generates leads and closes revenue deals.', suggestedSkills: ['Pipeline Management', 'Consultative Selling', 'CRM', 'Negotiation', 'Closing Deals'] },
      { key: 'hr_business_partner', name: 'HR Business Partner', nameTh: 'ที่ปรึกษาพันธมิตรธุรกิจฝ่ายบุคคล', description: 'Aligns business goals with people strategies and talent development.', suggestedSkills: ['Strategic HR', 'Talent Management', 'Succession Planning', 'Organizational Design'] },
      { key: 'operations_manager', name: 'Operations Manager', nameTh: 'ผู้จัดการฝ่ายปฏิบัติการ', description: 'Optimizes business processes, supply logistics, and operational efficiency.', suggestedSkills: ['Process Optimization', 'Lean Six Sigma', 'Cost Control', 'Vendor Management'] },
      { key: 'management_consultant', name: 'Management Consultant', nameTh: 'ที่ปรึกษาด้านการจัดการองค์กร', description: 'Advises executives on corporate strategy and business turnaround.', suggestedSkills: ['Strategic Frameworks', 'Financial Modeling', 'Change Management', 'Executive Communication'] },
      { key: 'entrepreneur_founder', name: 'Entrepreneur / Venture Founder', nameTh: 'ผู้ประกอบการ / ผู้ก่อตั้งธุรกิจ', description: 'Builds ventures from inception to scale, leading capital raising and product market fit.', suggestedSkills: ['Venture Building', 'Fundraising', 'P&L Management', 'Pitching', 'Team Building'] },
    ],
  },

  // 6. Education & Academic
  {
    key: 'education',
    name: 'Education & Academic',
    nameTh: 'การศึกษาและวิชาการ',
    description: 'Higher education pedagogy, K-12 teaching, educational leadership, and academic curriculum design.',
    icon: 'GraduationCap',
    professions: [
      { key: 'teacher', name: 'School Teacher (K-12)', nameTh: 'ครูผู้สอนระดับการศึกษาขั้นพื้นฐาน', description: 'Delivers curriculum lessons, classroom pedagogy, and student mentorship.', suggestedSkills: ['Classroom Management', 'Lesson Planning', 'Formative Assessment', 'Differentiated Instruction'] },
      { key: 'university_lecturer', name: 'University Lecturer / Professor', nameTh: 'อาจารย์มหาวิทยาลัย', description: 'Instructs undergraduate and graduate courses, publishing academic research.', suggestedSkills: ['Higher Education Pedagogy', 'Curriculum Design', 'Academic Advising', 'Scholarly Research', 'Peer Review'] },
      { key: 'academic_researcher', name: 'Academic Researcher', nameTh: 'นักวิจัยประจำสถาบัน', description: 'Leads funded research investigations and writes grant proposals.', suggestedSkills: ['Research Methodology', 'Statistical Analysis', 'Academic Writing', 'Literature Review', 'Research Defense'] },
      { key: 'research_assistant', name: 'Research Assistant', nameTh: 'ผู้ช่วยวิจัย', description: 'Supports data collection, laboratory trials, and bibliographic reviews.', suggestedSkills: ['Data Collection', 'Bibliographic Management (Zotero/Mendeley)', 'Lab Protocols', 'Transcription'] },
      { key: 'teaching_assistant', name: 'Teaching Assistant (TA)', nameTh: 'ผู้ช่วยสอน', description: 'Assists faculty with grading, discussion seminars, and student tutoring.', suggestedSkills: ['Grading Rubrics', 'Recitation Facilitation', 'Student Mentoring', 'LMS Management (Canvas/Moodle)'] },
      { key: 'education_administrator', name: 'Education Administrator', nameTh: 'ผู้บริหารสถานศึกษา', description: 'Oversees institutional policy, student affairs, and school accreditation.', suggestedSkills: ['Academic Accreditation', 'Institutional Governance', 'Student Affairs', 'Curriculum Standards'] },
    ],
  },

  // 7. Legal & Government
  {
    key: 'legal_gov',
    name: 'Legal & Government',
    nameTh: 'กฎหมายและการปกครอง',
    description: 'Corporate law, litigation, public policy, regulatory compliance, and diplomatic public service.',
    icon: 'Scale',
    professions: [
      { key: 'lawyer', name: 'Lawyer / Litigator', nameTh: 'ทนายความ / ผู้ว่าความ', description: 'Represents clients in civil and criminal litigation and court hearings.', suggestedSkills: ['Trial Advocacy', 'Civil & Criminal Procedure', 'Legal Brief Writing', 'Cross-Examination'] },
      { key: 'corporate_counsel', name: 'Corporate Legal Counsel', nameTh: 'ที่ปรึกษากฎหมายองค์กร', description: 'Drafts commercial contracts, oversees corporate compliance, and advises on M&A.', suggestedSkills: ['Contract Drafting', 'M&A Due Diligence', 'Corporate Governance', 'Regulatory Compliance'] },
      { key: 'legal_consultant', name: 'Legal Consultant', nameTh: 'ที่ปรึกษาทางกฎหมาย', description: 'Advises private and public clients on statutory interpretation and risk.', suggestedSkills: ['Legal Research', 'Statutory Interpretation', 'Risk Advisory', 'Client Negotiation'] },
      { key: 'compliance_specialist', name: 'Compliance Specialist (PDPA / AML)', nameTh: 'ผู้เชี่ยวชาญการกำกับดูแลกฎระเบียบ', description: 'Enforces statutory compliance with personal data protection and financial regulations.', suggestedSkills: ['PDPA Compliance', 'AML/KYC Regulations', 'Internal Compliance Audits', 'Policy Enforcement'] },
      { key: 'policy_analyst', name: 'Public Policy Analyst', nameTh: 'นักวิเคราะห์นโยบายสาธารณะ', description: 'Evaluates public programs, regulatory impact assessments, and legislative proposals.', suggestedSkills: ['Policy Formulation', 'Regulatory Impact Assessment (RIA)', 'Cost-Benefit Analysis', 'Stakeholder Consultations'] },
      { key: 'government_officer', name: 'Government & Administrative Officer', nameTh: 'ข้าราชการ / เจ้าหน้าที่ฝ่ายปกครอง', description: 'Administers public service delivery, ministerial workflows, and civil governance.', suggestedSkills: ['Administrative Law', 'Government Procurement', 'Public Sector Protocols', 'Inter-Agency Coordination'] },
    ],
  },

  // 8. Design, Media & Communication
  {
    key: 'design_media',
    name: 'Design, Media & Communication',
    nameTh: 'การออกแบบ สื่อ และการสื่อสาร',
    description: 'Visual communication, brand identity, digital journalism, public relations, and multimedia production.',
    icon: 'Palette',
    professions: [
      { key: 'graphic_designer', name: 'Graphic & Brand Designer', nameTh: 'นักออกแบบกราฟิกและอัตลักษณ์แบรนด์', description: 'Crafts corporate branding, typography, print collateral, and digital marketing visuals.', suggestedSkills: ['Adobe Creative Suite', 'Typography', 'Brand Identity', 'Visual Storytelling', 'Color Theory'] },
      { key: 'content_creator', name: 'Content Creator & Copywriter', nameTh: 'นักสร้างสรรค์เนื้อหาและนักเขียนโฆษณา', description: 'Authors viral editorial stories, social media narratives, and campaign scripts.', suggestedSkills: ['Copywriting', 'Content Strategy', 'Social Media Algorithms', 'SEO Writing', 'Video Scripting'] },
      { key: 'video_producer', name: 'Video Producer & Editor', nameTh: 'ผู้ผลิตและตัดต่อวิดีโอ', description: 'Directs, shoots, and edits commercial video reels, documentaries, and motion ads.', suggestedSkills: ['Premiere Pro', 'After Effects', 'Cinematography', 'Audio Post-Production', 'Color Grading'] },
      { key: 'pr_specialist', name: 'Public Relations Specialist', nameTh: 'ผู้เชี่ยวชาญการประชาสัมพันธ์', description: 'Manages media relations, press releases, crisis communications, and corporate reputation.', suggestedSkills: ['Media Relations', 'Press Release Writing', 'Crisis PR', 'Corporate Reputation Management'] },
      { key: 'animator_3d', name: '3D Artist & Motion Designer', nameTh: 'นักออกแบบแอนิเมชันและสามมิติ', description: 'Creates 3D models, character rigging, and VFX motion graphics for interactive media.', suggestedSkills: ['Blender / Maya', '3D Modeling', 'Motion Graphics', 'Texturing & Lighting', 'Unreal Engine'] },
    ],
  },

  // 9. Hospitality & Tourism
  {
    key: 'hospitality',
    name: 'Hospitality & Tourism',
    nameTh: 'การบริการและการท่องเที่ยว',
    description: 'Hotel operations, travel management, culinary arts, airline services, and event planning.',
    icon: 'Utensils',
    professions: [
      { key: 'hotel_manager', name: 'Hotel General Manager', nameTh: 'ผู้จัดการทั่วไปโรงแรม', description: 'Leads lodging operations, guest satisfaction, revenue management, and staff leadership.', suggestedSkills: ['Hospitality Operations', 'Revenue Management (RevPAR)', 'Guest Satisfaction', 'Staff Leadership'] },
      { key: 'flight_attendant', name: 'Flight Attendant / In-Flight Specialist', nameTh: 'พนักงานต้อนรับบนเครื่องบิน', description: 'Ensures passenger safety, in-flight emergency protocols, and first-class customer service.', suggestedSkills: ['Aviation Safety Procedures', 'First Aid / CPR', 'Customer Service Excellence', 'Intercultural Communication'] },
      { key: 'chef_de_cuisine', name: 'Chef de Cuisine / Executive Chef', nameTh: 'หัวหน้าพ่อครัว / เชฟบริหาร', description: 'Designs restaurant menus, manages kitchen stations, and enforces food safety HACCP.', suggestedSkills: ['Culinary Arts', 'Menu Engineering', 'Kitchen Station Management', 'Food Safety (HACCP)', 'Cost Control'] },
      { key: 'event_planner', name: 'Event & MICE Coordinator', nameTh: 'ผู้จัดการงานอีเวนต์และสัมมนา', description: 'Orchestrates corporate conferences, exhibitions, banquet logistics, and vendor contracts.', suggestedSkills: ['Event Logistics', 'MICE Planning', 'Vendor Negotiation', 'Budget Tracking', 'Live Event Production'] },
      { key: 'travel_consultant', name: 'Tourism & Travel Consultant', nameTh: 'ที่ปรึกษาด้านการท่องเที่ยว', description: 'Curates personalized travel itineraries, visa logistics, and international destination tours.', suggestedSkills: ['GDS Ticketing (Amadeus/Sabre)', 'Destination Knowledge', 'Itinerary Planning', 'Customer Care'] },
    ],
  },

  // 10. Science & Research
  {
    key: 'science_research',
    name: 'Science & Research',
    nameTh: 'วิทยาศาสตร์และการวิจัย',
    description: 'Fundamental physics, chemistry, biotechnology, molecular biology, environmental research, and laboratory science.',
    icon: 'Microscope',
    professions: [
      { key: 'biotechnologist', name: 'Biotechnologist', nameTh: 'นักเทคโนโลยีชีวภาพ', description: 'Researches genetic engineering, microbial fermentation, and biopharmaceutical synthesis.', suggestedSkills: ['PCR & Electrophoresis', 'Microbial Fermentation', 'Gene Cloning', 'Bioinformatics', 'GLP Standards'] },
      { key: 'chemist_analytical', name: 'Analytical Chemist', nameTh: 'นักเคมีวิเคราะห์', description: 'Performs chromatography, mass spectrometry, and compound purity assays.', suggestedSkills: ['HPLC & GC-MS', 'Spectrophotometry', 'Method Validation', 'Chemical Safety (MSDS)', 'Quality Control'] },
      { key: 'data_bioinformatician', name: 'Bioinformatician', nameTh: 'นักชีวสารสนเทศศาสตร์', description: 'Processes genomic sequencing datasets and computational biology algorithms.', suggestedSkills: ['Next-Gen Sequencing (NGS)', 'Python/Biopython', 'R for Genomics', 'BLAST Algorithms', 'Phylogenetics'] },
      { key: 'physicist_materials', name: 'Materials Scientist / Physicist', nameTh: 'นักฟิสิกส์และวิทยาการวัสดุ', description: 'Investigates nanotechnology, semiconductors, and advanced polymer characteristics.', suggestedSkills: ['X-ray Diffraction (XRD)', 'Scanning Electron Microscopy (SEM)', 'Quantum Principles', 'Thin-Film Deposition'] },
      { key: 'principal_investigator', name: 'Principal Investigator (PI)', nameTh: 'หัวหน้าโครงการวิจัยหลัก', description: 'Heads laboratory grants, supervises postdoctoral scholars, and defends research milestones.', suggestedSkills: ['Grant Acquisition', 'Laboratory Leadership', 'Peer-Review Publishing', 'Research Ethics', 'Patenting'] },
    ],
  },

  // 11. Agriculture & Food Technology
  {
    key: 'agriculture_food',
    name: 'Agriculture & Food Technology',
    nameTh: 'เกษตรกรรมและเทคโนโลยีอาหาร',
    description: 'Agronomy, precision farming, food product development, post-harvest engineering, and nutritional science.',
    icon: 'Wheat',
    professions: [
      { key: 'agronomist', name: 'Agronomist / Crop Scientist', nameTh: 'นักปฐพีวิทยาและพืชศาสตร์', description: 'Optimizes soil nutrient management, crop yields, and integrated pest control.', suggestedSkills: ['Soil Chemistry', 'Crop Rotation Planning', 'Integrated Pest Management (IPM)', 'Plant Nutrition'] },
      { key: 'precision_agriculture_spec', name: 'Precision Agriculture Specialist', nameTh: 'ผู้เชี่ยวชาญการทำเกษตรแม่นยำ', description: 'Deploys agricultural drones, GIS satellite mapping, and IoT sensor irrigation systems.', suggestedSkills: ['GIS & Remote Sensing', 'Agricultural Drones', 'IoT Soil Sensors', 'Yield Mapping Analytics'] },
      { key: 'food_scientist', name: 'Food Scientist & Technologist', nameTh: 'นักวิทยาศาสตร์การอาหาร', description: 'Develops novel food formulations, shelf-life stabilization, and sensory evaluation panels.', suggestedSkills: ['Food Chemistry', 'Sensory Evaluation', 'Product Formulation', 'HACCP / GMP', 'Packaging Technology'] },
      { key: 'food_safety_auditor', name: 'Food Safety & QA Auditor', nameTh: 'ผู้ตรวจประเมินความปลอดภัยด้านอาหาร', description: 'Conducts food manufacturing audits under BRC, ISO 22000, and FDA statutory requirements.', suggestedSkills: ['ISO 22000', 'BRC Global Standards', 'Sanitation Protocols', 'Traceability Systems', 'Audit Reporting'] },
      { key: 'smart_farm_manager', name: 'Smart Farm Operations Manager', nameTh: 'ผู้จัดการฟาร์มอัจฉริยะ', description: 'Supervises commercial hydroponics, automated greenhouses, and agricultural supply chains.', suggestedSkills: ['Hydroponics / CEA', 'Greenhouse Automation', 'Agricultural P&L', 'Farm Labor Management'] },
    ],
  },

  // 12. Logistics & Supply Chain
  {
    key: 'logistics_supply',
    name: 'Logistics & Supply Chain',
    nameTh: 'โลจิสติกส์และห่วงโซ่อุปทาน',
    description: 'Freight forwarding, customs brokerage, warehouse automation, inventory optimization, and procurement.',
    icon: 'Truck',
    professions: [
      { key: 'supply_chain_manager', name: 'Supply Chain Manager', nameTh: 'ผู้จัดการห่วงโซ่อุปทาน', description: 'Coordinates end-to-end supply planning, demand forecasting, and vendor KPIs.', suggestedSkills: ['Demand Planning (S&OP)', 'Vendor Management', 'Cost Optimization', 'ERP Supply Modules', 'Risk Hedging'] },
      { key: 'logistics_analyst', name: 'Logistics Operations Analyst', nameTh: 'นักวิเคราะห์ปฏิบัติการโลจิสติกส์', description: 'Optimizes transport routing, fleet telemetry, and fuel efficiency metrics.', suggestedSkills: ['Route Optimization', 'Fleet Telematics', 'Logistics KPI Dashboards', 'Freight Cost Modeling'] },
      { key: 'warehouse_operations_mgr', name: 'Warehouse & Distribution Manager', nameTh: 'ผู้จัดการคลังสินค้าและการกระจายสินค้า', description: 'Directs automated warehouse pick-and-pack workflows and cross-docking operations.', suggestedSkills: ['Warehouse Management Systems (WMS)', 'Slotting Optimization', 'Inventory Auditing', '5S & OSHA Safety'] },
      { key: 'customs_compliance_spec', name: 'Customs & Trade Compliance Specialist', nameTh: 'ผู้เชี่ยวชาญศุลกากรและการค้าระหว่างประเทศ', description: 'Handles HS code classification, Free Trade Agreements (FTA), and import/export declarations.', suggestedSkills: ['HS Tariff Classification', 'Incoterms 2020', 'FTA Rules of Origin', 'Customs Clearance Procedures'] },
      { key: 'procurement_specialist', name: 'Strategic Procurement Specialist', nameTh: 'ผู้เชี่ยวชาญการจัดซื้อเชิงกลยุทธ์', description: 'Negotiates master supplier contracts, manages RFP bidding, and enforces ethical sourcing.', suggestedSkills: ['Strategic Sourcing', 'RFP/RFQ Evaluation', 'Contract Negotiation', 'Supplier Scorecards', 'Cost Reduction'] },
    ],
  },

  // 13. Architecture & Construction
  {
    key: 'architecture_const',
    name: 'Architecture & Construction',
    nameTh: 'สถาปัตยกรรมและการก่อสร้าง',
    description: 'Architectural design, urban planning, BIM engineering, construction site supervision, and building safety.',
    icon: 'Building2',
    professions: [
      { key: 'architect', name: 'Architectural Designer', nameTh: 'สถาปนิก', description: 'Designs spatial layouts, conceptual building facades, and construction permit drawings.', suggestedSkills: ['Architectural Drawing', 'Revit / BIM', 'AutoCAD', 'Building Codes', 'Spatial Planning', '3D Rendering'] },
      { key: 'urban_planner', name: 'Urban & Regional Planner', nameTh: 'นักผังเมืองและพัฒนาพื้นที่', description: 'Develops municipal zoning maps, transit-oriented designs, and environmental master plans.', suggestedSkills: ['Urban Zoning Regulations', 'GIS Spatial Analysis', 'Transit-Oriented Development', 'Public Hearing Facilitation'] },
      { key: 'construction_site_manager', name: 'Construction Site Manager', nameTh: 'ผู้จัดการสนามและไซต์งานก่อสร้าง', description: 'Supervises field subcontractor crews, safety OSHA protocols, and daily pouring schedules.', suggestedSkills: ['Site Supervision', 'Subcontractor Management', 'Construction Safety (OSHA)', 'Daily Progress Logs'] },
      { key: 'bim_coordinator', name: 'BIM Coordinator & Modeler', nameTh: 'ผู้ประสานงานแบบจำลองสารสนเทศอาคาร (BIM)', description: 'Performs 3D clash detection between architectural, structural, and MEP engineering models.', suggestedSkills: ['Navisworks Clash Detection', 'Revit BIM Standards', 'MEP Coordination', 'LOD Specifications'] },
      { key: 'quantity_surveyor', name: 'Quantity Surveyor / Cost Estimator', nameTh: 'ผู้ประเมินราคาและวิศวกรถอดแบบ (QS)', description: 'Calculates Bill of Quantities (BOQ), construction material estimates, and variation orders.', suggestedSkills: ['BOQ Preparation', 'Material Takeoff', 'Cost Engineering', 'Contract Variation Analysis'] },
    ],
  },

  // 14. Environment & Renewable Energy
  {
    key: 'environment_energy',
    name: 'Environment & Renewable Energy',
    nameTh: 'สิ่งแวดล้อมและพลังงานทดแทน',
    description: 'Solar/wind power systems, environmental impact assessment (EIA), carbon accounting, and ESG governance.',
    icon: 'Leaf',
    professions: [
      { key: 'solar_energy_engineer', name: 'Solar PV & Renewable Energy Engineer', nameTh: 'วิศวกรพลังงานแสงอาทิตย์และพลังงานหมุนเวียน', description: 'Designs commercial rooftop solar arrays, inverter configurations, and grid-tie connections.', suggestedSkills: ['PVSyst Simulation', 'Solar PV System Sizing', 'Grid Interconnection Protocols', 'Energy Storage (BESS)'] },
      { key: 'environmental_scientist', name: 'Environmental Impact Scientist (EIA)', nameTh: 'นักวิทยาศาสตร์สิ่งแวดล้อมและการประเมินผลกระทบ', description: 'Conducts air/water pollution sampling, biodiversity audits, and statutory EIA filings.', suggestedSkills: ['Environmental Impact Assessment (EIA)', 'Water Quality Testing', 'Air Dispersion Modeling', 'Environmental Law'] },
      { key: 'carbon_accounting_consultant', name: 'Carbon Accounting & ESG Specialist', nameTh: 'ผู้เชี่ยวชาญการบัญชีคาร์บอนและ ESG', description: 'Calculates Scope 1/2/3 greenhouse gas emissions and advises corporate sustainability disclosures.', suggestedSkills: ['GHG Protocol Accounting', 'Scope 1/2/3 Calculation', 'GRI / ISSB Standards', 'Carbon Credit Offsets'] },
      { key: 'energy_efficiency_auditor', name: 'Energy Efficiency Auditor', nameTh: 'ผู้ตรวจประเมินประสิทธิภาพการใช้พลังงาน', description: 'Audits industrial thermal boilers, HVAC chillers, and recommends electrical savings.', suggestedSkills: ['ASHRAE Level II/III Audits', 'Thermal Energy Auditing', 'HVAC Optimization', 'ISO 50001'] },
      { key: 'waste_management_engineer', name: 'Circular Economy & Waste Engineer', nameTh: 'วิศวกรการจัดการของเสียและเศรษฐกิจหมุนเวียน', description: 'Designs industrial wastewater treatment plants and zero-waste recycling streams.', suggestedSkills: ['Wastewater Treatment Design', 'Hazardous Waste Protocols', 'Circular Lifecycle Assessment', 'Zero Waste to Landfill'] },
    ],
  },

  // 15. Social Development & Non-Profit
  {
    key: 'social_nonprofit',
    name: 'Social Development & Non-Profit',
    nameTh: 'การพัฒนาสังคมและองค์กรไม่แสวงหากำไร',
    description: 'Community advocacy, NGO program management, grant administration, international aid, and human rights advocacy.',
    icon: 'HeartHandshake',
    professions: [
      { key: 'ngo_program_manager', name: 'NGO Program Director', nameTh: 'ผู้อำนวยการโครงการองค์กรพัฒนาเอกชน (NGO)', description: 'Orchestrates philanthropic humanitarian projects, donor reporting, and field volunteer deployments.', suggestedSkills: ['Program Logic Models (LogFrame)', 'Donor Grant Reporting', 'Field Team Management', 'Community Needs Assessment'] },
      { key: 'fundraising_manager', name: 'Philanthropic Partnership Manager', nameTh: 'ผู้จัดการระดมทุนและพันธมิตรเพื่อสังคม', description: 'Secures institutional philanthropic grants, CSR donor sponsorship, and major donor campaigns.', suggestedSkills: ['Grant Proposal Writing', 'Major Donor Stewardship', 'CSR Partnership Structuring', 'Crowdfunding Campaigns'] },
      { key: 'social_worker', name: 'Licensed Social Worker', nameTh: 'นักสังคมสงเคราะห์วิชาชีพ', description: 'Provides crisis intervention, family counseling, child welfare advocacy, and community outreach.', suggestedSkills: ['Case Management', 'Crisis Intervention', 'Child Welfare Regulations', 'Trauma-Informed Practice'] },
      { key: 'human_rights_advocate', name: 'Human Rights & Policy Advocate', nameTh: 'นักรณรงค์สิทธิมนุษยชนและนโยบายสังคม', description: 'Documents statutory human rights compliance, leads legal aid clinics, and writes policy briefs.', suggestedSkills: ['International Human Rights Law', 'Policy Advocacy', 'Legal Aid Coordination', 'Shadow Report Drafting'] },
      { key: 'community_development_officer', name: 'Community Development Facilitator', nameTh: 'นักพัฒนาชุมชนและส่งเสริมการมีส่วนร่วม', description: 'Facilitates village participatory workshops, micro-finance collectives, and social enterprise initiatives.', suggestedSkills: ['Participatory Rural Appraisal (PRA)', 'Micro-finance Governance', 'Community Mobilization', 'Social Enterprise Models'] },
    ],
  },
];

export const SEED_INTERVIEW_CATEGORIES: SeedCategory[] = [
  // 1. Job Interview
  {
    key: 'job',
    name: 'Job Interview',
    nameTh: 'การสัมภาษณ์งาน',
    description: 'Interviews for professional corporate, technical, and operational employment.',
    subcategories: [
      { key: 'general_job', name: 'General Job Interview', nameTh: 'การสัมภาษณ์งานทั่วไป' },
      { key: 'technical', name: 'Technical Deep-Dive', nameTh: 'การสัมภาษณ์เชิงเทคนิคเฉพาะทาง' },
      { key: 'behavioral', name: 'Behavioral Interview (STAR)', nameTh: 'การสัมภาษณ์เชิงพฤติกรรม' },
      { key: 'hr', name: 'HR Culture Fit Interview', nameTh: 'การสัมภาษณ์วัฒนธรรมองค์กร' },
      { key: 'managerial', name: 'Managerial & Leadership Interview', nameTh: 'การสัมภาษณ์ระดับผู้จัดการ' },
      { key: 'executive', name: 'Executive & C-Level Interview', nameTh: 'การสัมภาษณ์ระดับผู้บริหารระดับสูง' },
    ],
  },

  // 2. Scholarship Interview
  {
    key: 'scholarship',
    name: 'Scholarship Interview',
    nameTh: 'การสัมภาษณ์เพื่อชิงทุนการศึกษา',
    description: 'Interviews for government, international merit-based, and philanthropic scholarships.',
    subcategories: [
      { key: 'govt_scholarship', name: 'Government Scholarship (ทุนรัฐบาล/ทุน ก.พ.)', nameTh: 'ทุนรัฐบาลและหน่วยงานรัฐ' },
      { key: 'international_scholarship', name: 'Prestigious International Scholarship (Fulbright / Chevening)', nameTh: 'ทุนการศึกษาต่างประเทศชั้นนำ' },
      { key: 'university_scholarship', name: 'University Merit Scholarship', nameTh: 'ทุนผลการเรียนดีเด่นของมหาวิทยาลัย' },
      { key: 'research_grant_scholarship', name: 'Research Grant Scholarship', nameTh: 'ทุนสนับสนุนการทำวิจัย' },
    ],
  },

  // 3. University Admission (Undergraduate)
  {
    key: 'university_admission',
    name: 'University Admission (Undergraduate)',
    nameTh: 'การคัดเลือกเข้าศึกษาระดับปริญญาตรี (TCAS / Portfolio / Quota)',
    description: 'Undergraduate faculty admission interviews evaluating student aptitude, motivation, and portfolio.',
    subcategories: [
      { key: 'tcas_portfolio', name: 'Portfolio Round (TCAS 1)', nameTh: 'รอบแฟ้มสะสมผลงาน' },
      { key: 'tcas_quota', name: 'Quota Round (TCAS 2)', nameTh: 'รอบโควตาพื้นที่และโครงการพิเศษ' },
      { key: 'tcas_admission', name: 'Direct Admission & Interview (TCAS 3)', nameTh: 'รอบรับตรงและทดสอบความถนัด' },
      { key: 'international_program_admission', name: 'International Program Admission (BBA / ISE / Med)', nameTh: 'การคัดเลือกหลักสูตรนานาชาติ' },
    ],
  },

  // 4. Graduate School Admission
  {
    key: 'graduate_admission',
    name: 'Graduate School Admission (Master & PhD)',
    nameTh: 'การคัดเลือกเข้าศึกษาระดับบัณฑิตศึกษา (ปริญญาโท-เอก)',
    description: 'Interviews evaluating academic rigor, research intent, and discipline foundations for postgrad degrees.',
    subcategories: [
      { key: 'masters_degree_interview', name: "Master's Degree Admission Interview", nameTh: 'การสัมภาษณ์เข้าศึกษาต่อปริญญาโท' },
      { key: 'phd_doctoral_interview', name: 'Doctoral / PhD Candidate Interview', nameTh: 'การสัมภาษณ์เข้าศึกษาต่อปริญญาเอก' },
      { key: 'mba_executive_admission', name: 'MBA & Executive Degree Admission', nameTh: 'การสัมภาษณ์เข้าศึกษาหลักสูตรบริหารธุรกิจมหาบัณฑิต' },
    ],
  },

  // 5. Internship Interview
  {
    key: 'internship',
    name: 'Internship & Trainee Interview',
    nameTh: 'การสัมภาษณ์เพื่อฝึกงานและสหกิจศึกษา',
    description: 'Interviews for university students seeking summer internships or cooperative education placements.',
    subcategories: [
      { key: 'summer_internship', name: 'Summer Internship Selection', nameTh: 'การคัดเลือกนักศึกษาฝึกงานภาคฤดูร้อน' },
      { key: 'cooperative_education', name: 'Cooperative Education Placement (สหกิจศึกษา)', nameTh: 'การคัดเลือกโครงการสหกิจศึกษา' },
      { key: 'management_trainee', name: 'Management Trainee Fast-Track Selection', nameTh: 'การคัดเลือกโครงการผู้จัดการฝึกหัด' },
    ],
  },

  // 6. Student Exchange Program
  {
    key: 'student_exchange',
    name: 'Student Exchange Program',
    nameTh: 'การสัมภาษณ์โครงการนักเรียน / นิสิตแลกเปลี่ยน',
    description: 'Interviews evaluating language proficiency, cultural adaptation, and ambassadorial mindset for overseas exchange.',
    subcategories: [
      { key: 'bilateral_university_exchange', name: 'Bilateral University Exchange Program', nameTh: 'โครงการแลกเปลี่ยนระหว่างมหาวิทยาลัย' },
      { key: 'highschool_cultural_exchange', name: 'High School Cultural Exchange (AFS / YFU)', nameTh: 'โครงการนักเรียนแลกเปลี่ยนระดับมัธยมศึกษา' },
      { key: 'work_and_travel', name: 'Work and Travel Cultural Readiness', nameTh: 'การเตรียมความพร้อมโครงการเวิร์กแอนด์ทราเวล' },
    ],
  },

  // 7. International Fellowship
  {
    key: 'international_fellowship',
    name: 'International Fellowship & Visiting Scholar',
    nameTh: 'การสัมภาษณ์ทุนวิจัยและวิชาชีพระดับนานาชาติ',
    description: 'High-stakes interviews for distinguished mid-career visiting scholars and global institutional fellows.',
    subcategories: [
      { key: 'postdoctoral_fellowship', name: 'Global Postdoctoral Fellowship', nameTh: 'ทุนวิจัยหลังปริญญาเอกระดับนานาชาติ' },
      { key: 'visiting_scholar_fellowship', name: 'Visiting Academic Scholar Appointment', nameTh: 'ทุนอาจารย์และนักวิจัยรับเชิญ' },
      { key: 'leadership_fellowship', name: 'Global Public Leadership Fellowship', nameTh: 'ทุนพัฒนาผู้นำด้านนโยบายระดับสากล' },
    ],
  },

  // 8. Research Position Interview
  {
    key: 'research_position',
    name: 'Research Position Interview',
    nameTh: 'การสัมภาษณ์ตำแหน่งนักวิจัยประจำห้องปฏิบัติการ',
    description: 'Interviews for institutional lab researchers, scientists, and clinical investigators.',
    subcategories: [
      { key: 'laboratory_scientist_post', name: 'Laboratory Scientist Position', nameTh: 'ตำแหน่งนักวิทยาศาสตร์ประจำห้องปฏิบัติการ' },
      { key: 'research_fellow_appointment', name: 'Research Fellow Appointment', nameTh: 'การสัมภาษณ์ตำแหน่งนักวิจัยสมทบ' },
      { key: 'clinical_trial_coordinator', name: 'Clinical Trial Coordinator Interview', nameTh: 'การคัดเลือกผู้ประสานงานวิจัยทางคลินิก' },
    ],
  },

  // 9. Research Proposal Defense
  {
    key: 'research_proposal_defense',
    name: 'Research Proposal Defense (QE / Qualifying Exam)',
    nameTh: 'การสอบป้องกันโครงร่างดุษฎีนิพนธ์ / วิทยานิพนธ์',
    description: 'Formal oral defense of research problem, literature review, and experimental methodology before committee.',
    subcategories: [
      { key: 'phd_qualifying_exam', name: 'PhD Qualifying Examination (QE)', nameTh: 'การสอบวัดคุณสมบัติเพื่อเป็นดุษฎีบัณฑิต' },
      { key: 'master_proposal_defense', name: "Master's Thesis Proposal Defense", nameTh: 'การสอบป้องกันหัวข้อวิทยานิพนธ์ปริญญาโท' },
      { key: 'grant_proposal_defense', name: 'Research Grant Committee Defense', nameTh: 'การนำเสนอโครงการเพื่อขออนุมัติทุนวิจัย' },
    ],
  },

  // 10. Thesis Defense (Master's)
  {
    key: 'thesis_defense',
    name: "Thesis Defense (Master's Degree)",
    nameTh: 'การสอบป้องกันวิทยานิพนธ์ระดับปริญญาโท',
    description: 'Oral examination and defense of research findings, empirical analysis, and conclusions before faculty readers.',
    subcategories: [
      { key: 'final_oral_thesis_defense', name: 'Final Oral Thesis Defense', nameTh: 'การสอบปากเปล่าวิทยานิพนธ์รอบสุดท้าย' },
      { key: 'capstone_defense', name: 'Professional Capstone Project Defense', nameTh: 'การนำเสนอโครงการบูรณาการระดับปริญญาโท' },
    ],
  },

  // 11. Dissertation Defense (Doctoral)
  {
    key: 'dissertation_defense',
    name: 'Dissertation Defense (Doctoral Degree / PhD)',
    nameTh: 'การสอบป้องกันดุษฎีนิพนธ์ระดับปริญญาเอก',
    description: 'Comprehensive academic defense demonstrating original contribution to knowledge and methodological mastery.',
    subcategories: [
      { key: 'public_dissertation_defense', name: 'Public Dissertation Defense & Scrutiny', nameTh: 'การสอบป้องกันดุษฎีนิพนธ์ต่อสาธารณชน' },
      { key: 'doctoral_committee_viva', name: 'Doctoral Committee Viva Voce', nameTh: 'การสอบปากเปล่าต่อหน้าคณะกรรมการผู้ทรงคุณวุฒิ' },
    ],
  },

  // 12. Professional Certification
  {
    key: 'professional_certification',
    name: 'Professional Certification & Board Licensing',
    nameTh: 'การสอบสัมภาษณ์เพื่อรับรองใบอนุญาตวิชาชีพ',
    description: 'Interviews administered by statutory regulatory councils (Medical, Bar, Engineering, CPA).',
    subcategories: [
      { key: 'medical_specialty_board', name: 'Medical Specialty Board Interview (แพทยสภา)', nameTh: 'การสอบวุฒิบัตรแพทย์เฉพาะทาง' },
      { key: 'bar_oral_examination', name: 'Bar Association Oral Examination (เนติบัณฑิต)', nameTh: 'การสอบปากเปล่าเนติบัณฑิต' },
      { key: 'professional_engineer_license', name: 'Professional Engineer License Review (สภาวิศวกร)', nameTh: 'การสัมภาษณ์เลื่อนระดับใบ กว.' },
      { key: 'cpa_license_oral_review', name: 'CPA Statutory Licensing Review', nameTh: 'การสอบสัมภาษณ์ผู้สอบบัญชีรับอนุญาต' },
    ],
  },

  // 13. Career Promotion Interview
  {
    key: 'career_promotion',
    name: 'Career Promotion & Succession Assessment',
    nameTh: 'การสัมภาษณ์เพื่อเลื่อนตำแหน่งและสืบทอดบทบาท',
    description: 'Internal corporate interviews evaluating candidate track record, business impact, and readiness for higher bands.',
    subcategories: [
      { key: 'senior_to_lead_promotion', name: 'Senior to Lead / Principal Promotion', nameTh: 'การเลื่อนขั้นสู่ตำแหน่งหัวหน้าทีม / ผู้เชี่ยวชาญ' },
      { key: 'lead_to_director_promotion', name: 'Lead to Director / Head of Department', nameTh: 'การเลื่อนขั้นสู่ระดับผู้อำนวยการฝ่าย' },
      { key: 'succession_candidate_review', name: 'Succession Planning Talent Review', nameTh: 'การประเมินผู้สืบทอดตำแหน่งสำคัญขององค์กร' },
    ],
  },

  // 14. Leadership Assessment
  {
    key: 'leadership_assessment',
    name: 'Leadership Assessment Center',
    nameTh: 'การประเมินภาวะผู้นำและวิสัยทัศน์องค์กร',
    description: 'Deep psychological and competency evaluation of executive vision, people leadership, and ethics under crisis.',
    subcategories: [
      { key: 'executive_vision_alignment', name: 'Executive Vision & Strategy Alignment', nameTh: 'การประเมินวิสัยทัศน์และการขับเคลื่อนกลยุทธ์' },
      { key: 'crisis_leadership_simulation', name: 'Crisis Leadership & Dilemma Simulation', nameTh: 'การจำลองการนำทีมในภาวะวิกฤต' },
      { key: 'change_management_aptitude', name: 'Change Management & Cultural Transformation', nameTh: 'การประเมินศักยภาพการเปลี่ยนแปลงวัฒนธรรมองค์กร' },
    ],
  },

  // 15. Performance Evaluation
  {
    key: 'performance_evaluation',
    name: 'Annual Performance & Appraisal Interview',
    nameTh: 'การสัมภาษณ์ประเมินผลการปฏิบัติงานประจำปี',
    description: 'Structured dialogue reviewing annual OKRs, developmental feedback, and compensation reviews.',
    subcategories: [
      { key: 'annual_okr_appraisal', name: 'Annual OKR / KPI Milestone Review', nameTh: 'การประเมินผลการปฏิบัติงานตามเป้าหมายประจำปี' },
      { key: 'mid_year_growth_coaching', name: 'Mid-Year Growth & Coaching Review', nameTh: 'การทบทวนความก้าวหน้าและการโค้ชชิ่งกลางปี' },
    ],
  },

  // 16. General Competency Assessment
  {
    key: 'general_competency',
    name: 'General Competency & Soft Skills Assessment',
    nameTh: 'การประเมินสมรรถนะทั่วไปและการคิดเชิงวิพากษ์',
    description: 'Evaluation of foundational competencies: communication, emotional intelligence, agility, and critical thinking.',
    subcategories: [
      { key: 'critical_thinking_logic', name: 'Critical Thinking & Logical Reasoning', nameTh: 'การคิดเชิงวิพากษ์และการใช้ตรรกะ' },
      { key: 'emotional_intelligence_eq', name: 'Emotional Intelligence & Stress Resilience', nameTh: 'ความฉลาดทางอารมณ์และการรับมือความกดดัน' },
      { key: 'ethical_integrity_assessment', name: 'Ethical Integrity & Moral Fortitude', nameTh: 'การประเมินความซื่อสัตย์สุจริตและจริยธรรม' },
    ],
  },
];

export const SEED_INTERVIEW_FORMATS: SeedInterviewFormat[] = [
  { key: 'structured', name: 'Structured Interview', nameTh: 'การสัมภาษณ์แบบมีโครงสร้างแบบแผน', description: 'Standardized questions asked in identical sequence with predetermined evaluation rubrics.' },
  { key: 'semi_structured', name: 'Semi-Structured Interview', nameTh: 'การสัมภาษณ์แบบกึ่งมีโครงสร้าง', description: 'Core question framework combined with dynamic probing based on candidate answers.' },
  { key: 'unstructured', name: 'Unstructured Interview', nameTh: 'การสัมภาษณ์แบบเปิดเชิงสนทนา', description: 'Conversational, organic interview format focusing on narrative self-presentation.' },
  { key: 'behavioral', name: 'Behavioral Interview (STAR)', nameTh: 'การสัมภาษณ์อิงพฤติกรรม (STAR)', description: 'Evaluates past behaviors as predictors of future performance using Situation, Task, Action, Result.' },
  { key: 'technical', name: 'Technical Interview', nameTh: 'การสัมภาษณ์เชิงเทคนิคและระบบ', description: 'Deep probe into specialized technical domain knowledge, architecture, and live problem solving.' },
  { key: 'competency_based', name: 'Competency-Based Interview', nameTh: 'การสัมภาษณ์อิงกรอบสมรรถนะ', description: 'Measures candidates against institutional core competencies, values, and behavioral indicators.' },
  { key: 'situational', name: 'Situational Judgment Interview', nameTh: 'การสัมภาษณ์เชิงสถานการณ์สมมติ', description: 'Presents hypothetical operational scenarios to evaluate judgment and decision-making.' },
  { key: 'case_interview', name: 'Case Interview', nameTh: 'การสัมภาษณ์วิเคราะห์กรณีศึกษาธุรกิจ', description: 'Live business or operational problem solving evaluating framework decomposition and quantitative estimation.' },
  { key: 'panel_interview', name: 'Panel Interview', nameTh: 'การสัมภาษณ์โดยคณะกรรมการหลายฝ่าย', description: 'Single candidate interviewed concurrently by a multi-disciplinary panel of evaluators.' },
  { key: 'group_interview', name: 'Group Interview', nameTh: 'การสัมภาษณ์แบบกลุ่มผู้สมัคร', description: 'Multiple candidates assessed simultaneously in group dynamics, negotiation, and teamwork.' },
  { key: 'stress_interview', name: 'Stress Interview', nameTh: 'การสัมภาษณ์แบบจำลองความกดดันสูง', description: 'Tests emotional resilience, poise, and composure under aggressive questioning or tight constraints.' },
  { key: 'portfolio_based', name: 'Portfolio-Based Interview', nameTh: 'การสัมภาษณ์อิงแฟ้มสะสมผลงานจริง', description: 'Detailed interrogation of candidate submitted projects, designs, codebases, or publications.' },
  { key: 'presentation_based', name: 'Presentation-Based Interview', nameTh: 'การสัมภาษณ์แบบนำเสนอโครงการ', description: 'Candidate delivers a formal slide or case presentation followed by Q&A defense from reviewers.' },
  { key: 'problem_solving', name: 'Live Problem-Solving Interview', nameTh: 'การสัมภาษณ์การแก้ปัญหาเฉพาะหน้า', description: 'Tests real-time intellectual agility and root cause deduction on unfamiliar challenges.' },
  { key: 'oral_exam', name: 'Oral Examination (Viva Voce)', nameTh: 'การสอบปากเปล่าทางวิชาการ', description: 'Rigorous scholarly interrogation defending research validity, methodology, and theoretical mastery.' },
];

export const SEED_SENIORITY_LEVELS: SeedSeniority[] = [
  // 1. Career Track (Professionals)
  { category: 'career', key: 'career_student', name: 'Student / Trainee', nameTh: 'นักศึกษา / ไม่มีประสบการณ์การทำงาน', minYearsExp: 0, maxYearsExp: 0 },
  { category: 'career', key: 'career_entry', name: 'Entry Level (0–2 Years)', nameTh: 'ระดับเริ่มต้น (0–2 ปี)', minYearsExp: 0, maxYearsExp: 2 },
  { category: 'career', key: 'career_junior', name: 'Junior (1–3 Years)', nameTh: 'ระดับปฏิบัติการเบื้องต้น (1–3 ปี)', minYearsExp: 1, maxYearsExp: 3 },
  { category: 'career', key: 'career_mid', name: 'Mid-level (3–5 Years)', nameTh: 'ระดับกลาง (3–5 ปี)', minYearsExp: 3, maxYearsExp: 5 },
  { category: 'career', key: 'career_senior', name: 'Senior (5–8 Years)', nameTh: 'ระดับอาวุโส (5–8 ปี)', minYearsExp: 5, maxYearsExp: 8 },
  { category: 'career', key: 'career_lead', name: 'Lead / Principal (8+ Years)', nameTh: 'ระดับหัวหน้าทีม / ผู้เชี่ยวชาญหลัก (8+ ปี)', minYearsExp: 8, maxYearsExp: 25 },
  { category: 'career', key: 'career_manager', name: 'Manager / Department Head', nameTh: 'ผู้จัดการฝ่าย / ผู้บริหารระดับกลาง', minYearsExp: 6, maxYearsExp: 30 },
  { category: 'career', key: 'career_executive', name: 'Director / Executive (C-Level)', nameTh: 'ผู้อำนวยการ / ผู้บริหารระดับสูง (C-Suite)', minYearsExp: 10, maxYearsExp: 40 },
  { category: 'career', key: 'career_changer', name: 'Career Changer / Transitioner', nameTh: 'ผู้เปลี่ยนสายงานข้ามอุตสาหกรรม', minYearsExp: 1, maxYearsExp: 10 },
  { category: 'career', key: 'career_specialist', name: 'Deep Domain Specialist', nameTh: 'ผู้เชี่ยวชาญเฉพาะทางระดับสูง', minYearsExp: 6, maxYearsExp: 25 },
  { category: 'career', key: 'career_entrepreneur', name: 'Entrepreneur / Founder', nameTh: 'ผู้ประกอบการ / ผู้ก่อตั้งสตาร์ทอัพ', minYearsExp: 2, maxYearsExp: 20 },

  // 2. Academic & Research Track
  { category: 'academic', key: 'acad_highschool', name: 'High School Student', nameTh: 'นักเรียนระดับมัธยมศึกษาตอนปลาย', minYearsExp: 0, maxYearsExp: 0 },
  { category: 'academic', key: 'acad_undergrad', name: 'Undergraduate Student', nameTh: 'นิสิต / นักศึกษาระดับปริญญาตรี', minYearsExp: 0, maxYearsExp: 0 },
  { category: 'academic', key: 'acad_freshgrad', name: 'Fresh Graduate', nameTh: 'บัณฑิตจบใหม่ (0–1 ปี)', minYearsExp: 0, maxYearsExp: 1 },
  { category: 'academic', key: 'acad_grad', name: 'Graduate Student', nameTh: 'นักศึกษาระดับบัณฑิตศึกษา', minYearsExp: 0, maxYearsExp: 2 },
  { category: 'academic', key: 'acad_master', name: "Master's Applicant / Candidate", nameTh: 'ผู้สมัคร / ผู้ศึกษาระดับปริญญาโท', minYearsExp: 0, maxYearsExp: 3 },
  { category: 'academic', key: 'acad_phd', name: 'PhD Applicant / Candidate', nameTh: 'ผู้สมัคร / ผู้ศึกษาระดับปริญญาเอก', minYearsExp: 1, maxYearsExp: 6 },
  { category: 'academic', key: 'acad_researcher', name: 'Academic Researcher', nameTh: 'นักวิจัยประจำสถาบันการศึกษา', minYearsExp: 3, maxYearsExp: 15 },
  { category: 'academic', key: 'acad_res_assistant', name: 'Research Assistant', nameTh: 'ผู้ช่วยนักวิจัยในโครงการ', minYearsExp: 0, maxYearsExp: 3 },
  { category: 'academic', key: 'acad_postdoc', name: 'Postdoctoral Fellow', nameTh: 'นักวิจัยหลังปริญญาเอก', minYearsExp: 4, maxYearsExp: 20 },
  { category: 'academic', key: 'acad_pi', name: 'Principal Investigator (PI)', nameTh: 'หัวหน้าโครงการวิจัยหลักประจำสถาบัน', minYearsExp: 8, maxYearsExp: 35 },

  // 3. Scholarship & International Track
  { category: 'scholarship', key: 'scholarship_applicant', name: 'Scholarship Applicant', nameTh: 'ผู้สมัครรับทุนการศึกษา', minYearsExp: 0, maxYearsExp: 5 },
  { category: 'scholarship', key: 'international_applicant', name: 'International Applicant / Fellow', nameTh: 'ผู้สมัครระดับนานาชาติ', minYearsExp: 0, maxYearsExp: 8 },

  // 4. Healthcare Licensed Track
  { category: 'healthcare_licensed', key: 'hl_trainee', name: 'Student / Clinical Trainee', nameTh: 'นักศึกษาฝึกงาน / นักศึกษาแพทย์-พยาบาล', minYearsExp: 0, maxYearsExp: 0 },
  { category: 'healthcare_licensed', key: 'hl_intern', name: 'Intern / Clinical Resident', nameTh: 'แพทย์ประจำบ้าน / ผู้ฝึกหัดวิชาชีพ', minYearsExp: 1, maxYearsExp: 3 },
  { category: 'healthcare_licensed', key: 'hl_licensed', name: 'Licensed Practitioner', nameTh: 'ผู้ประกอบวิชาชีพมีใบอนุญาต', minYearsExp: 2, maxYearsExp: 6 },
  { category: 'healthcare_licensed', key: 'hl_experienced', name: 'Experienced Specialist', nameTh: 'ผู้ประกอบวิชาชีพชำนาญการ', minYearsExp: 5, maxYearsExp: 10 },
  { category: 'healthcare_licensed', key: 'hl_specialist', name: 'Senior Fellow / Consultant', nameTh: 'แพทย์เฉพาะทางระดับสูง / ผู้เชี่ยวชาญพิเศษ', minYearsExp: 8, maxYearsExp: 20 },
  { category: 'healthcare_licensed', key: 'hl_dept_head', name: 'Department Head / Chief of Service', nameTh: 'หัวหน้าภาควิชา / ผู้อำนวยการศูนย์การแพทย์', minYearsExp: 12, maxYearsExp: 35 },
];

export const SEED_SKILL_CATEGORIES: SeedSkillCategory[] = [
  // 1. Technical Skills
  {
    key: 'technical',
    name: 'Technical Skills',
    nameTh: 'ทักษะเชิงเทคนิคและการพัฒนาระบบ',
    skills: [
      { name: 'TypeScript & JavaScript', nameTh: 'การเขียนโปรแกรม TypeScript และ JavaScript' },
      { name: 'Python & Data Analysis', nameTh: 'การเขียนโปรแกรม Python และการวิเคราะห์ข้อมูล' },
      { name: 'NestJS & Node.js', nameTh: 'การสร้าง Backend ด้วย NestJS' },
      { name: 'React & Next.js App Router', nameTh: 'การพัฒนาฟรอนต์เอนด์ Next.js' },
      { name: 'PostgreSQL & SQL Performance Tuning', nameTh: 'การออกแบบและปรับแต่งฐานข้อมูลเชิงสัมพันธ์' },
      { name: 'Docker & Microservices Architecture', nameTh: 'การบรรจุคอนเทนเนอร์และสถาปัตยกรรมไมโครเซอร์วิส' },
      { name: 'Kubernetes Orchestration', nameTh: 'การจัดการระบบคอนเทนเนอร์ขนาดใหญ่' },
      { name: 'Generative AI & LLM Prompting', nameTh: 'การพัฒนาปัญญาประดิษฐ์เชิงสร้างสรรค์และ LLM' },
    ],
  },

  // 2. Domain Knowledge
  {
    key: 'domain_knowledge',
    name: 'Domain Knowledge',
    nameTh: 'ความรู้เชิงลึกเฉพาะสาขาวิชาชีพ',
    skills: [
      { name: 'FinTech & Payment Regulations', nameTh: 'กฎระเบียบการเงินดิจิทัลและระบบชำระเงิน' },
      { name: 'Healthcare Compliance (HA / JCI)', nameTh: 'มาตรฐานการรับรองคุณภาพสถานพยาบาล' },
      { name: 'Commercial Contracts & PDPA Compliance', nameTh: 'สัญญาพาณิชย์และการคุ้มครองข้อมูลส่วนบุคคล' },
      { name: 'Renewable Energy & BESS Engineering', nameTh: 'วิศวกรรมพลังงานหมุนเวียนและระบบกักเก็บพลังงาน' },
      { name: 'Precision Agriculture & Agronomy', nameTh: 'การเกษตรแม่นยำและปฐพีวิทยา' },
      { name: 'Supply Chain & Cold Logistics', nameTh: 'การจัดการห่วงโซ่อุปทานและการขนส่งควบคุมอุณหภูมิ' },
    ],
  },

  // 3. Analytical Skills
  {
    key: 'analytical',
    name: 'Analytical Skills',
    nameTh: 'ทักษะการวิเคราะห์ข้อมูลและระบบ',
    skills: [
      { name: 'Quantitative Data Analysis', nameTh: 'การวิเคราะห์ข้อมูลเชิงปริมาณ' },
      { name: 'Root Cause Failure Analysis', nameTh: 'การวิเคราะห์หาสาเหตุที่แท้จริงของปัญหา' },
      { name: 'Financial DCF Modeling', nameTh: 'การสร้างแบบจำลองการเงินและคิดลดกระแสเงินสด' },
      { name: 'Risk Quantification & Stress Testing', nameTh: 'การวัดค่าความเสี่ยงและการจำลองภาวะวิกฤต' },
    ],
  },

  // 4. Critical Thinking
  {
    key: 'critical_thinking',
    name: 'Critical Thinking',
    nameTh: 'การคิดเชิงวิพากษ์และการใช้ตรรกะ',
    skills: [
      { name: 'First-Principles Reasoning', nameTh: 'การคิดจากข้อเท็จจริงพื้นฐาน' },
      { name: 'Cognitive Bias Detection', nameTh: 'การตรวจจับอคติในการตัดสินใจ' },
      { name: 'Hypothesis Validation', nameTh: 'การตั้งและทดสอบสมมติฐานเชิงประจักษ์' },
    ],
  },

  // 5. Problem Solving
  {
    key: 'problem_solving',
    name: 'Problem Solving',
    nameTh: 'การแก้ปัญหาซับซ้อนและการบริหารวิกฤต',
    skills: [
      { name: 'STAR Method Structural Delivery', nameTh: 'การแก้ปัญหาและสื่อสารตามโครงสร้าง STAR' },
      { name: 'Crisis Triage & Mitigation', nameTh: 'การจัดลำดับความสำคัญและการบรรเทาความเสียหายฉุกเฉิน' },
      { name: 'Lean Six Sigma (DMAIC)', nameTh: 'การแก้ปัญหาแบบลีนซิกส์ซิกมา' },
    ],
  },

  // 6. Communication
  {
    key: 'communication',
    name: 'Communication Skills',
    nameTh: 'ทักษะการสื่อสารและการนำเสนอ',
    skills: [
      { name: 'Executive Presentation Delivery', nameTh: 'การนำเสนอเชิงกลยุทธ์ต่อผู้บริหารระดับสูง' },
      { name: 'Active Listening & Empathy', nameTh: 'การฟังเชิงรุกและการเข้าใจความรู้สึก' },
      { name: 'Cross-Disciplinary Translation', nameTh: 'การสื่อสารเรื่องเทคนิคให้ผู้มีส่วนได้ส่วนเสียเข้าใจง่าย' },
    ],
  },

  // 7. Leadership
  {
    key: 'leadership',
    name: 'Leadership & Vision',
    nameTh: 'ภาวะผู้นำและวิสัยทัศน์เชิงกลยุทธ์',
    skills: [
      { name: 'Strategic Vision & Roadmapping', nameTh: 'วิสัยทัศน์เชิงกลยุทธ์และการจัดทำแผนที่งาน' },
      { name: 'Team Mentoring & Talent Growth', nameTh: 'การสอนงานและพัฒนาบุคลากรสู่ผู้นำรุ่นต่อไป' },
      { name: 'Psychological Safety Cultivation', nameTh: 'การสร้างวัฒนธรรมความปลอดภัยทางจิตวิทยาในทีม' },
    ],
  },

  // 8. Teamwork
  {
    key: 'teamwork',
    name: 'Teamwork & Collaboration',
    nameTh: 'การทำงานร่วมกันเป็นทีมข้ามสายงาน',
    skills: [
      { name: 'Cross-Functional Team Collaboration', nameTh: 'การประสานงานทีมข้ามสายงาน' },
      { name: 'Conflict Mediation', nameTh: 'การไกล่เกลี่ยข้อพิพาทในทีม' },
      { name: 'Collaborative Governance', nameTh: 'การกำกับดูแลงานร่วมกัน' },
    ],
  },

  // 9. Research Skills
  {
    key: 'research',
    name: 'Research Skills',
    nameTh: 'ระเบียบวิธีวิจัยและวิชาการ',
    skills: [
      { name: 'Quantitative Statistical Analysis (SPSS / R / Python)', nameTh: 'การวิเคราะห์สถิติขั้นสูง' },
      { name: 'Qualitative Interview Coding & Thematic Analysis', nameTh: 'การวิเคราะห์เนื้อหาเชิงคุณภาพ' },
      { name: 'Grant Proposal Writing', nameTh: 'การเขียนโครงร่างข้อเสนอขอทุนวิจัย' },
      { name: 'Peer-Reviewed Scholarly Publication', nameTh: 'การตีพิมพ์บทความวิชาการในวารสารนานาชาติ' },
      { name: 'Research Defense & Methodology Scrutiny', nameTh: 'การสอบป้องกันระเบียบวิธีวิจัย' },
    ],
  },

  // 10. Creative Skills
  {
    key: 'creative',
    name: 'Creative & Innovation Skills',
    nameTh: 'ความคิดสร้างสรรค์และนวัตกรรม',
    skills: [
      { name: 'Design Thinking (IDEO Framework)', nameTh: 'กระบวนการคิดเชิงออกแบบ' },
      { name: 'Brand Storytelling & Narrative', nameTh: 'การเล่าเรื่องเพื่อสร้างอัตลักษณ์แบรนด์' },
      { name: 'Creative Conceptualization', nameTh: 'การพัฒนาแนวคิดเชิงสร้างสรรค์' },
    ],
  },

  // 11. Language Skills
  {
    key: 'languages',
    name: 'Language & Multilingual Skills',
    nameTh: 'ทักษะทางภาษาและการสื่อสารสากล',
    skills: [
      { name: 'Professional English (CEFR C1/C2 / IELTS 8.0)', nameTh: 'ภาษาอังกฤษระดับมืออาชีพ' },
      { name: 'Native / Bilingual Thai Fluency', nameTh: 'ภาษาไทยระดับเจ้าของภาษาและทวิภาษา' },
      { name: 'Business Mandarin Chinese (HSK 5/6)', nameTh: 'ภาษาจีนเพื่อการสื่อสารทางธุรกิจ' },
      { name: 'Business Japanese (JLPT N2/N1)', nameTh: 'ภาษาญี่ปุ่นเพื่อธุรกิจ' },
    ],
  },

  // 12. Interpersonal Skills
  {
    key: 'interpersonal',
    name: 'Interpersonal & Emotional Intelligence',
    nameTh: 'ทักษะความสัมพันธ์ระหว่างบุคคลและความฉลาดทางอารมณ์',
    skills: [
      { name: 'Empathetic Client Relations', nameTh: 'การสร้างความสัมพันธ์กับลูกค้าด้วยความเข้าใจ' },
      { name: 'Diplomatic Tact Under Pressure', nameTh: 'การเจรจาด้วยความประนีประนอมในสถานการณ์ตึงเครียด' },
      { name: 'Intercultural Sensitivity', nameTh: 'ความเข้าใจและความเคารพในความหลากหลายทางวัฒนธรรม' },
    ],
  },

  // 13. Professional Ethics
  {
    key: 'professional_ethics',
    name: 'Professional Ethics & Integrity',
    nameTh: 'จริยธรรมวิชาชีพและความซื่อสัตย์สุจริต',
    skills: [
      { name: 'Ethical Fortitude in Conflict', nameTh: 'การยืนหยัดในหลักจริยธรรมเมื่อเกิดความขัดแย้ง' },
      { name: 'Anti-Corruption & Statutory Governance', nameTh: 'การต่อต้านการทุจริตและการกำกับดูแลตามกฎหมาย' },
      { name: 'Fiduciary Duty & Accountability', nameTh: 'ความรับผิดชอบในหน้าที่ผู้ไว้วางใจ' },
    ],
  },

  // 14. Digital Literacy
  {
    key: 'digital_literacy',
    name: 'Digital Literacy & Modern Tools',
    nameTh: 'การรู้เท่าทันดิจิทัลและเครื่องมือสมัยใหม่',
    skills: [
      { name: 'Figma & Design Systems at Scale', nameTh: 'การใช้ Figma และระบบออกแบบระดับองค์กร' },
      { name: 'Enterprise ERP (SAP / NetSuite)', nameTh: 'การใช้งานระบบ ERP ระดับองค์กร' },
      { name: 'Business Intelligence (Power BI / Tableau)', nameTh: 'การใช้งานเครื่องมือ BI สร้างแดชบอร์ด' },
      { name: 'Agile Project Tracking (Jira / Linear)', nameTh: 'การบริหารงานด้วยเครื่องมือ Agile' },
    ],
  },

  // 15. Management Skills
  {
    key: 'management',
    name: 'Management & Strategic Execution',
    nameTh: 'ทักษะการบริหารจัดการและการส่งมอบงาน',
    skills: [
      { name: 'PMP Project Scheduling & Risk Management', nameTh: 'การวางแผนโครงการและบริหารความเสี่ยงตามแนวทาง PMP' },
      { name: 'Budgeting & P&L Accountability', nameTh: 'การบริหารงบประมาณและการควบคุมกำไรขาดทุน' },
      { name: 'Change Management & Stakeholder Buy-in', nameTh: 'การบริหารการเปลี่ยนแปลงและการสร้างการยอมรับ' },
    ],
  },
];

/**
 * Cross-Industry Many-to-Many Associations
 * Defines professions that belong to multiple industries beyond their primary industry.
 */
export const SEED_CROSS_INDUSTRY_MAPPINGS: { professionKey: string; industryKeys: string[] }[] = [
  { professionKey: 'software_engineer', industryKeys: ['tech', 'finance', 'engineering', 'healthcare'] },
  { professionKey: 'data_scientist', industryKeys: ['tech', 'finance', 'healthcare', 'science_research', 'business'] },
  { professionKey: 'ai_engineer', industryKeys: ['tech', 'healthcare', 'finance', 'science_research'] },
  { professionKey: 'cybersecurity_engineer', industryKeys: ['tech', 'finance', 'legal', 'healthcare'] },
  { professionKey: 'financial_analyst', industryKeys: ['finance', 'business', 'tech'] },
  { professionKey: 'auditor', industryKeys: ['finance', 'legal', 'business'] },
  { professionKey: 'compliance_officer', industryKeys: ['legal', 'finance', 'healthcare'] },
  { professionKey: 'business_analyst', industryKeys: ['business', 'tech', 'finance'] },
  { professionKey: 'product_manager', industryKeys: ['tech', 'business', 'finance', 'design'] },
  { professionKey: 'it_project_manager', industryKeys: ['tech', 'business', 'engineering'] },
  { professionKey: 'project_engineer', industryKeys: ['engineering', 'architecture', 'environment', 'business'] },
  { professionKey: 'academic_researcher', industryKeys: ['education', 'science_research', 'healthcare'] },
  { professionKey: 'medical_researcher', industryKeys: ['healthcare', 'science_research', 'education'] },
  { professionKey: 'public_health_specialist', industryKeys: ['healthcare', 'social_nonprofit', 'science_research'] },
  { professionKey: 'environmental_specialist', industryKeys: ['environment', 'agriculture', 'social_nonprofit', 'engineering'] },
  { professionKey: 'automation_engineer', industryKeys: ['engineering', 'agriculture', 'logistics', 'tech'] },
  { professionKey: 'supply_chain_analyst', industryKeys: ['logistics', 'business', 'agriculture', 'finance'] },
  { professionKey: 'logistics_manager', industryKeys: ['logistics', 'business', 'agriculture'] },
  { professionKey: 'esg_sustainability_officer', industryKeys: ['social_nonprofit', 'environment', 'business', 'finance'] },
  { professionKey: 'renewable_energy_engineer', industryKeys: ['environment', 'engineering', 'science_research'] },
];

/**
 * Interview Category to Interview Format Many-to-Many Mappings
 */
export const SEED_CONTEXT_FORMAT_MAPPINGS: { categoryKey: string; formatKeys: string[] }[] = [
  {
    categoryKey: 'job',
    formatKeys: ['structured', 'semi_structured', 'behavioral', 'technical', 'situational', 'panel', 'competency_based'],
  },
  {
    categoryKey: 'scholarship',
    formatKeys: ['competency_based', 'panel', 'behavioral', 'presentation_based', 'structured'],
  },
  {
    categoryKey: 'university_admission',
    formatKeys: ['structured', 'semi_structured', 'behavioral', 'situational'],
  },
  {
    categoryKey: 'graduate_admission',
    formatKeys: ['semi_structured', 'panel', 'presentation_based', 'competency_based'],
  },
  {
    categoryKey: 'internship',
    formatKeys: ['behavioral', 'structured', 'competency_based', 'situational'],
  },
  {
    categoryKey: 'student_exchange',
    formatKeys: ['semi_structured', 'behavioral', 'situational', 'group'],
  },
  {
    categoryKey: 'fellowship',
    formatKeys: ['panel', 'presentation_based', 'competency_based', 'technical'],
  },
  {
    categoryKey: 'research_position',
    formatKeys: ['technical', 'panel', 'presentation_based', 'oral_defense'],
  },
  {
    categoryKey: 'research_proposal_defense',
    formatKeys: ['presentation_based', 'panel', 'oral_defense', 'problem_solving'],
  },
  {
    categoryKey: 'thesis_defense',
    formatKeys: ['oral_defense', 'presentation_based', 'panel'],
  },
  {
    categoryKey: 'dissertation_defense',
    formatKeys: ['oral_defense', 'presentation_based', 'panel', 'stress'],
  },
  {
    categoryKey: 'professional_certification',
    formatKeys: ['technical', 'case', 'problem_solving', 'structured'],
  },
  {
    categoryKey: 'career_promotion',
    formatKeys: ['behavioral', 'leadership_assessment', 'panel', 'presentation_based'],
  },
  {
    categoryKey: 'leadership_assessment',
    formatKeys: ['situational', 'case', 'stress', 'panel', 'presentation_based'],
  },
  {
    categoryKey: 'performance_evaluation',
    formatKeys: ['structured', 'competency_based', 'semi_structured'],
  },
  {
    categoryKey: 'general_competency',
    formatKeys: ['competency_based', 'behavioral', 'situational', 'structured'],
  },
];
