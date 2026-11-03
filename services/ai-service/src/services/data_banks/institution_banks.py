"""Universities, Companies, Organizations, and Geographic Locations Banks.

Provides rich, realistic institutions for high-fidelity synthetic profiles,
resumes, and organizational contexts across Thai, Regional ASEAN, and Global markets.
"""

import random
from typing import Any, Dict, List, Optional

# ==============================================================================
# 1. UNIVERSITIES & ACADEMIC INSTITUTIONS BANK
# ==============================================================================

UNIVERSITIES: List[Dict[str, Any]] = [
    # Top Thai Public Universities
    {
        "name": "Chulalongkorn University",
        "name_th": "จุฬาลงกรณ์มหาวิทยาลัย",
        "country": "Thailand",
        "tier": "Top National",
        "default_degrees": {
            "tech": "Bachelor of Engineering (Computer Engineering)",
            "healthcare": "Doctor of Medicine (M.D.) / Bachelor of Science (Pharmacy)",
            "business": "Bachelor of Business Administration (BBA International Program)",
            "finance": "Bachelor of Accountancy / Finance",
            "legal": "Bachelor of Laws (LL.B.)",
            "engineering": "Bachelor of Engineering (Mechanical / Electrical / Civil)",
            "education": "Bachelor of Education / Master of Education",
            "creative": "Bachelor of Fine and Applied Arts / Communication Arts",
        },
    },
    {
        "name": "Mahidol University",
        "name_th": "มหาวิทยาลัยมหิดล",
        "country": "Thailand",
        "tier": "Top National (Medical & Sciences)",
        "default_degrees": {
            "tech": "Bachelor of Science in Information and Communication Technology (ICT)",
            "healthcare": "Doctor of Medicine (M.D.) / Bachelor of Nursing Science",
            "business": "Bachelor of Management (College of Management CMMU)",
            "finance": "Bachelor of Science in Actuarial Science",
            "legal": "Master of Arts in Health Law and Bioethics",
            "engineering": "Bachelor of Engineering (Biomedical Engineering)",
            "education": "Master of Science in Science and Technology Education",
            "creative": "Bachelor of Arts in Music and Entertainment Technology",
        },
    },
    {
        "name": "Thammasat University",
        "name_th": "มหาวิทยาลัยธรรมศาสตร์",
        "country": "Thailand",
        "tier": "Top National (Law, Business, Humanities & Tech)",
        "default_degrees": {
            "tech": "Bachelor of Science (Software Engineering / Computer Science)",
            "healthcare": "Doctor of Medicine (M.D.) / Bachelor of Public Health",
            "business": "Bachelor of Business Administration (BBA Thammasat)",
            "finance": "Bachelor of Science in Finance and Banking",
            "legal": "Bachelor of Laws (LL.B. Commercial & International Law)",
            "engineering": "Bachelor of Engineering (TEPE / TEP International)",
            "education": "Master of Learning Sciences and Educational Innovation",
            "creative": "Bachelor of Arts in Journalism and Mass Communication",
        },
    },
    {
        "name": "Kasetsart University",
        "name_th": "มหาวิทยาลัยเกษตรศาสตร์",
        "country": "Thailand",
        "tier": "Top National (Engineering, Agriculture & Sciences)",
        "default_degrees": {
            "tech": "Bachelor of Engineering (Computer Engineering)",
            "healthcare": "Doctor of Veterinary Medicine (D.V.M.)",
            "business": "Bachelor of Business Administration (Marketing / Logistics)",
            "finance": "Bachelor of Economics (Applied Economics)",
            "legal": "Bachelor of Laws (LL.B.)",
            "engineering": "Bachelor of Engineering (Industrial / Chemical / Mechanical)",
            "education": "Bachelor of Education in Physical Education and Coaching",
            "creative": "Bachelor of Arts in Applied Linguistics and Media",
        },
    },
    {
        "name": "King Mongkut's University of Technology Thonburi",
        "name_th": "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (มจธ.)",
        "country": "Thailand",
        "tier": "Top National (Tech & Engineering Focus)",
        "default_degrees": {
            "tech": "Bachelor of Science (Computer Science / Information Technology)",
            "healthcare": "Bachelor of Engineering (Biological Engineering)",
            "business": "Master of Science in Industrial Business and Entrepreneurship",
            "finance": "Bachelor of Science in Financial Technology (FinTech)",
            "legal": "Master of Intellectual Property and Technology Law",
            "engineering": "Bachelor of Engineering (Mechatronics / Robotics / Civil)",
            "education": "Bachelor of Science in Industrial Education",
            "creative": "Bachelor of Fine Arts (Communication Design / Media Arts)",
        },
    },
    {
        "name": "King Mongkut's Institute of Technology Ladkrabang",
        "name_th": "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง (สจล.)",
        "country": "Thailand",
        "tier": "Top National (Tech & Engineering Focus)",
        "default_degrees": {
            "tech": "Bachelor of Engineering (Computer Innovation Engineering / AI)",
            "healthcare": "Doctor of Medicine (International Medical College)",
            "business": "Bachelor of Business Administration (Digital Marketing)",
            "finance": "Bachelor of Science in Financial Engineering",
            "legal": "Certificate in Cyber & Technology Regulation",
            "engineering": "Bachelor of Engineering (Electrical & Telecommunication)",
            "education": "Master of Industrial Education",
            "creative": "Bachelor of Architecture (Industrial Design)",
        },
    },
    {
        "name": "Chiang Mai University",
        "name_th": "มหาวิทยาลัยเชียงใหม่",
        "country": "Thailand",
        "tier": "Top Regional (Northern Flagship)",
        "default_degrees": {
            "tech": "Bachelor of Science (Data Science & Software Engineering)",
            "healthcare": "Doctor of Medicine (M.D.) / Bachelor of Pharmacy",
            "business": "Bachelor of Business Administration (International Business)",
            "finance": "Bachelor of Economics (Monetary and Financial Economics)",
            "legal": "Bachelor of Laws (LL.B.)",
            "engineering": "Bachelor of Engineering (Environmental / Mechanical)",
            "education": "Bachelor of Education (Secondary Education)",
            "creative": "Bachelor of Fine Arts (Visual Arts & Digital Media)",
        },
    },
    {
        "name": "Khon Kaen University",
        "name_th": "มหาวิทยาลัยขอนแก่น",
        "country": "Thailand",
        "tier": "Top Regional (Northeastern Flagship)",
        "default_degrees": {
            "tech": "Bachelor of Science (Computer Science / Artificial Intelligence)",
            "healthcare": "Doctor of Medicine (Srinagarind Hospital Medical School)",
            "business": "Bachelor of Business Administration (Global Business)",
            "finance": "Bachelor of Accountancy",
            "legal": "Bachelor of Laws (LL.B.)",
            "engineering": "Bachelor of Engineering (Civil / Agricultural Engineering)",
            "education": "Master of Education in Educational Technology",
            "creative": "Bachelor of Fine and Applied Arts (Creative Design)",
        },
    },
    {
        "name": "Prince of Songkla University",
        "name_th": "มหาวิทยาลัยสงขลานครินทร์",
        "country": "Thailand",
        "tier": "Top Regional (Southern Flagship)",
        "default_degrees": {
            "tech": "Bachelor of Science (Information and Communication Technology)",
            "healthcare": "Doctor of Medicine (M.D.) / Bachelor of Dental Surgery",
            "business": "Bachelor of Business Administration (Logistics & Supply Chain)",
            "finance": "Bachelor of Economics",
            "legal": "Bachelor of Laws (LL.B.)",
            "engineering": "Bachelor of Engineering (Mining & Materials / Electrical)",
            "education": "Bachelor of Education in Science Teaching",
            "creative": "Bachelor of Arts in Digital Media and Communication",
        },
    },
    {
        "name": "Srinakharinwirot University",
        "name_th": "มหาวิทยาลัยศรีนครินทรวิโรฒ (มศว)",
        "country": "Thailand",
        "tier": "Top National (Education, Arts & Health)",
        "default_degrees": {
            "tech": "Bachelor of Science (Computer Science / Data Engineering)",
            "healthcare": "Doctor of Medicine / Bachelor of Physical Therapy",
            "business": "Bachelor of Business Administration (Tourism & Hospitality)",
            "finance": "Bachelor of Economics",
            "legal": "Bachelor of Laws (LL.B.)",
            "engineering": "Bachelor of Engineering (Biomedical / Mechanical)",
            "education": "Bachelor of Education (Honor Program)",
            "creative": "Bachelor of Arts in Performing Arts and Creative Communication",
        },
    },
    {
        "name": "National Institute of Development Administration",
        "name_th": "สถาบันบัณฑิตพัฒนบริหารศาสตร์ (นิด้า)",
        "country": "Thailand",
        "tier": "Graduate School Flagship",
        "default_degrees": {
            "tech": "Master of Science in Business Analytics and Data Science",
            "healthcare": "Master of Science in Healthcare Management",
            "business": "Master of Business Administration (NIDA MBA)",
            "finance": "Master of Science in Financial Investment and Risk Management",
            "legal": "Master of Laws (LL.M. in International Law & Business)",
            "engineering": "Master of Science in Technology Management",
            "education": "Doctor of Philosophy in Human Resource and Organization Development",
            "creative": "Master of Arts in Strategic Communication Management",
        },
    },
    {
        "name": "Assumption University",
        "name_th": "มหาวิทยาลัยอัสสัมชัญ (เอแบค)",
        "country": "Thailand",
        "tier": "Top Private (International English Medium)",
        "default_degrees": {
            "tech": "Bachelor of Science in Computer Science (Vincent Mary School)",
            "healthcare": "Bachelor of Nursing Science",
            "business": "Bachelor of Business Administration (Martin de Tours School of Management)",
            "finance": "Bachelor of Business Administration in Finance and Banking",
            "legal": "Bachelor of Laws (LL.B. Bilingual Program)",
            "engineering": "Bachelor of Engineering (Aeronautic / Mechatronics)",
            "education": "Master of Education in Educational Leadership",
            "creative": "Bachelor of Arts in Visual Communication Arts (Albert Laurence School)",
        },
    },
    # Top Regional Asian Universities
    {
        "name": "National University of Singapore",
        "name_th": "มหาวิทยาลัยแห่งชาติสิงคโปร์ (NUS)",
        "country": "Singapore",
        "tier": "Global Elite / Top Asia",
        "default_degrees": {
            "tech": "Bachelor of Computing in Computer Science / AI",
            "healthcare": "Bachelor of Medicine and Bachelor of Surgery (MBBS, Yong Loo Lin)",
            "business": "Bachelor of Business Administration (NUS Business School)",
            "finance": "Master of Science in Finance / Quantitative Finance",
            "legal": "Master of Laws (LL.M. in International Business Law)",
            "engineering": "Bachelor of Engineering (Electrical & Computer Engineering)",
            "education": "Master of Education (Curriculum and Teaching)",
            "creative": "Bachelor of Arts in Communications and New Media",
        },
    },
    {
        "name": "Nanyang Technological University",
        "name_th": "มหาวิทยาลัยเทคโนโลยีนันยาง (NTU)",
        "country": "Singapore",
        "tier": "Global Elite / Top Asia",
        "default_degrees": {
            "tech": "Bachelor of Science in Data Science and Artificial Intelligence",
            "healthcare": "Bachelor of Medicine and Bachelor of Surgery (Lee Kong Chian)",
            "business": "Bachelor of Business (Nanyang Business School)",
            "finance": "Master of Science in Financial Engineering",
            "legal": "Master of Science in Technology and Corporate Governance",
            "engineering": "Bachelor of Engineering (Materials Science / Robotics)",
            "education": "Master of Arts in Educational Management (NIE)",
            "creative": "Bachelor of Fine Arts in Digital Animation and Game Design",
        },
    },
    {
        "name": "University of Tokyo",
        "name_th": "มหาวิทยาลัยโตเกียว (โทได)",
        "country": "Japan",
        "tier": "Global Elite / Top Asia",
        "default_degrees": {
            "tech": "Master of Information Science and Technology",
            "healthcare": "Doctor of Medicine (Faculty of Medicine)",
            "business": "Master of Economics and International Management",
            "finance": "Master of Public Policy in Financial Economics",
            "legal": "Master of Laws (LL.M.)",
            "engineering": "Bachelor of Engineering (Precision Engineering / Quantum Computing)",
            "education": "Master of Education in Cross-Cultural Education",
            "creative": "Bachelor of Letters in Interdisciplinary Information Studies",
        },
    },
    # Top Western Global Universities (Ivy League & Russell Group)
    {
        "name": "University of Oxford",
        "name_th": "มหาวิทยาลัยออกซฟอร์ด",
        "country": "United Kingdom",
        "tier": "Global Top Tier (Ivy / Oxbridge)",
        "default_degrees": {
            "tech": "Master of Science in Advanced Computer Science",
            "healthcare": "Bachelor of Medicine and Surgery (BMBCh) / M.Sc Clinical Medicine",
            "business": "Master of Business Administration (Saïd Business School)",
            "finance": "Master of Science in Financial Economics (MFE)",
            "legal": "Bachelor of Civil Law (BCL) / Master of Law and Finance (MLF)",
            "engineering": "Master of Engineering (Engineering Science)",
            "education": "Master of Science in Education (Comparative & International Education)",
            "creative": "Master of Studies in Film Aesthetics / Literature",
        },
    },
    {
        "name": "Harvard University",
        "name_th": "มหาวิทยาลัยฮาร์วาร์ด",
        "country": "United States",
        "tier": "Global Top Tier (Ivy / Oxbridge)",
        "default_degrees": {
            "tech": "Master of Science in Computational Science and Engineering",
            "healthcare": "Doctor of Medicine (Harvard Medical School)",
            "business": "Master of Business Administration (Harvard Business School)",
            "finance": "Master of Science in Applied Economics and Financial Markets",
            "legal": "Master of Laws (LL.M., Harvard Law School)",
            "engineering": "Master of Science in Bioengineering (SEAS)",
            "education": "Master of Education in Education Policy and Analysis",
            "creative": "Bachelor of Arts in Visual and Environmental Studies",
        },
    },
    {
        "name": "Stanford University",
        "name_th": "มหาวิทยาลัยสแตนฟอร์ด",
        "country": "United States",
        "tier": "Global Top Tier (Silicon Valley / Tech Leadership)",
        "default_degrees": {
            "tech": "Master of Science in Computer Science (Artificial Intelligence)",
            "healthcare": "Doctor of Medicine (Stanford School of Medicine)",
            "business": "Master of Business Administration (Stanford GSB)",
            "finance": "Master of Science in Management Science and Financial Mathematics",
            "legal": "Master of Laws in Law, Science & Technology (LL.M.)",
            "engineering": "Master of Science in Mechanical Engineering / Clean Tech",
            "education": "Master of Arts in Learning, Design and Technology",
            "creative": "Master of Fine Arts in Documentary Film and Media Arts",
        },
    },
    {
        "name": "Imperial College London",
        "name_th": "อิมพีเรียลคอลเลจลอนดอน",
        "country": "United Kingdom",
        "tier": "Global Top Tier (STEM & Medicine)",
        "default_degrees": {
            "tech": "Master of Science in Computing (Machine Learning and Data Science)",
            "healthcare": "Bachelor of Medicine and Bachelor of Surgery (MBBS)",
            "business": "Master of Science in Strategic Marketing / Innovation",
            "finance": "Master of Science in Finance and Accounting",
            "legal": "Certificate in Global Health Regulatory Policies",
            "engineering": "Master of Engineering (Aeronautical / Chemical Engineering)",
            "education": "Master of Science in Science Communication",
            "creative": "Master of Science in Innovation Design Engineering",
        },
    },
    {
        "name": "University of Melbourne",
        "name_th": "มหาวิทยาลัยเมลเบิร์น",
        "country": "Australia",
        "tier": "Top Australasia Flagship",
        "default_degrees": {
            "tech": "Master of Information Technology (Distributed Computing)",
            "healthcare": "Doctor of Medicine (Melbourne Medical School)",
            "business": "Master of Management (Melbourne Business School)",
            "finance": "Master of Finance / Actuarial Practice",
            "legal": "Master of Laws (Melbourne Law School)",
            "engineering": "Master of Engineering (Civil with Business)",
            "education": "Master of Teaching (Secondary)",
            "creative": "Master of Creative Writing, Publishing and Editing",
        },
    },
]


# ==============================================================================
# 2. COMPANIES & ORGANIZATIONS ECOSYSTEM (MULTI-TIERED BY INDUSTRY)
# ==============================================================================

COMPANIES_BY_INDUSTRY: Dict[str, List[Dict[str, str]]] = {
    "tech": [
        {"name": "Siam Digital Ventures", "type": "Scale-up Unicorn", "hq": "Bangkok, Thailand"},
        {"name": "NexaPay Solutions", "type": "FinTech Payment Gateway", "hq": "Singapore / Bangkok"},
        {"name": "ASEAN CloudWorks Enterprise", "type": "Cloud Infrastructure", "hq": "Bangkok, Thailand"},
        {"name": "DataSphere AI Analytics", "type": "AI & Big Data Lab", "hq": "Bangkok, Thailand"},
        {"name": "Ascendancy AI Labs", "type": "Generative AI Research Hub", "hq": "Singapore"},
        {"name": "FlowLogistics Global Systems", "type": "Logistics SaaS", "hq": "Bangkok, Thailand"},
        {"name": "CyberSentinel Thailand", "type": "Cybersecurity MSSP", "hq": "Bangkok, Thailand"},
        {"name": "OmniRetail Digital Hub", "type": "E-Commerce Tech Center", "hq": "Bangkok, Thailand"},
        {"name": "Global Tech Matrix Asia", "type": "Global MNC Regional Hub", "hq": "Singapore / Bangkok"},
        {"name": "True Digital Innovation Lab", "type": "Telecom Tech Conglomerate", "hq": "Bangkok, Thailand"},
        {"name": "Agoda Tech Engineering Hub", "type": "Global Travel Tech Center", "hq": "Bangkok, Thailand"},
        {"name": "LINE MAN Wongnai Engineering", "type": "On-demand Platform", "hq": "Bangkok, Thailand"},
    ],
    "healthcare": [
        {"name": "King Chulalongkorn Memorial Hospital", "type": "University Tertiary Medical Center", "hq": "Bangkok, Thailand"},
        {"name": "Siriraj Hospital Medical Center", "type": "University Quaternary Referral Hospital", "hq": "Bangkok, Thailand"},
        {"name": "Bangkok Metropolitan Healthcare Trust", "type": "Private Healthcare Conglomerate", "hq": "Bangkok, Thailand"},
        {"name": "Pacific International Hospital", "type": "JCI-Accredited Medical Center", "hq": "Phuket / Bangkok, Thailand"},
        {"name": "Horizon Biomedical Research Institute", "type": "Clinical Trials & Genomics Lab", "hq": "Bangkok, Thailand"},
        {"name": "Siam Clinical Diagnostics Group", "type": "Specialized Pathology Lab", "hq": "Bangkok, Thailand"},
        {"name": "Apex Pharmaceutical & Health", "type": "Global Pharma Subsidiary", "hq": "Bangkok, Thailand"},
        {"name": "Vanguard Regional Hospital Network", "type": "Regional Healthcare Provider", "hq": "Chiang Mai, Thailand"},
    ],
    "finance": [
        {"name": "Siam Commercial Capital Group", "type": "Commercial Banking Leader", "hq": "Bangkok, Thailand"},
        {"name": "Krungthai Global Wealth Management", "type": "Asset & Wealth Advisory", "hq": "Bangkok, Thailand"},
        {"name": "Kasikorn Digital Investment & Securities", "type": "Investment Banking & Capital", "hq": "Bangkok, Thailand"},
        {"name": "Horizon Asset Management Asia", "type": "Private Equity & Fund House", "hq": "Singapore / Bangkok"},
        {"name": "Veritas Financial Auditing & Advisory", "type": "Statutory Audit & Tax Firm", "hq": "Bangkok, Thailand"},
        {"name": "Apex Securities & Derivatives", "type": "Securities Brokerage", "hq": "Bangkok, Thailand"},
        {"name": "Mekong Regional Capital Partners", "type": "Venture Debt & Growth Equity", "hq": "Bangkok, Thailand"},
        {"name": "Deloitte & Touche Southeast Asia", "type": "Big Four Professional Services", "hq": "Bangkok, Thailand"},
    ],
    "legal": [
        {"name": "Siam Pacific Legal Chambers", "type": "Corporate & Commercial Law Firm", "hq": "Bangkok, Thailand"},
        {"name": "Veritas & Partners International Law", "type": "M&A and Regulatory Counsel", "hq": "Bangkok, Thailand"},
        {"name": "ASEAN Commercial Arbitration Practice", "type": "Alternative Dispute Resolution Center", "hq": "Bangkok, Thailand"},
        {"name": "Metropolitan Regulatory & Compliance Council", "type": "Statutory Advisory Board", "hq": "Bangkok, Thailand"},
        {"name": "Lexis International Legal Associates", "type": "Intellectual Property & Cross-border Firm", "hq": "Singapore / Bangkok"},
        {"name": "Baker & Horizon Global Attorneys", "type": "International Law Network", "hq": "Bangkok, Thailand"},
    ],
    "engineering": [
        {"name": "Siam Premier Advanced Engineering", "type": "Industrial Automation & EPC", "hq": "Rayong / Bangkok, Thailand"},
        {"name": "Metropolis Energy & Infrastructure", "type": "Clean Energy & Grid Solutions", "hq": "Bangkok, Thailand"},
        {"name": "Pacific Industrial Automation Corp", "type": "Robotics & Smart Factory", "hq": "Chonburi (EEC), Thailand"},
        {"name": "Horizon Petrochemicals Southeast Asia", "type": "Refining & Polymer Manufacturing", "hq": "Rayong, Thailand"},
        {"name": "Thai Civil & Structural Engineering", "type": "Megaproject Construction Contractor", "hq": "Bangkok, Thailand"},
        {"name": "SCG Innovation & Building Tech", "type": "Industrial Materials Conglomerate", "hq": "Bangkok, Thailand"},
    ],
    "business": [
        {"name": "Central Omnichannel Retail Group", "type": "Retail & Department Store Conglomerate", "hq": "Bangkok, Thailand"},
        {"name": "CP Merchandising Global Network", "type": "Agro-Industrial & Food Multinational", "hq": "Bangkok, Thailand"},
        {"name": "Singha Continental Ventures", "type": "Beverage & Consumer Holdings", "hq": "Bangkok, Thailand"},
        {"name": "Minor International Hospitality Brands", "type": "Global Hotel & Lifestyle Operator", "hq": "Bangkok, Thailand"},
        {"name": "ThaiBev Strategic Operations", "type": "Regional Beverage & Logistics", "hq": "Bangkok, Thailand"},
        {"name": "McKinsey & Company Southeast Asia", "type": "Top-tier Management Consulting", "hq": "Bangkok, Thailand"},
        {"name": "Boston Consulting Group (BCG) Bangkok", "type": "Strategic Transformation Advisory", "hq": "Bangkok, Thailand"},
    ],
    "education": [
        {"name": "Thailand Advanced Science & Technology Institute", "type": "National Research Organization", "hq": "Pathum Thani, Thailand"},
        {"name": "Institute for Applied Policy Research", "type": "Public Policy & Economics Think Tank", "hq": "Bangkok, Thailand"},
        {"name": "National Data Science & AI Academy", "type": "Government Specialized Academy", "hq": "Bangkok, Thailand"},
        {"name": "Mekong Regional Research Consortium", "type": "Intergovernmental Academic Alliance", "hq": "Chiang Mai, Thailand"},
        {"name": "Southeast Asia Education Foundation", "type": "Philanthropic Higher Education Trust", "hq": "Bangkok, Thailand"},
    ],
    "creative": [
        {"name": "Ogilvy & Horizon Creative Thailand", "type": "Multinational Advertising Agency", "hq": "Bangkok, Thailand"},
        {"name": "Siam Interactive Media & Entertainment", "type": "Digital Content & Broadcasting Studio", "hq": "Bangkok, Thailand"},
        {"name": "PixelCraft Digital Experience Studios", "type": "UI/UX & Brand Design Agency", "hq": "Bangkok, Thailand"},
        {"name": "Bangkok Brand Visionaries", "type": "Strategic PR & Identity Advisory", "hq": "Bangkok, Thailand"},
        {"name": "Wonderframe Animation & VFX Labs", "type": "Motion Graphics & 3D Production Studio", "hq": "Bangkok, Thailand"},
    ],
}


# ==============================================================================
# 3. GEOGRAPHIC LOCATIONS & HUBS
# ==============================================================================

CITIES_THAI: List[str] = [
    "Bangkok (Bang Rak / Silom), Thailand",
    "Bangkok (Pathum Wan / Sukhumvit), Thailand",
    "Bangkok (Chatuchak / Phahonyothin), Thailand",
    "Bangkok (Sathorn Financial District), Thailand",
    "Nonthaburi, Thailand",
    "Pathum Thani (Thailand Science Park), Thailand",
    "Chiang Mai (Nimman Innovation Hub), Thailand",
    "Chonburi (Eastern Economic Corridor EEC), Thailand",
    "Rayong (Map Ta Phut Industrial Zone), Thailand",
    "Phuket (Smart City & Tourism Hub), Thailand",
    "Khon Kaen, Thailand",
    "Nakhon Ratchasima, Thailand",
    "Songkhla (Hat Yai Commercial Center), Thailand",
]

CITIES_GLOBAL: List[str] = [
    "Singapore (Marina Bay Financial Centre)",
    "Tokyo (Shibuya Tech Hub), Japan",
    "Seoul (Gangnam Innovation District), South Korea",
    "Hong Kong (Central Business District)",
    "Taipei (Neihu Technology Park), Taiwan",
    "London (Canary Wharf & Tech City), UK",
    "San Francisco / Silicon Valley (Bay Area), USA",
    "New York (Manhattan), USA",
    "Seattle (Pacific Northwest Tech Hub), USA",
    "Austin (Silicon Hills), USA",
    "Zurich (Swiss Financial Hub), Switzerland",
    "Berlin (Silicon Allee), Germany",
    "Amsterdam (Zuidas Business District), Netherlands",
    "Sydney (Barangaroo Commercial Center), Australia",
    "Melbourne (Docklands Innovation District), Australia",
    "Toronto (Financial District), Canada",
    "Bengaluru (Electronic City), India",
]

# Combined list for general pick
CITIES: List[str] = CITIES_THAI + CITIES_GLOBAL


# ==============================================================================
# 4. RESOLUTION HELPERS
# ==============================================================================

def get_institution_education(
    industry_key: str,
    seniority: str,
    language: str = "en",
    candidate_tier: str = "standard",
) -> Dict[str, Any]:
    """Selects an institution and associates realistic degree, field, honors, and graduation year."""
    lowered_sen = seniority.lower()
    is_student = any(k in lowered_sen for k in ["student", "undergraduate", "trainee", "entry", "fresh"])

    # Match industry key
    ind_key = industry_key.lower()
    matched_industry = "tech"
    for k in COMPANIES_BY_INDUSTRY.keys():
        if k in ind_key:
            matched_industry = k
            break

    # Filter universities: Thai vs International depending on language and randomness
    if language == "th" or (language == "mixed" and random.random() < 0.65):
        uni_pool = [u for u in UNIVERSITIES if u["country"] == "Thailand"]
    else:
        # English: mix of Thai (40%) and Prestigious Global (60%)
        uni_pool = UNIVERSITIES

    uni = random.choice(uni_pool)
    degrees_map = uni.get("default_degrees", {})
    degree_text = degrees_map.get(matched_industry, f"Bachelor of Science in {industry_key.title()}")

    # Determine graduation year based on seniority
    if is_student:
        grad_year = 2024
        gpa = round(random.uniform(3.45, 3.98), 2)
        honors = "First Class Honors (เกียรตินิยมอันดับ 1)" if gpa >= 3.60 else "Second Class Honors"
    else:
        grad_year = 2026 - random.randint(3, 12)
        gpa = round(random.uniform(3.20, 3.95), 2)
        honors = "First Class Honors" if gpa >= 3.65 else ("Second Class Honors" if gpa >= 3.40 else None)

    return {
        "institution": uni["name"],
        "institution_th": uni.get("name_th"),
        "country": uni["country"],
        "degree": degree_text,
        "field": f"{industry_key.title()} Specialized Studies",
        "graduation_year": grad_year,
        "gpa": gpa,
        "honors": honors,
    }


def get_random_company(industry_key: str, prefer_local: bool = True) -> Dict[str, str]:
    """Retrieves a realistic company for work history based on industry."""
    ind_key = industry_key.lower()
    matched_key = "tech"
    for k in COMPANIES_BY_INDUSTRY.keys():
        if k in ind_key:
            matched_key = k
            break

    pool = COMPANIES_BY_INDUSTRY.get(matched_key, COMPANIES_BY_INDUSTRY["tech"])
    return random.choice(pool)


def get_random_location(prefer_thailand: bool = True) -> str:
    """Retrieves a realistic location with city and hub details."""
    if prefer_thailand or random.random() < 0.65:
        return random.choice(CITIES_THAI)
    return random.choice(CITIES_GLOBAL)
