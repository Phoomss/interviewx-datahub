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

export interface SeedSeniority {
  category: 'career' | 'academic' | 'healthcare_licensed';
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
  {
    key: 'tech',
    name: 'Technology & IT',
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
      { key: 'cybersecurity_engineer', name: 'Cybersecurity Engineer', nameTh: 'วิศวกรความมั่นคงปลอดภัยไซเบอร์', description: 'Protects enterprise systems against cyber threats and vulnerabilities.', suggestedSkills: ['Penetration Testing', 'SIEM', 'Network Security', 'OWASP Top 10', 'ISO 27001'] },
      { key: 'cloud_engineer', name: 'Cloud Engineer', nameTh: 'วิศวกรคลาวด์', description: 'Provisions and monitors resilient multi-cloud architectures.', suggestedSkills: ['AWS', 'Google Cloud', 'Terraform', 'Kubernetes', 'Cloud Security'] },
      { key: 'devops_engineer', name: 'DevOps Engineer', nameTh: 'วิศวกรเดฟออปส์', description: 'Automates deployment pipelines and ensures infrastructure reliability.', suggestedSkills: ['CI/CD Pipelines', 'Docker', 'Kubernetes', 'Prometheus', 'Linux Administration'] },
      { key: 'system_administrator', name: 'System Administrator', nameTh: 'ผู้ดูแลระบบคอมพิวเตอร์', description: 'Maintains enterprise servers, networks, and IT services.', suggestedSkills: ['Linux/Unix', 'Active Directory', 'Network Protocols', 'Virtualization', 'Bash'] },
      { key: 'ui_ux_designer', name: 'UI/UX Designer', nameTh: 'นักออกแบบส่วนประสานและประสบการณ์ผู้ใช้', description: 'Conducts user research and crafts user interfaces and experiences.', suggestedSkills: ['Figma', 'Wireframing', 'User Testing', 'Design Systems', 'Interaction Design'] },
      { key: 'product_manager', name: 'Product Manager', nameTh: 'ผู้จัดการผลิตภัณฑ์', description: 'Defines product roadmaps, user personas, and feature priorities.', suggestedSkills: ['Product Strategy', 'Agile/Scrum', 'Data-driven Decisions', 'Stakeholder Management', 'User Stories'] },
      { key: 'it_project_manager', name: 'IT Project Manager', nameTh: 'ผู้จัดการโครงการไอที', description: 'Orchestrates technology projects on budget and on schedule.', suggestedSkills: ['PMP Methodologies', 'Scrum', 'Risk Management', 'Jira', 'Resource Planning'] },
      { key: 'software_architect', name: 'Software Architect', nameTh: 'สถาปนิกซอฟต์แวร์', description: 'Designs high-level software system architecture and patterns.', suggestedSkills: ['Distributed Systems', 'Domain-Driven Design', 'Event-Driven Architecture', 'Cloud Patterns'] },
    ],
  },
  {
    key: 'business',
    name: 'Business & Management',
    nameTh: 'ธุรกิจและการจัดการ',
    description: 'Corporate strategy, operations, business development, HR, and marketing.',
    icon: 'Briefcase',
    professions: [
      { key: 'business_analyst', name: 'Business Analyst', nameTh: 'นักวิเคราะห์ธุรกิจ', description: 'Bridges business requirements with technology solutions.', suggestedSkills: ['Requirement Elicitation', 'BPMN', 'Gap Analysis', 'Data Analysis', 'Agile BA'] },
      { key: 'business_development_executive', name: 'Business Development Executive', nameTh: 'เจ้าหน้าที่พัฒนาธุรกิจ', description: 'Expands client partnerships and identifies new commercial opportunities.', suggestedSkills: ['B2B Sales', 'Partnership Structuring', 'Pitching', 'Market Research'] },
      { key: 'marketing_manager', name: 'Marketing Manager', nameTh: 'ผู้จัดการฝ่ายการตลาด', description: 'Leads multichannel marketing campaigns and brand positioning.', suggestedSkills: ['Brand Strategy', 'Campaign Planning', 'Market Segmentation', 'Customer Lifetime Value'] },
      { key: 'digital_marketing_specialist', name: 'Digital Marketing Specialist', nameTh: 'ผู้เชี่ยวชาญการตลาดดิจิทัล', description: 'Executes paid ads, SEO, and social media growth strategies.', suggestedSkills: ['SEO/SEM', 'Google Analytics', 'Meta Ads', 'Conversion Rate Optimization'] },
      { key: 'sales_executive', name: 'Sales Executive', nameTh: 'เจ้าหน้าที่ฝ่ายขาย', description: 'Generates leads and closes revenue deals.', suggestedSkills: ['Pipeline Management', 'Consultative Selling', 'CRM', 'Negotiation', 'Closing Deals'] },
      { key: 'account_manager', name: 'Account Manager', nameTh: 'ผู้จัดการฝ่ายดูแลลูกค้า', description: 'Nurtures key accounts and ensures customer retention.', suggestedSkills: ['Key Account Management', 'Client Retention', 'Upselling', 'Contract Negotiation'] },
      { key: 'human_resource_officer', name: 'Human Resource Officer', nameTh: 'เจ้าหน้าที่ฝ่ายบุคคล', description: 'Manages employee onboarding, benefits, and labor relations.', suggestedSkills: ['HR Administration', 'Labor Law', 'Recruitment', 'Employee Relations'] },
      { key: 'hr_business_partner', name: 'HR Business Partner', nameTh: 'ที่ปรึกษาพันธมิตรธุรกิจฝ่ายบุคคล', description: 'Aligns business goals with people strategies and talent development.', suggestedSkills: ['Strategic HR', 'Talent Management', 'Succession Planning', 'Organizational Design'] },
      { key: 'project_manager', name: 'Project Manager', nameTh: 'ผู้จัดการโครงการ', description: 'Drives execution of multi-departmental business initiatives.', suggestedSkills: ['Project Scheduling', 'Budget Control', 'Risk Mitigation', 'Cross-functional Leadership'] },
      { key: 'operations_manager', name: 'Operations Manager', nameTh: 'ผู้จัดการฝ่ายปฏิบัติการ', description: 'Optimizes business processes, supply logistics, and operational efficiency.', suggestedSkills: ['Process Optimization', 'Lean Six Sigma', 'Cost Control', 'Vendor Management'] },
      { key: 'business_consultant', name: 'Business Consultant', nameTh: 'ที่ปรึกษาทางธุรกิจ', description: 'Advises executives on corporate strategy and transformation.', suggestedSkills: ['Strategic Frameworks', 'Financial Modeling', 'Change Management', 'Problem Solving'] },
      { key: 'financial_analyst_biz', name: 'Financial Analyst (Corporate)', nameTh: 'นักวิเคราะห์การเงินองค์กร', description: 'Performs corporate budgeting, forecasting, and profitability modeling.', suggestedSkills: ['Financial Modeling', 'DCF Valuation', 'Budgeting & Forecasting', 'Excel Power Query'] },
      { key: 'bi_analyst', name: 'Business Intelligence Analyst', nameTh: 'นักวิเคราะห์ระบบธุรกิจอัจฉริยะ', description: 'Creates executive KPIs and automated executive dashboards.', suggestedSkills: ['Power BI', 'DAX', 'SQL Data Warehouses', 'KPI Design', 'Data Visualization'] },
      { key: 'entrepreneur', name: 'Entrepreneur / Founder', nameTh: 'ผู้ประกอบการ / ผู้ก่อตั้งธุรกิจ', description: 'Builds ventures from inception to scale, leading capital raising and product market fit.', suggestedSkills: ['Venture Building', 'Fundraising', 'P&L Management', 'Pitching', 'Team Building'] },
    ],
  },
  {
    key: 'finance',
    name: 'Finance & Accounting',
    nameTh: 'การเงินและการบัญชี',
    description: 'Corporate accounting, financial planning, auditing, taxation, and investment analysis.',
    icon: 'DollarSign',
    professions: [
      { key: 'accountant', name: 'Accountant', nameTh: 'นักบัญชี', description: 'Maintains financial ledgers, balance sheets, and statutory reports.', suggestedSkills: ['IFRS / TFRS', 'General Ledger', 'SAP ERP', 'Tax Filing', 'Financial Statements'] },
      { key: 'financial_controller', name: 'Financial Controller', nameTh: 'ผู้อำนวยการฝ่ายการเงินและบัญชี', description: 'Oversees accounting operations, statutory compliance, and internal audits.', suggestedSkills: ['Internal Controls', 'Consolidation', 'Audit Readiness', 'Treasury Management'] },
      { key: 'auditor', name: 'Auditor', nameTh: 'ผู้ตรวจสอบบัญชี', description: 'Assesses financial statements, internal governance, and regulatory compliance.', suggestedSkills: ['Audit Standards', 'Risk Assessment', 'Substantive Testing', 'Sampling Methodology'] },
      { key: 'investment_analyst', name: 'Investment Analyst', nameTh: 'นักวิเคราะห์การลงทุน', description: 'Evaluates securities, portfolio allocations, and capital market trends.', suggestedSkills: ['Equity Research', 'Valuation Models', 'Macroeconomics', 'Portfolio Management'] },
      { key: 'banking_officer', name: 'Banking Officer', nameTh: 'เจ้าหน้าที่ธนาคารพาณิชย์', description: 'Provides credit underwriting, retail banking, and trade finance.', suggestedSkills: ['Credit Analysis', 'Know Your Customer (KYC)', 'Trade Finance', 'Underwriting'] },
      { key: 'financial_advisor', name: 'Financial Advisor', nameTh: 'ที่ปรึกษาทางการเงิน', description: 'Guides clients on wealth management, retirement, and asset allocation.', suggestedSkills: ['Wealth Planning', 'Retirement Planning', 'Insurance Products', 'Mutual Funds'] },
      { key: 'risk_analyst', name: 'Risk Analyst', nameTh: 'นักวิเคราะห์ความเสี่ยงทางการเงิน', description: 'Quantifies credit, market, and operational risk metrics.', suggestedSkills: ['Value at Risk (VaR)', 'Stress Testing', 'Basel III', 'Credit Scoring'] },
      { key: 'tax_consultant', name: 'Tax Consultant', nameTh: 'ที่ปรึกษาด้านภาษีอากร', description: 'Plans corporate tax strategies and manages tax dispute resolutions.', suggestedSkills: ['Corporate Tax', 'Transfer Pricing', 'VAT & Withholding Tax', 'Tax Treaties'] },
    ],
  },
  {
    key: 'engineering',
    name: 'Engineering & Industrial',
    nameTh: 'วิศวกรรมและอุตสาหกรรม',
    description: 'Mechanical, civil, electrical, chemical, and industrial manufacturing engineering.',
    icon: 'Cog',
    professions: [
      { key: 'mechanical_engineer', name: 'Mechanical Engineer', nameTh: 'วิศวกรเครื่องกล', description: 'Designs thermal, HVAC, and mechanical machinery systems.', suggestedSkills: ['SolidWorks', 'Thermodynamics', 'AutoCAD', 'Finite Element Analysis', 'HVAC Design'] },
      { key: 'electrical_engineer', name: 'Electrical Engineer', nameTh: 'วิศวกรไฟฟ้า', description: 'Designs power distribution, circuit boards, and electrical systems.', suggestedSkills: ['Circuit Design', 'PLC Programming', 'Power Systems', 'AutoCAD Electrical', 'MATLAB'] },
      { key: 'civil_engineer', name: 'Civil Engineer', nameTh: 'วิศวกรโยธา', description: 'Supervises infrastructure, structural concrete, and construction projects.', suggestedSkills: ['Structural Analysis', 'AutoCAD / Revit', 'Site Inspection', 'Quantity Surveying', 'Safety Standards'] },
      { key: 'industrial_engineer', name: 'Industrial Engineer', nameTh: 'วิศวกรอุตสาหการ', description: 'Improves assembly line ergonomics, factory layouts, and cycle times.', suggestedSkills: ['Lean Manufacturing', 'Time & Motion Study', 'Supply Chain Flow', 'Quality Management', 'Kaizen'] },
      { key: 'chemical_engineer', name: 'Chemical Engineer', nameTh: 'วิศวกรเคมี', description: 'Designs chemical synthesis processes, reactors, and refinery plants.', suggestedSkills: ['Process Simulation (Aspen)', 'Mass & Energy Balance', 'Process Safety Management', 'P&ID'] },
      { key: 'automation_engineer', name: 'Automation Engineer', nameTh: 'วิศวกรระบบอัตโนมัติ', description: 'Implements robotic arms, SCADA systems, and industrial IoT.', suggestedSkills: ['PLC (Siemens/Omron)', 'SCADA', 'Industrial Robotics', 'Sensors & Actuators'] },
      { key: 'qa_engineer_mfg', name: 'Quality Assurance Engineer (Industrial)', nameTh: 'วิศวกรประกันคุณภาพโรงงาน', description: 'Controls defect rates and manages ISO 9001 quality audits.', suggestedSkills: ['SPC (Statistical Process Control)', 'FMEA', 'ISO 9001 / IATF 16949', 'Root Cause Analysis'] },
      { key: 'production_engineer', name: 'Production Engineer', nameTh: 'วิศวกรฝ่ายผลิต', description: 'Coordinates shift output, machine uptime, and factory yield.', suggestedSkills: ['OEE Optimization', 'Line Balancing', 'Capacity Planning', 'Preventive Maintenance'] },
      { key: 'project_engineer', name: 'Project Engineer', nameTh: 'วิศวกรโครงการ', description: 'Manages engineering project milestones, procurement, and EPC contracts.', suggestedSkills: ['EPC Project Management', 'Vendor Technical Evaluation', 'Commissioning', 'Primavera / MS Project'] },
    ],
  },
  {
    key: 'healthcare',
    name: 'Healthcare & Medical',
    nameTh: 'การแพทย์และสาธารณสุข',
    description: 'Clinical medicine, nursing, pharmacy, physical therapy, and hospital administration.',
    icon: 'HeartPulse',
    professions: [
      { key: 'medical_doctor', name: 'Medical Doctor', nameTh: 'แพทย์เวชปฏิบัติ / แพทย์เฉพาะทาง', description: 'Diagnoses illnesses, prescribes medical treatments, and performs clinical care.', suggestedSkills: ['Clinical Diagnosis', 'Patient Care', 'Medical Ethics', 'Emergency Medicine', 'Pharmacology'] },
      { key: 'nurse', name: 'Registered Nurse', nameTh: 'พยาบาลวิชาชีพ', description: 'Administers patient care, medication, vital signs, and bedside assistance.', suggestedSkills: ['Triage & Bedside Care', 'IV Cannulation', 'Vital Signs Monitoring', 'Patient Advocacy', 'ICU Protocols'] },
      { key: 'pharmacist', name: 'Pharmacist', nameTh: 'เภสัชกร', description: 'Dispenses pharmaceuticals, reviews drug interactions, and counsels patients.', suggestedSkills: ['Drug Dispensing', 'Pharmacovigilance', 'Clinical Pharmacology', 'Good Pharmacy Practice (GPP)'] },
      { key: 'physical_therapist', name: 'Physical Therapist', nameTh: 'นักกายภาพบำบัด', description: 'Rehabilitates musculoskeletal, neurological, and post-surgery mobility.', suggestedSkills: ['Musculoskeletal Assessment', 'Rehabilitation Protocols', 'Manual Therapy', 'Exercise Prescription'] },
      { key: 'medical_technologist', name: 'Medical Technologist', nameTh: 'นักเทคนิคการแพทย์', description: 'Conducts laboratory blood analysis, microbiology, and clinical diagnostic testing.', suggestedSkills: ['Clinical Chemistry', 'Hematology', 'Microbiology', 'Laboratory Quality Control', 'PCR Analysis'] },
      { key: 'public_health_officer', name: 'Public Health Officer', nameTh: 'นักวิชาการสาธารณสุข', description: 'Implements disease prevention, epidemiology tracking, and community health.', suggestedSkills: ['Epidemiology', 'Health Education', 'Disease Surveillance', 'Community Health Planning'] },
      { key: 'healthcare_administrator', name: 'Healthcare Administrator', nameTh: 'ผู้บริหารงานโรงพยาบาลและสาธารณสุข', description: 'Oversees hospital operations, medical records, and accreditation compliance.', suggestedSkills: ['Hospital Accreditation (HA)', 'Healthcare Finance', 'Patient Flow Management', 'EMR Systems'] },
      { key: 'medical_researcher', name: 'Medical Researcher', nameTh: 'นักวิจัยทางการแพทย์', description: 'Conducts clinical trials, biomedical investigations, and epidemiological studies.', suggestedSkills: ['Clinical Trial Protocols', 'Biostatistics', 'GCP (Good Clinical Practice)', 'IRB Submission'] },
    ],
  },
  {
    key: 'education',
    name: 'Education & Academic',
    nameTh: 'การศึกษาและวิชาการ',
    description: 'School teaching, university lecturing, academic research, and educational administration.',
    icon: 'GraduationCap',
    professions: [
      { key: 'teacher', name: 'Teacher (K-12)', nameTh: 'ครูผู้สอนระดับการศึกษาขั้นพื้นฐาน', description: 'Educates primary and secondary students, developing curriculum and assessments.', suggestedSkills: ['Lesson Planning', 'Classroom Management', 'Differentiated Instruction', 'Pedagogy', 'Student Assessment'] },
      { key: 'lecturer', name: 'University Lecturer', nameTh: 'อาจารย์มหาวิทยาลัย', description: 'Delivers higher-education lectures, supervises theses, and conducts research.', suggestedSkills: ['Curriculum Design', 'Higher Education Pedagogy', 'Thesis Advising', 'Academic Publishing', 'Public Speaking'] },
      { key: 'research_assistant', name: 'Research Assistant', nameTh: 'ผู้ช่วยวิจัย', description: 'Supports academic lab experiments, literature reviews, and paper drafting.', suggestedSkills: ['Literature Review', 'Data Collection', 'Statistical Analysis', 'Lab Safety', 'Citation Management'] },
      { key: 'researcher', name: 'Academic Researcher', nameTh: 'นักวิจัยทางวิชาการ', description: 'Leads scholarly investigations, grant applications, and peer-reviewed publications.', suggestedSkills: ['Grant Writing', 'Research Methodology', 'Peer Review', 'Experimental Design', 'SPSS / R'] },
      { key: 'academic_officer', name: 'Academic Officer', nameTh: 'เจ้าหน้าที่ฝ่ายวิชาการ', description: 'Coordinates course schedules, accreditation, and student registry programs.', suggestedSkills: ['Academic Registry', 'Curriculum Standards', 'Student Information Systems', 'Educational Regulations'] },
      { key: 'educational_consultant', name: 'Educational Consultant', nameTh: 'ที่ปรึกษาด้านการศึกษา', description: 'Guides admissions, curriculum reform, and overseas study pathways.', suggestedSkills: ['Admissions Strategy', 'College Counseling', 'Curriculum Auditing', 'Standardized Test Prep'] },
      { key: 'school_administrator', name: 'School Administrator / Principal', nameTh: 'ผู้บริหารสถานศึกษา', description: 'Leads institutional governance, educational policy, and teacher mentoring.', suggestedSkills: ['Educational Leadership', 'Faculty Mentoring', 'School Budgeting', 'Community Engagement'] },
      { key: 'teaching_assistant', name: 'Teaching Assistant', nameTh: 'ผู้ช่วยสอน', description: 'Grades student assignments, holds office hours, and assists laboratory practicals.', suggestedSkills: ['Grading Rubrics', 'Recitation Facilitation', 'Student Mentoring', 'Educational Tech Tools'] },
    ],
  },
  {
    key: 'design_media',
    name: 'Design, Media & Communication',
    nameTh: 'การออกแบบ สื่อ และการสื่อสาร',
    description: 'Graphic design, digital media, journalism, videography, and public relations.',
    icon: 'Palette',
    professions: [
      { key: 'graphic_designer', name: 'Graphic Designer', nameTh: 'นักออกแบบกราฟิก', description: 'Creates visual concepts, corporate identity, and digital advertising assets.', suggestedSkills: ['Adobe Photoshop', 'Adobe Illustrator', 'Typography', 'Branding Design', 'Visual Hierarchy'] },
      { key: 'ux_ui_designer_creative', name: 'UX/UI Designer (Creative)', nameTh: 'นักออกแบบประสบการณ์ผู้ใช้เชิงสร้างสรรค์', description: 'Designs mobile and web app micro-interactions, wireframes, and prototypes.', suggestedSkills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Usability Testing'] },
      { key: 'content_creator', name: 'Content Creator', nameTh: 'นักสร้างสรรค์คอนเทนต์', description: 'Produces engaging multiplatform video, audio, and visual stories for social media.', suggestedSkills: ['Short-form Video Editing', 'Storyboarding', 'Social Media Trends', 'Community Engagement'] },
      { key: 'content_writer', name: 'Content Writer / Copywriter', nameTh: 'นักเขียนคอนเทนต์และก๊อปปี้ไรเตอร์', description: 'Writes compelling articles, SEO blog posts, and persuasive sales copy.', suggestedSkills: ['SEO Copywriting', 'Storytelling', 'Editorial Tone', 'Proofreading', 'Content Strategy'] },
      { key: 'video_editor', name: 'Video Editor', nameTh: 'นักตัดต่อวิดีโอ', description: 'Edits, colors, and mixes raw footage into polished commercial video content.', suggestedSkills: ['Premiere Pro', 'DaVinci Resolve', 'Sound Design', 'Color Grading', 'Motion Graphics'] },
      { key: 'photographer', name: 'Photographer', nameTh: 'ช่างภาพมืออาชีพ', description: 'Captures studio, commercial, event, and portrait photography.', suggestedSkills: ['Studio Lighting', 'Lightroom', 'Composition', 'Commercial Photography', 'Camera Optics'] },
      { key: 'journalist', name: 'Journalist', nameTh: 'นักข่าว / ผู้สื่อข่าว', description: 'Investigates news stories, conducts interviews, and writes objective reporting.', suggestedSkills: ['Investigative Reporting', 'Media Ethics', 'Interviewing Skills', 'Fact-checking', 'Breaking News'] },
      { key: 'pr_specialist', name: 'Public Relations Specialist', nameTh: 'ผู้เชี่ยวชาญด้านการประชาสัมพันธ์', description: 'Manages corporate reputation, press releases, and media outreach.', suggestedSkills: ['Press Release Writing', 'Media Relations', 'Crisis Communication', 'Media Monitoring'] },
      { key: 'creative_director', name: 'Creative Director', nameTh: 'ผู้อำนวยการฝ่ายสร้างสรรค์', description: 'Directs artistic vision for advertising campaigns and creative agency teams.', suggestedSkills: ['Creative Strategy', 'Campaign Conceptualization', 'Team Leadership', 'Client Pitching'] },
    ],
  },
  {
    key: 'legal_gov',
    name: 'Legal & Government',
    nameTh: 'กฎหมาย ภาครัฐ และนโยบาย',
    description: 'Corporate law, litigation, regulatory compliance, public policy, and diplomacy.',
    icon: 'Scale',
    professions: [
      { key: 'lawyer', name: 'Lawyer / Attorney', nameTh: 'ทนายความ', description: 'Represents clients in court litigation, arbitration, and legal dispute settlements.', suggestedSkills: ['Litigation', 'Legal Drafting', 'Court Advocacy', 'Negotiation', 'Civil & Commercial Law'] },
      { key: 'legal_officer', name: 'Legal Officer (In-house)', nameTh: 'นิติกร / เจ้าหน้าที่กฎหมายองค์กร', description: 'Drafts commercial contracts, assesses legal liability, and supports corporate compliance.', suggestedSkills: ['Contract Review', 'Corporate Law', 'Risk Mitigation', 'Legal Research'] },
      { key: 'compliance_officer', name: 'Compliance Officer', nameTh: 'เจ้าหน้าที่กำกับการปฏิบัติตามกฎเกณฑ์', description: 'Ensures business practices comply with industry regulations (AML, PDPA, SEC).', suggestedSkills: ['Regulatory Compliance', 'PDPA / GDPR', 'Anti-Money Laundering', 'Compliance Audits'] },
      { key: 'government_officer', name: 'Government Officer', nameTh: 'ข้าราชการ / เจ้าหน้าที่หน่วยงานรัฐ', description: 'Executes public programs, administers civic regulations, and serves citizens.', suggestedSkills: ['Public Administration', 'Official Document Drafting', 'Government Procurement', 'Public Policy Delivery'] },
      { key: 'policy_analyst', name: 'Policy Analyst', nameTh: 'นักวิเคราะห์นโยบายและแผน', description: 'Researches public policies, evaluates social impact, and proposes legislative reforms.', suggestedSkills: ['Policy Evaluation', 'Stakeholder Consultation', 'Cost-Benefit Analysis', 'Social Impact Assessment'] },
      { key: 'public_admin_officer', name: 'Public Administration Officer', nameTh: 'เจ้าหน้าที่บริหารงานทั่วไปภาครัฐ', description: 'Manages municipal budgets, civil services, and agency logistics.', suggestedSkills: ['Budget Allocation', 'Inter-agency Coordination', 'Civil Service Procedures', 'Public Service Delivery'] },
      { key: 'diplomatic_officer', name: 'Diplomatic Officer / Foreign Service', nameTh: 'นักการทูต / เจ้าหน้าที่การต่างประเทศ', description: 'Represents national interests in bilateral diplomacy, consular affairs, and treaties.', suggestedSkills: ['International Relations', 'Diplomatic Protocol', 'Cross-cultural Negotiation', 'Foreign Languages'] },
    ],
  },
  {
    key: 'hospitality',
    name: 'Hospitality & Service',
    nameTh: 'การบริการและการท่องเที่ยว',
    description: 'Hotels, guest services, aviation, culinary arts, and event organization.',
    icon: 'Utensils',
    professions: [
      { key: 'hotel_manager', name: 'Hotel General Manager', nameTh: 'ผู้จัดการทั่วไปโรงแรม', description: 'Manages luxury hotel operations, guest satisfaction, and room yields.', suggestedSkills: ['Hospitality Management', 'Revenue Management', 'Guest Satisfaction', 'P&L Accountability'] },
      { key: 'hotel_receptionist', name: 'Hotel Front Desk Receptionist', nameTh: 'พนักงานต้อนรับส่วนหน้าโรงแรม', description: 'Welcomes guests, manages check-in/out procedures, and resolves guest requests.', suggestedSkills: ['Property Management Systems (PMS)', 'Customer Care', 'Concierge Knowledge', 'Multilingual Service'] },
      { key: 'customer_service_rep', name: 'Customer Service Representative', nameTh: 'เจ้าหน้าที่บริการลูกค้า', description: 'Resolves inbound customer inquiries, escalations, and satisfaction feedback.', suggestedSkills: ['Conflict Resolution', 'Active Listening', 'Zendesk / CRM', 'Empathy', 'De-escalation'] },
      { key: 'flight_attendant', name: 'Flight Attendant / Cabin Crew', nameTh: 'พนักงานต้อนรับบนเครื่องบิน', description: 'Ensures aviation passenger safety, emergency preparedness, and in-flight service.', suggestedSkills: ['Aviation Safety Procedures', 'First Aid / CPR', 'In-flight Service', 'Crisis Management', 'Hospitality'] },
      { key: 'event_coordinator', name: 'Event Coordinator', nameTh: 'ผู้ประสานงานจัดงานและอีเวนต์', description: 'Coordinates banquets, corporate exhibitions, caterers, and stage schedules.', suggestedSkills: ['Event Logistics', 'Vendor Sourcing', 'Floor Planning', 'Budget Tracking', 'Timeline Management'] },
      { key: 'tourism_officer', name: 'Tourism Officer', nameTh: 'เจ้าหน้าที่ส่งเสริมการท่องเที่ยว', description: 'Promotes eco-tourism, cultural heritage attractions, and traveler safety.', suggestedSkills: ['Tourism Marketing', 'Destination Management', 'Cultural Heritage', 'Travel Regulations'] },
      { key: 'restaurant_manager', name: 'Restaurant Manager', nameTh: 'ผู้จัดการร้านอาหาร', description: 'Supervises kitchen and service staff, food safety, and dining guest experience.', suggestedSkills: ['Food Safety (HACCP)', 'Staff Scheduling', 'Inventory Control', 'Guest Relations', 'POS Systems'] },
    ],
  },
  {
    key: 'others',
    name: 'Other Specialized Professions',
    nameTh: 'วิชาชีพเฉพาะทางและสาขาอื่นๆ',
    description: 'Architecture, environmental science, logistics, agriculture, and social work.',
    icon: 'Layers',
    professions: [
      { key: 'research_scientist', name: 'Research Scientist', nameTh: 'นักวิทยาศาสตร์วิจัย', description: 'Conducts laboratory experiments, peer-reviewed scientific studies, and patent disclosures.', suggestedSkills: ['Scientific Method', 'Lab Instrumentation', 'Data Analysis', 'Paper Writing', 'Hypothesis Testing'] },
      { key: 'architect', name: 'Architect', nameTh: 'สถาปนิก', description: 'Designs building concepts, urban blueprints, and spatial construction plans.', suggestedSkills: ['Architectural Drawing', 'AutoCAD / Revit', 'Building Codes', 'Sustainable Design', '3D Rendering'] },
      { key: 'environmental_specialist', name: 'Environmental Specialist', nameTh: 'ผู้เชี่ยวชาญด้านสิ่งแวดล้อม', description: 'Monitors carbon footprints, pollution levels, and EIA environmental impact compliance.', suggestedSkills: ['EIA Assessments', 'Carbon Accounting', 'Environmental Regulations', 'Waste Management'] },
      { key: 'logistics_specialist', name: 'Logistics Specialist', nameTh: 'ผู้เชี่ยวชาญด้านโลจิสติกส์', description: 'Optimizes warehouse inventory distribution, customs clearance, and freight shipping.', suggestedSkills: ['Freight Forwarding', 'Warehouse Management (WMS)', 'Customs Clearance', 'Incoterms'] },
      { key: 'supply_chain_manager', name: 'Supply Chain Manager', nameTh: 'ผู้จัดการห่วงโซ่อุปทาน', description: 'Coordinates global supplier procurement, demand planning, and distribution chains.', suggestedSkills: ['Demand Forecasting', 'Procurement Strategy', 'Supplier Auditing', 'ERP Integration'] },
      { key: 'agriculture_specialist', name: 'Agriculture Specialist / Agronomist', nameTh: 'นักวิชาการเกษตร', description: 'Improves crop yields, smart farming IoT sensors, and soil nutritional balance.', suggestedSkills: ['Soil Science', 'Smart Farming IoT', 'Crop Protection', 'Hydroponics', 'Agricultural Economics'] },
      { key: 'social_worker', name: 'Social Worker', nameTh: 'นักสังคมสงเคราะห์', description: 'Assists disadvantaged communities, child welfare cases, and mental health rehabilitation.', suggestedSkills: ['Case Management', 'Counseling', 'Community Advocacy', 'Crisis Intervention', 'Social Legislation'] },
    ],
  },
];

export const SEED_INTERVIEW_CATEGORIES: SeedCategory[] = [
  {
    key: 'job',
    name: 'Job Interview',
    nameTh: 'การสัมภาษณ์งาน',
    description: 'Interviews for professional corporate, technical, and operational employment.',
    subcategories: [
      { key: 'general_job', name: 'General Job Interview', nameTh: 'การสัมภาษณ์งานทั่วไป' },
      { key: 'technical', name: 'Technical Interview', nameTh: 'การสัมภาษณ์เชิงเทคนิค' },
      { key: 'behavioral', name: 'Behavioral Interview (STAR)', nameTh: 'การสัมภาษณ์เชิงพฤติกรรม' },
      { key: 'hr', name: 'HR Interview', nameTh: 'การสัมภาษณ์ฝ่ายบุคคล' },
      { key: 'managerial', name: 'Managerial Interview', nameTh: 'การสัมภาษณ์ระดับผู้จัดการ' },
      { key: 'executive', name: 'Executive Interview', nameTh: 'การสัมภาษณ์ระดับผู้บริหาร' },
      { key: 'competency_based', name: 'Competency-Based Interview', nameTh: 'การสัมภาษณ์ตามสมรรถนะ' },
      { key: 'case_interview', name: 'Case Interview', nameTh: 'การสัมภาษณ์วิเคราะห์เคสธุรกิจ' },
      { key: 'situational', name: 'Situational Interview', nameTh: 'การสัมภาษณ์ตามสถานการณ์จำลอง' },
      { key: 'internship', name: 'Internship Interview', nameTh: 'การสัมภาษณ์เพื่อฝึกงาน' },
      { key: 'career_change', name: 'Career Change Interview', nameTh: 'การสัมภาษณ์ย้ายสายงาน' },
    ],
  },
  {
    key: 'academic',
    name: 'Academic Interview',
    nameTh: 'การสัมภาษณ์เพื่อการศึกษาและวิชาการ',
    description: 'Interviews for university admissions, graduate degree programs, and academic faculties.',
    subcategories: [
      { key: 'university_admission', name: 'University Admission (Undergraduate)', nameTh: 'การสอบสัมภาษณ์เข้ามหาวิทยาลัยระดับปริญญาตรี' },
      { key: 'grad_school_admission', name: 'Graduate School Admission', nameTh: 'การสอบสัมภาษณ์เข้าบัณฑิตวิทยาลัย' },
      { key: 'masters_admission', name: "Master's Degree Admission", nameTh: 'การสอบสัมภาษณ์ระดับปริญญาโท' },
      { key: 'phd_admission', name: 'PhD Admission', nameTh: 'การสอบสัมภาษณ์ระดับปริญญาเอก' },
      { key: 'faculty_admission', name: 'Faculty Admission', nameTh: 'การสอบสัมภาษณ์เข้าคณะเฉพาะทาง' },
      { key: 'academic_program', name: 'Academic Program Interview', nameTh: 'การสอบสัมภาษณ์โครงการพิเศษทางวิชาการ' },
    ],
  },
  {
    key: 'scholarship',
    name: 'Scholarship Interview',
    nameTh: 'การสัมภาษณ์เพื่อชิงทุนการศึกษา',
    description: 'Interviews for government, international, and merit-based academic scholarships.',
    subcategories: [
      { key: 'govt_scholarship', name: 'Government Scholarship (ทุนรัฐบาล/ทุนก.พ.)', nameTh: 'ทุนรัฐบาลและหน่วยงานรัฐ' },
      { key: 'university_scholarship', name: 'University Scholarship', nameTh: 'ทุนการศึกษาของมหาวิทยาลัย' },
      { key: 'international_scholarship', name: 'International Scholarship (Fulbright/Chevening/Monbukagakusho)', nameTh: 'ทุนการศึกษาต่างประเทศ' },
      { key: 'research_scholarship', name: 'Research Scholarship', nameTh: 'ทุนวิจัยทางวิชาการ' },
      { key: 'exchange_scholarship', name: 'Exchange Scholarship', nameTh: 'ทุนนักศึกษาแลกเปลี่ยน' },
      { key: 'fully_funded_scholarship', name: 'Fully Funded Scholarship', nameTh: 'ทุนการศึกษาเต็มจำนวน' },
    ],
  },
  {
    key: 'international_exchange',
    name: 'International & Exchange Interview',
    nameTh: 'การสัมภาษณ์โครงการแลกเปลี่ยนและต่างประเทศ',
    description: 'Interviews for overseas study, international fellowships, and cultural exchange programs.',
    subcategories: [
      { key: 'student_exchange', name: 'Student Exchange Program', nameTh: 'โครงการนักเรียน/นักศึกษาแลกเปลี่ยน' },
      { key: 'international_internship', name: 'International Internship', nameTh: 'การฝึกงานในต่างประเทศ' },
      { key: 'overseas_study', name: 'Overseas Study Preparation', nameTh: 'การเตรียมตัวศึกษาต่อต่างประเทศ' },
      { key: 'cultural_exchange', name: 'Cultural Exchange Program (Work and Travel / AFS)', nameTh: 'โครงการแลกเปลี่ยนวัฒนธรรม' },
      { key: 'visa_prep', name: 'Visa-related Interview Preparation', nameTh: 'การเตรียมสัมภาษณ์ขอวีซ่า' },
      { key: 'international_fellowship', name: 'International Fellowship', nameTh: 'ทุนวิชาชีพและวิจัยระดับนานาชาติ' },
    ],
  },
  {
    key: 'research',
    name: 'Research Interview',
    nameTh: 'การสัมภาษณ์งานวิจัยและสอบป้องกันวิทยานิพนธ์',
    description: 'Interviews for research proposals, thesis defense, research grants, and postdoctoral posts.',
    subcategories: [
      { key: 'research_proposal_defense', name: 'Research Proposal Defense', nameTh: 'การสอบป้องกันโครงร่างงานวิจัย' },
      { key: 'thesis_defense', name: 'Thesis Defense', nameTh: 'การสอบป้องกันวิทยานิพนธ์ระดับปริญญาโท' },
      { key: 'dissertation_defense', name: 'Dissertation Defense', nameTh: 'การสอบป้องกันดุษฎีนิพนธ์ระดับปริญญาเอก' },
      { key: 'grant_interview', name: 'Research Grant Interview', nameTh: 'การสัมภาษณ์ขอทุนสนับสนุนงานวิจัย' },
      { key: 'academic_research_position', name: 'Academic Research Position', nameTh: 'การคัดเลือกตำแหน่งนักวิจัยประจำสถาบัน' },
    ],
  },
  {
    key: 'career_dev',
    name: 'Professional & Career Development',
    nameTh: 'การประเมินเพื่อการเลื่อนตำแหน่งและพัฒนาวิชาชีพ',
    description: 'Internal corporate promotions, leadership assessments, and annual performance reviews.',
    subcategories: [
      { key: 'internal_promotion', name: 'Internal Promotion Interview', nameTh: 'การสัมภาษณ์เพื่อเลื่อนตำแหน่งภายในองค์กร' },
      { key: 'leadership_assessment', name: 'Leadership Assessment', nameTh: 'การประเมินภาวะผู้นำ' },
      { key: 'performance_review', name: 'Performance Review', nameTh: 'การสัมภาษณ์ประเมินผลงานประจำปี' },
      { key: 'management_assessment', name: 'Management Assessment Center', nameTh: 'การประเมินทักษะการบริหารจัดการ' },
      { key: 'professional_certification', name: 'Professional Certification Interview', nameTh: 'การสอบสัมภาษณ์เพื่อรับรองใบอนุญาตวิชาชีพ' },
      { key: 'career_planning', name: 'Career Development & Pathing', nameTh: 'การวางแผนเส้นทางความก้าวหน้าในอาชีพ' },
    ],
  },
  {
    key: 'general',
    name: 'General & Behavioral Interview',
    nameTh: 'การสัมภาษณ์ทั่วไปและประเมินทักษะสากล',
    description: 'Foundational interview evaluations covering self-presentation, critical thinking, and ethics.',
    subcategories: [
      { key: 'self_introduction', name: 'Self-Introduction & Narrative', nameTh: 'การแนะนำตัวและเล่าประวัติส่วนตัว' },
      { key: 'strengths_weaknesses', name: 'Strengths and Weaknesses Evaluation', nameTh: 'การวิเคราะห์จุดแข็งและจุดที่ต้องพัฒนา' },
      { key: 'problem_solving', name: 'Problem-Solving & Agility', nameTh: 'การประเมินทักษะการแก้ปัญหาและความยืดหยุ่น' },
      { key: 'communication_skills', name: 'Communication & Interpersonal Skills', nameTh: 'ทักษะการสื่อสารและการทำงานร่วมกับผู้อื่น' },
      { key: 'critical_thinking', name: 'Critical Thinking & Logic', nameTh: 'การคิดเชิงวิพากษ์และการใช้ตรรกะ' },
      { key: 'situational_judgment', name: 'Situational Judgment & Ethics', nameTh: 'การตัดสินใจตามสถานการณ์และจริยธรรม' },
    ],
  },
];

export const SEED_SENIORITY_LEVELS: SeedSeniority[] = [
  // General / Corporate Career
  { category: 'career', key: 'career_student', name: 'Student / No Experience', nameTh: 'นักศึกษา / ไม่มีประสบการณ์การทำงาน', minYearsExp: 0, maxYearsExp: 0 },
  { category: 'career', key: 'career_entry', name: 'Entry Level (0–2 Years)', nameTh: 'ระดับเริ่มต้น (0–2 ปี)', minYearsExp: 0, maxYearsExp: 2 },
  { category: 'career', key: 'career_junior', name: 'Junior (0–2 Years)', nameTh: 'ระดับปฏิบัติการเบื้องต้น (0–2 ปี)', minYearsExp: 0, maxYearsExp: 2 },
  { category: 'career', key: 'career_mid', name: 'Mid-level (2–5 Years)', nameTh: 'ระดับกลาง (2–5 ปี)', minYearsExp: 2, maxYearsExp: 5 },
  { category: 'career', key: 'career_senior', name: 'Senior (5–8 Years)', nameTh: 'ระดับอาวุโส (5–8 ปี)', minYearsExp: 5, maxYearsExp: 8 },
  { category: 'career', key: 'career_lead', name: 'Lead / Principal (8+ Years)', nameTh: 'ระดับหัวหน้าทีม / ผู้เชี่ยวชาญหลัก (8+ ปี)', minYearsExp: 8, maxYearsExp: 25 },
  { category: 'career', key: 'career_manager', name: 'Manager / Department Head', nameTh: 'ผู้จัดการฝ่าย / ผู้บริหารระดับกลาง', minYearsExp: 6, maxYearsExp: 30 },
  { category: 'career', key: 'career_executive', name: 'Director / Executive (C-Level)', nameTh: 'ผู้อำนวยการ / ผู้บริหารระดับสูง', minYearsExp: 10, maxYearsExp: 40 },

  // Academic Track
  { category: 'academic', key: 'acad_highschool', name: 'High School Student', nameTh: 'นักเรียนระดับมัธยมศึกษาตอนปลาย', minYearsExp: 0, maxYearsExp: 0 },
  { category: 'academic', key: 'acad_undergrad', name: 'Undergraduate Student', nameTh: 'นิสิต / นักศึกษาระดับปริญญาตรี', minYearsExp: 0, maxYearsExp: 0 },
  { category: 'academic', key: 'acad_grad', name: 'Graduate Student', nameTh: 'นักศึกษาระดับบัณฑิตศึกษา', minYearsExp: 0, maxYearsExp: 2 },
  { category: 'academic', key: 'acad_master', name: "Master's Candidate", nameTh: 'ผู้ศึกษาระดับปริญญาโท', minYearsExp: 0, maxYearsExp: 3 },
  { category: 'academic', key: 'acad_phd', name: 'PhD Candidate', nameTh: 'ผู้ศึกษาระดับปริญญาเอก', minYearsExp: 1, maxYearsExp: 6 },
  { category: 'academic', key: 'acad_researcher', name: 'Academic Researcher', nameTh: 'นักวิจัยประจำสถาบัน', minYearsExp: 3, maxYearsExp: 15 },
  { category: 'academic', key: 'acad_postdoc', name: 'Postdoctoral Researcher', nameTh: 'นักวิจัยหลังปริญญาเอก', minYearsExp: 4, maxYearsExp: 20 },

  // Healthcare & Professional Licensing
  { category: 'healthcare_licensed', key: 'hl_trainee', name: 'Student / Trainee', nameTh: 'นักศึกษาฝึกงาน / นักศึกษาแพทย์-พยาบาล', minYearsExp: 0, maxYearsExp: 0 },
  { category: 'healthcare_licensed', key: 'hl_intern', name: 'Intern / Resident', nameTh: 'แพทย์ประจำบ้าน / ผู้ฝึกหัดวิชาชีพ', minYearsExp: 1, maxYearsExp: 3 },
  { category: 'healthcare_licensed', key: 'hl_licensed', name: 'Licensed Professional', nameTh: 'ผู้ประกอบวิชาชีพมีใบอนุญาต', minYearsExp: 2, maxYearsExp: 6 },
  { category: 'healthcare_licensed', key: 'hl_experienced', name: 'Experienced Professional', nameTh: 'ผู้ประกอบวิชาชีพชำนาญการ', minYearsExp: 5, maxYearsExp: 10 },
  { category: 'healthcare_licensed', key: 'hl_specialist', name: 'Senior Specialist / Fellow', nameTh: 'แพทย์เฉพาะทางระดับสูง / ผู้เชี่ยวชาญพิเศษ', minYearsExp: 8, maxYearsExp: 20 },
  { category: 'healthcare_licensed', key: 'hl_dept_head', name: 'Department Head / Chief of Service', nameTh: 'หัวหน้าภาควิชา / ผู้อำนวยการศูนย์การแพทย์', minYearsExp: 12, maxYearsExp: 35 },
];

export const SEED_SKILL_CATEGORIES: SeedSkillCategory[] = [
  {
    key: 'technical',
    name: 'Technical Skills',
    nameTh: 'ทักษะเชิงเทคนิค',
    skills: [
      { name: 'Data Structures & Algorithms', nameTh: 'โครงสร้างข้อมูลและขั้นตอนวิธี' },
      { name: 'System Architecture', nameTh: 'สถาปัตยกรรมระบบ' },
      { name: 'Full-Stack Development', nameTh: 'การพัฒนาฟูลสแต็ก' },
      { name: 'Database Optimization & SQL', nameTh: 'การปรับแต่งฐานข้อมูล' },
      { name: 'Machine Learning & MLOps', nameTh: 'การเรียนรู้ของเครื่อง' },
      { name: 'Cloud Infrastructure & DevOps', nameTh: 'โครงสร้างพื้นฐานคลาวด์' },
      { name: 'Cybersecurity & Cryptography', nameTh: 'ความปลอดภัยไซเบอร์' },
    ],
  },
  {
    key: 'professional',
    name: 'Professional Skills',
    nameTh: 'ทักษะทางวิชาชีพเฉพาะทาง',
    skills: [
      { name: 'Financial Modeling & Valuation', nameTh: 'แบบจำลองทางการเงิน' },
      { name: 'Clinical Patient Care & Diagnosis', nameTh: 'การวินิจฉัยและดูแลผู้ป่วย' },
      { name: 'Contract Drafting & Review', nameTh: 'การร่างและตรวจสัญญาทางกฎหมาย' },
      { name: 'Structural Civil Engineering Design', nameTh: 'การออกแบบโครงสร้างวิศวกรรมโยธา' },
      { name: 'Laboratory PCR & Hematology Analysis', nameTh: 'การวิเคราะห์ห้องปฏิบัติการ' },
      { name: 'Corporate Tax Planning', nameTh: 'การวางแผนภาษีองค์กร' },
    ],
  },
  {
    key: 'soft',
    name: 'Soft Skills',
    nameTh: 'ทักษะด้านปฏิสัมพันธ์และการสื่อสาร',
    skills: [
      { name: 'Active Listening & Empathy', nameTh: 'การรับฟังอย่างเข้าอกเข้าใจ' },
      { name: 'Persuasive Communication', nameTh: 'การสื่อสารเพื่อโน้มน้าวใจ' },
      { name: 'Adaptability & Resilience', nameTh: 'การปรับตัวและความยืดหยุ่นทางอารมณ์' },
      { name: 'Cross-functional Collaboration', nameTh: 'การทำงานร่วมกันข้ามสายงาน' },
      { name: 'Conflict Resolution', nameTh: 'การจัดการและไกล่เกลี่ยข้อขัดแย้ง' },
      { name: 'Critical Problem Solving', nameTh: 'การคิดวิเคราะห์และแก้ปัญหาซับซ้อน' },
    ],
  },
  {
    key: 'domain_knowledge',
    name: 'Domain Knowledge',
    nameTh: 'ความรู้เชิงลึกในอุตสาหกรรม',
    skills: [
      { name: 'FinTech & Payment Regulations', nameTh: 'กฎระเบียบการเงินดิจิทัล' },
      { name: 'Healthcare Compliance (HIPAA / HA)', nameTh: 'มาตรฐานการแพทย์และข้อมูลสุขภาพ' },
      { name: 'Supply Chain & Cold Logistics', nameTh: 'ห่วงโซ่อุปทานและการขนส่ง' },
      { name: 'Renewable Energy Systems', nameTh: 'ระบบพลังงานหมุนเวียน' },
      { name: 'Public Policy Formulation', nameTh: 'การร่างและวิเคราะห์นโยบายสาธารณะ' },
    ],
  },
  {
    key: 'tools_software',
    name: 'Tools & Software',
    nameTh: 'เครื่องมือและโปรแกรมประยุกต์',
    skills: [
      { name: 'Figma & Design Systems', nameTh: 'โปรแกรม Figma และระบบการออกแบบ' },
      { name: 'SAP ERP / NetSuite', nameTh: 'ระบบ ERP องค์กร' },
      { name: 'Tableau & Power BI', nameTh: 'โปรแกรมวิเคราะห์ข้อมูลเชิงภาพ' },
      { name: 'AutoCAD & Revit BIM', nameTh: 'โปรแกรมเขียนแบบวิศวกรรมและสถาปัตยกรรม' },
      { name: 'Electronic Medical Records (EMR)', nameTh: 'ระบบเวชระเบียนอิเล็กทรอนิกส์' },
      { name: 'Jira & Confluence', nameTh: 'ระบบบริหารงานโครงการ' },
    ],
  },
  {
    key: 'languages',
    name: 'Languages & Communication',
    nameTh: 'ทักษะทางภาษาและการสื่อสารสากล',
    skills: [
      { name: 'Professional English (C1/C2)', nameTh: 'ภาษาอังกฤษระดับมืออาชีพ' },
      { name: 'Native / Fluent Thai', nameTh: 'ภาษาไทยระดับคล่องแคล่ว' },
      { name: 'Business Mandarin Chinese', nameTh: 'ภาษาจีนเพื่อการสื่อสารทางธุรกิจ' },
      { name: 'Business Japanese (N2/N1)', nameTh: 'ภาษาญี่ปุ่นเพื่อธุรกิจ' },
      { name: 'Academic Writing & Publishing', nameTh: 'การเขียนบทความเชิงวิชาการ' },
    ],
  },
  {
    key: 'leadership',
    name: 'Leadership & Management',
    nameTh: 'ทักษะความเป็นผู้นำและการบริหาร',
    skills: [
      { name: 'Strategic Vision & Roadmapping', nameTh: 'วิสัยทัศน์เชิงกลยุทธ์และการวางแผน' },
      { name: 'Team Mentoring & Coaching', nameTh: 'การสอนงานและพัฒนาบุคลากร' },
      { name: 'Change Management', nameTh: 'การบริหารการเปลี่ยนแปลง' },
      { name: 'Budget & P&L Responsibility', nameTh: 'การบริหารงบประมาณและผลกำไรขาดทุน' },
      { name: 'Stakeholder Alignment', nameTh: 'การประสานความเข้าใจผู้มีส่วนได้ส่วนเสีย' },
    ],
  },
  {
    key: 'research',
    name: 'Research & Methodology',
    nameTh: 'ระเบียบวิธีวิจัยและการทดลอง',
    skills: [
      { name: 'Quantitative Statistical Analysis (SPSS / R)', nameTh: 'การวิเคราะห์เชิงปริมาณและสถิติ' },
      { name: 'Qualitative Interview Coding', nameTh: 'การวิเคราะห์ข้อมูลเชิงคุณภาพ' },
      { name: 'Experimental Design & Control', nameTh: 'การออกแบบการทดลอง' },
      { name: 'Grant Proposal Writing', nameTh: 'การเขียนโครงร่างขอทุนวิจัย' },
      { name: 'Peer-reviewed Scholarly Publication', nameTh: 'การตีพิมพ์ในวารสารวิชาการระดับสากล' },
    ],
  },
];
