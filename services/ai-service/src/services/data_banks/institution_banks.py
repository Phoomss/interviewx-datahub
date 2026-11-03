"""Universities, Companies, Organizations, and Geographic Locations Banks.

Provides rich, realistic institutions for high-fidelity synthetic profiles,
resumes, and organizational contexts across Thai (all 120+ accredited universities),
Regional ASEAN, and Global markets (top 50+ world-class institutions).
"""

import random
from typing import Any, Dict, List, Optional

# ==============================================================================
# 0. INDUSTRY DEFAULT DEGREE TITLES MAPPING (15 UNIVERSAL INDUSTRIES)
# ==============================================================================

INDUSTRY_DEFAULT_DEGREES: Dict[str, str] = {
    "tech": "Bachelor of Science in Computer Science and Information Technology",
    "finance": "Bachelor of Business Administration in Finance and Banking",
    "healthcare": "Bachelor of Science in Nursing / Allied Health Sciences",
    "engineering": "Bachelor of Engineering (Electrical / Mechanical / Civil)",
    "business": "Bachelor of Business Administration (B.B.A.) in Management",
    "education": "Bachelor of Education (B.Ed.) in Educational Innovation",
    "legal": "Bachelor of Laws (LL.B.) in Commercial & Statutory Law",
    "creative": "Bachelor of Fine Arts in Communication Design and Digital Media",
    "hospitality": "Bachelor of Arts in Hospitality and Tourism Management",
    "science": "Bachelor of Science in Applied Sciences and Biotechnology",
    "agriculture": "Bachelor of Science in Agricultural Technology and Agronomy",
    "logistics": "Bachelor of Science in Logistics and Supply Chain Management",
    "architecture": "Bachelor of Architecture (B.Arch) and Spatial Design",
    "environment": "Bachelor of Science in Environmental Science and Clean Energy",
    "social_dev": "Bachelor of Arts in Social Development and Public Policy",
}


# ==============================================================================
# 1. THAI UNIVERSITIES BANK (ครบทุกสถาบันอุดมศึกษาในประเทศไทย)
# ==============================================================================

THAI_UNIVERSITIES: List[Dict[str, Any]] = [
    # --------------------------------------------------------------------------
    # 1.1 มหาวิทยาลัยในกำกับของรัฐ / มหาวิทยาลัยรัฐบาล (Autonomous & Government)
    # --------------------------------------------------------------------------
    {
        "name": "Chulalongkorn University",
        "name_th": "จุฬาลงกรณ์มหาวิทยาลัย",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top National Flagship",
        "province": "Bangkok",
        "default_degrees": {
            "tech": "Bachelor of Engineering (Computer Engineering)",
            "healthcare": "Doctor of Medicine (M.D.) / Bachelor of Science (Pharmacy)",
            "business": "Bachelor of Business Administration (BBA International Program)",
            "finance": "Bachelor of Accountancy / Finance",
            "legal": "Bachelor of Laws (LL.B.)",
            "engineering": "Bachelor of Engineering (Mechanical / Electrical / Civil)",
            "education": "Bachelor of Education / Master of Education",
            "creative": "Bachelor of Fine and Applied Arts / Communication Arts",
            "science": "Bachelor of Science in Biotechnology / Chemistry",
            "architecture": "Bachelor of Architecture (Chula Arch)",
        },
    },
    {
        "name": "Mahidol University",
        "name_th": "มหาวิทยาลัยมหิดล",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top National Flagship (Medical & Sciences)",
        "province": "Nakhon Pathom / Bangkok",
        "default_degrees": {
            "tech": "Bachelor of Science in Information and Communication Technology (ICT Mahidol)",
            "healthcare": "Doctor of Medicine (M.D., Siriraj / Ramathibodi)",
            "business": "Bachelor of Management (College of Management CMMU)",
            "finance": "Bachelor of Science in Actuarial Science",
            "legal": "Master of Arts in Health Law and Bioethics",
            "engineering": "Bachelor of Engineering (Biomedical Engineering)",
            "education": "Master of Science in Science and Technology Education",
            "creative": "Bachelor of Arts in Music and Entertainment Technology",
            "science": "Bachelor of Science in Molecular Biology & Genomics",
            "environment": "Bachelor of Science in Environmental Science and Technology",
        },
    },
    {
        "name": "Thammasat University",
        "name_th": "มหาวิทยาลัยธรรมศาสตร์",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top National Flagship (Law, Business, Humanities & Tech)",
        "province": "Bangkok / Pathum Thani",
        "default_degrees": {
            "tech": "Bachelor of Science in Software Engineering / Computer Science",
            "healthcare": "Doctor of Medicine (M.D.) / Bachelor of Public Health",
            "business": "Bachelor of Business Administration (BBA Thammasat)",
            "finance": "Bachelor of Science in Finance and Banking",
            "legal": "Bachelor of Laws (LL.B. Commercial & International Law)",
            "engineering": "Bachelor of Engineering (TEPE / TEP International)",
            "education": "Master of Learning Sciences and Educational Innovation",
            "creative": "Bachelor of Arts in Journalism and Mass Communication",
            "social_dev": "Bachelor of Political Science in International Relations",
        },
    },
    {
        "name": "Kasetsart University",
        "name_th": "มหาวิทยาลัยเกษตรศาสตร์",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top National Flagship (Engineering, Agriculture & Sciences)",
        "province": "Bangkok",
        "default_degrees": {
            "tech": "Bachelor of Engineering (Computer Engineering)",
            "healthcare": "Doctor of Veterinary Medicine (D.V.M.)",
            "business": "Bachelor of Business Administration (Marketing / Logistics)",
            "finance": "Bachelor of Economics (Applied Economics)",
            "legal": "Bachelor of Laws (LL.B.)",
            "engineering": "Bachelor of Engineering (Industrial / Chemical / Mechanical)",
            "agriculture": "Bachelor of Science in Agronomy and Smart Agrotechnology",
            "logistics": "Bachelor of Science in Maritime Transportation and Logistics",
            "environment": "Bachelor of Science in Forestry and Environmental Ecology",
        },
    },
    {
        "name": "Chiang Mai University",
        "name_th": "มหาวิทยาลัยเชียงใหม่",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top Regional Northern Flagship",
        "province": "Chiang Mai",
        "default_degrees": {
            "tech": "Bachelor of Science (Data Science & Software Engineering)",
            "healthcare": "Doctor of Medicine (M.D.) / Bachelor of Pharmacy",
            "business": "Bachelor of Business Administration (International Business)",
            "finance": "Bachelor of Economics (Monetary and Financial Economics)",
            "legal": "Bachelor of Laws (LL.B.)",
            "engineering": "Bachelor of Engineering (Environmental / Mechanical)",
            "education": "Bachelor of Education (Secondary Education)",
            "creative": "Bachelor of Fine Arts (Visual Arts & Digital Media)",
            "agriculture": "Bachelor of Science in Agro-Industry and Food Science",
        },
    },
    {
        "name": "Khon Kaen University",
        "name_th": "มหาวิทยาลัยขอนแก่น",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top Regional Northeastern Flagship",
        "province": "Khon Kaen",
        "default_degrees": {
            "tech": "Bachelor of Science (Computer Science / Artificial Intelligence)",
            "healthcare": "Doctor of Medicine (Srinagarind Hospital Medical School)",
            "business": "Bachelor of Business Administration (Global Business)",
            "finance": "Bachelor of Accountancy",
            "legal": "Bachelor of Laws (LL.B.)",
            "engineering": "Bachelor of Engineering (Civil / Agricultural Engineering)",
            "education": "Master of Education in Educational Technology",
            "creative": "Bachelor of Fine and Applied Arts (Creative Design)",
            "agriculture": "Bachelor of Science in Agricultural Biotechnology",
        },
    },
    {
        "name": "Prince of Songkla University",
        "name_th": "มหาวิทยาลัยสงขลานครินทร์",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top Regional Southern Flagship",
        "province": "Songkhla",
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
        "name": "Silpakorn University",
        "name_th": "มหาวิทยาลัยศิลปากร",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top National (Fine Arts, Architecture & Humanities)",
        "province": "Bangkok / Nakhon Pathom",
        "default_degrees": {
            "creative": "Bachelor of Fine Arts (Painting, Sculpture and Graphic Arts)",
            "architecture": "Bachelor of Architecture (Thai & Contemporary Architecture)",
            "tech": "Bachelor of Science in Digital Media and Interactive Design",
            "healthcare": "Bachelor of Pharmacy (Pharm.D.)",
            "business": "Bachelor of Business Administration (Hotel & Tourism)",
            "engineering": "Bachelor of Engineering (Petrochemicals and Materials)",
        },
    },
    {
        "name": "Srinakharinwirot University",
        "name_th": "มหาวิทยาลัยศรีนครินทรวิโรฒ (มศว)",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top National (Education, Medicine & Arts)",
        "province": "Bangkok / Nakhon Nayok",
        "default_degrees": {
            "tech": "Bachelor of Science (Computer Science / Data Engineering)",
            "healthcare": "Doctor of Medicine / Bachelor of Physical Therapy",
            "business": "Bachelor of Business Administration (Tourism & Hospitality)",
            "education": "Bachelor of Education (Secondary School Pedagogy)",
            "creative": "Bachelor of Arts in Performing Arts and Creative Communication",
            "engineering": "Bachelor of Engineering (Biomedical Engineering)",
        },
    },
    {
        "name": "Burapha University",
        "name_th": "มหาวิทยาลัยบูรพา",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Eastern Economic Corridor (EEC) Flagship",
        "province": "Chonburi",
        "default_degrees": {
            "logistics": "Bachelor of Science in Logistics and Maritime Commerce",
            "tech": "Bachelor of Science in Informatics and Data Science",
            "healthcare": "Bachelor of Nursing Science / Doctor of Medicine",
            "engineering": "Bachelor of Engineering (Chemical & Materials Engineering)",
            "business": "Bachelor of Business Administration in International Business",
        },
    },
    {
        "name": "Naresuan University",
        "name_th": "มหาวิทยาลัยนเรศวร",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Lower Northern Flagship",
        "province": "Phitsanulok",
        "default_degrees": {
            "healthcare": "Doctor of Medicine / Bachelor of Pharmacy",
            "engineering": "Bachelor of Engineering (Energy & Automation)",
            "tech": "Bachelor of Science in Computer Science",
            "business": "Bachelor of Business Administration",
            "agriculture": "Bachelor of Science in Food Science and Technology",
        },
    },
    {
        "name": "Mae Fah Luang University",
        "name_th": "มหาวิทยาลัยแม่ฟ้าหลวง",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top Northern (All English Medium)",
        "province": "Chiang Rai",
        "default_degrees": {
            "tech": "Bachelor of Science in Software Engineering (English Program)",
            "business": "Bachelor of Business Administration in Aviation Business",
            "healthcare": "Bachelor of Science in Cosmetic Science",
            "legal": "Bachelor of Laws (International Commercial Law)",
            "creative": "Bachelor of Arts in Digital and Broadcast Communication",
        },
    },
    {
        "name": "Maejo University",
        "name_th": "มหาวิทยาลัยแม่โจ้",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Pioneer Agricultural & Green Tech University",
        "province": "Chiang Mai",
        "default_degrees": {
            "agriculture": "Bachelor of Science in Organic Agriculture and Crop Production",
            "tech": "Bachelor of Science in Agri-Informatics",
            "environment": "Bachelor of Science in Natural Resources and Environmental Conservation",
            "business": "Bachelor of Business Administration in Agricultural Economics",
        },
    },
    {
        "name": "Walailak University",
        "name_th": "มหาวิทยาลัยวลัยลักษณ์",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Southern Research University Flagship",
        "province": "Nakhon Si Thammarat",
        "default_degrees": {
            "healthcare": "Doctor of Medicine / Bachelor of Medical Technology",
            "tech": "Bachelor of Science in Information Technology",
            "engineering": "Bachelor of Engineering (Petroleum and Smart Mining)",
            "agriculture": "Bachelor of Science in Tropical Marine Ecosystems",
        },
    },
    {
        "name": "University of Phayao",
        "name_th": "มหาวิทยาลัยพะเยา",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Regional Comprehensive Public",
        "province": "Phayao",
    },
    {
        "name": "Thaksin University",
        "name_th": "มหาวิทยาลัยทักษิณ",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Southern Educational & Humanities Flagship",
        "province": "Songkhla / Phatthalung",
    },
    {
        "name": "Ubon Ratchathani University",
        "name_th": "มหาวิทยาลัยอุบลราชธานี",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Mekong Subregion Flagship",
        "province": "Ubon Ratchathani",
    },
    {
        "name": "Mahasarakham University",
        "name_th": "มหาวิทยาลัยมหาสารคาม",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Northeastern Educational & Cultural Hub",
        "province": "Maha Sarakham",
    },
    {
        "name": "National Institute of Development Administration",
        "name_th": "สถาบันบัณฑิตพัฒนบริหารศาสตร์ (นิด้า)",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "National Graduate School Flagship",
        "province": "Bangkok",
        "default_degrees": {
            "tech": "Master of Science in Business Analytics and Data Science",
            "business": "Master of Business Administration (NIDA MBA)",
            "finance": "Master of Science in Financial Risk Management",
            "legal": "Master of Laws (LL.M. in International Business Law)",
            "education": "Doctor of Philosophy in Human Resource and Organization Development",
        },
    },
    {
        "name": "Ramkhamhaeng University",
        "name_th": "มหาวิทยาลัยรามคำแหง",
        "country": "Thailand",
        "category": "Open Government University",
        "tier": "Largest Open National University",
        "province": "Bangkok",
        "default_degrees": {
            "legal": "Bachelor of Laws (LL.B., Faculty of Law)",
            "business": "Bachelor of Business Administration (General Management)",
            "education": "Bachelor of Education (Curriculum & Instruction)",
            "finance": "Bachelor of Economics (Public Finance)",
        },
    },
    {
        "name": "Sukhothai Thammathirat Open University",
        "name_th": "มหาวิทยาลัยสุโขทัยธรรมาธิราช",
        "country": "Thailand",
        "category": "Open Government University",
        "tier": "National Distance Learning University",
        "province": "Nonthaburi",
    },
    {
        "name": "Princess of Naradhiwas University",
        "name_th": "มหาวิทยาลัยนราธิวาสราชนครินทร์",
        "country": "Thailand",
        "category": "Government Public",
        "tier": "Deep South Public University",
        "province": "Narathiwat",
    },
    {
        "name": "Nakhon Phanom University",
        "name_th": "มหาวิทยาลัยนครพนม",
        "country": "Thailand",
        "category": "Government Public",
        "tier": "Border Trade & Aviation Public",
        "province": "Nakhon Phanom",
    },
    {
        "name": "Kalasin University",
        "name_th": "มหาวิทยาลัยกาฬสินธุ์",
        "country": "Thailand",
        "category": "Government Public",
        "tier": "Northeastern Development Public",
        "province": "Kalasin",
    },
    {
        "name": "Chulabhorn Royal Academy",
        "name_th": "ราชวิทยาลัยจุฬาภรณ์",
        "country": "Thailand",
        "category": "Specialized Public",
        "tier": "National Medical & Cancer Research Hub",
        "province": "Bangkok",
        "default_degrees": {
            "healthcare": "Doctor of Medicine (M.D., Princess Srisavangavadhana College)",
            "science": "Master of Science in Molecular Toxicology and Cancer Biology",
        },
    },
    {
        "name": "Chitralada Technology Institute",
        "name_th": "สถาบันเทคโนโลยีจิตรลดา",
        "country": "Thailand",
        "category": "Specialized Public",
        "tier": "Royal Vocational & Technology Institute",
        "province": "Bangkok",
    },
    {
        "name": "Princess Galyani Vadhana Institute of Music",
        "name_th": "สถาบันดนตรีกัลยาณิวัฒนา",
        "country": "Thailand",
        "category": "Specialized Public",
        "tier": "Classical Music Conservatoire",
        "province": "Bangkok",
    },
    {
        "name": "Srisavarindhira Thai Red Cross Institute of Nursing",
        "name_th": "สถาบันการพยาบาลศรีสวรินทิรา สภากาชาดไทย",
        "country": "Thailand",
        "category": "Specialized Public",
        "tier": "Premier Nursing College",
        "province": "Bangkok",
    },
    {
        "name": "Praboromarajchanok Institute",
        "name_th": "สถาบันพระบรมราชชนก",
        "country": "Thailand",
        "category": "Specialized Public",
        "tier": "Public Health & Nursing Network",
        "province": "Nonthaburi",
    },
    {
        "name": "Thailand National Sports University",
        "name_th": "มหาวิทยาลัยการกีฬาแห่งชาติ",
        "country": "Thailand",
        "category": "Specialized Public",
        "tier": "National Sports & Athletics University",
        "province": "Chonburi",
    },
    {
        "name": "Bunditpatanasilpa Institute",
        "name_th": "สถาบันบัณฑิตพัฒนศิลป์",
        "country": "Thailand",
        "category": "Specialized Public",
        "tier": "Thai Classical Fine Arts & Performing Arts",
        "province": "Bangkok",
    },

    # --------------------------------------------------------------------------
    # 1.2 สถาบันเทคโนโลยีพระจอมเกล้า (King Mongkut's Institutes of Technology)
    # --------------------------------------------------------------------------
    {
        "name": "King Mongkut's University of Technology Thonburi",
        "name_th": "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (มจธ. / บางมด)",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top Tech & Engineering Flagship",
        "province": "Bangkok",
        "default_degrees": {
            "tech": "Bachelor of Science in Computer Science / Information Technology",
            "engineering": "Bachelor of Engineering (Robotics / Automation / Mechatronics)",
            "architecture": "Bachelor of Architecture (School of Architecture and Design - SoA+D)",
            "environment": "Master of Science in Energy Technology and Clean Systems",
            "science": "Bachelor of Science in Applied Physics / Microbiology",
        },
    },
    {
        "name": "King Mongkut's Institute of Technology Ladkrabang",
        "name_th": "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง (สจล.)",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top Tech & Engineering Flagship",
        "province": "Bangkok",
        "default_degrees": {
            "tech": "Bachelor of Engineering (Computer Innovation Engineering / AI)",
            "engineering": "Bachelor of Engineering (Electrical & Telecommunication)",
            "healthcare": "Doctor of Medicine (International Medical College KMITL)",
            "architecture": "Bachelor of Architecture (Industrial Design)",
            "finance": "Bachelor of Science in Financial Engineering",
        },
    },
    {
        "name": "King Mongkut's University of Technology North Bangkok",
        "name_th": "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ (มจพ.)",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "Top Tech & Industrial Engineering Flagship",
        "province": "Bangkok / Rayong / Prachinburi",
        "default_degrees": {
            "engineering": "Bachelor of Engineering (Mechanical / Automotive / Aerospace)",
            "tech": "Bachelor of Science in Computer and Information Science",
            "business": "Bachelor of Business Administration in Industrial Management",
        },
    },
    {
        "name": "Suranaree University of Technology",
        "name_th": "มหาวิทยาลัยเทคโนโลยีสุรนารี (มทส.)",
        "country": "Thailand",
        "category": "Autonomous Public",
        "tier": "National Science & Advanced Engineering Hub",
        "province": "Nakhon Ratchasima",
        "default_degrees": {
            "engineering": "Bachelor of Engineering (Geotechnology / Mechatronics)",
            "healthcare": "Doctor of Medicine / Bachelor of Nursing Science",
            "tech": "Bachelor of Science in Computer Engineering and Digital Systems",
            "agriculture": "Bachelor of Science in Animal Science and Biotechnology",
        },
    },
    {
        "name": "Vidyasirimedhi Institute of Science and Technology",
        "name_th": "สถาบันวิทยสิริเมธี (VISTEC)",
        "country": "Thailand",
        "category": "Advanced Postgraduate Research",
        "tier": "World-Class Frontier Research Institute",
        "province": "Rayong (EECi)",
        "default_degrees": {
            "tech": "Doctor of Philosophy in Information Science and Technology (IST)",
            "engineering": "Master of Engineering in Chemical Engineering (ChE)",
            "science": "Doctor of Philosophy in Biomolecular Science and Engineering (BSE)",
            "environment": "Doctor of Philosophy in Materials Science and Energy (MSE)",
        },
    },
    {
        "name": "Asian Institute of Technology",
        "name_th": "สถาบันเทคโนโลยีแห่งเอเชีย (AIT)",
        "country": "Thailand",
        "category": "International Postgraduate",
        "tier": "Intergovernmental Postgraduate Institute",
        "province": "Pathum Thani",
        "default_degrees": {
            "engineering": "Master of Engineering in Structural & Geotechnical Engineering",
            "tech": "Master of Science in Artificial Intelligence and Computer Science",
            "environment": "Master of Science in Environmental Engineering and Management",
            "business": "Master of Business Administration (AIT School of Management)",
        },
    },

    # --------------------------------------------------------------------------
    # 1.3 กลุ่มมหาวิทยาลัยเทคโนโลยีราชมงคล (ครบทั้ง 9 แห่ง)
    # --------------------------------------------------------------------------
    {
        "name": "Rajamangala University of Technology Thanyaburi",
        "name_th": "มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี (มทร.ธัญบุรี)",
        "country": "Thailand",
        "category": "Rajamangala University",
        "tier": "Leading Rajamangala Flagship",
        "province": "Pathum Thani",
    },
    {
        "name": "Rajamangala University of Technology Krungthep",
        "name_th": "มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ (มทร.กรุงเทพ)",
        "country": "Thailand",
        "category": "Rajamangala University",
        "tier": "Metropolitan Technical University",
        "province": "Bangkok",
    },
    {
        "name": "Rajamangala University of Technology Tawan-ok",
        "name_th": "มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก (มทร.ตะวันออก)",
        "country": "Thailand",
        "category": "Rajamangala University",
        "tier": "Eastern Regional Technical Hub",
        "province": "Chonburi",
    },
    {
        "name": "Rajamangala University of Technology Phra Nakhon",
        "name_th": "มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร (มทร.พระนคร)",
        "country": "Thailand",
        "category": "Rajamangala University",
        "tier": "Central Technical & Creative Hub",
        "province": "Bangkok",
    },
    {
        "name": "Rajamangala University of Technology Rattanakosin",
        "name_th": "มหาวิทยาลัยเทคโนโลยีราชมงคลรัตนโกสินทร์ (มทร.รัตนโกสินทร์)",
        "country": "Thailand",
        "category": "Rajamangala University",
        "tier": "Technical & Creative Arts Hub",
        "province": "Nakhon Pathom",
    },
    {
        "name": "Rajamangala University of Technology Lanna",
        "name_th": "มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา (มทร.ล้านนา)",
        "country": "Thailand",
        "category": "Rajamangala University",
        "tier": "Northern Regional Technical Hub",
        "province": "Chiang Mai",
    },
    {
        "name": "Rajamangala University of Technology Srivijaya",
        "name_th": "มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย (มทร.ศรีวิชัย)",
        "country": "Thailand",
        "category": "Rajamangala University",
        "tier": "Southern Regional Technical Hub",
        "province": "Songkhla",
    },
    {
        "name": "Rajamangala University of Technology Suvarnabhumi",
        "name_th": "มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ (มทร.สุวรรณภูมิ)",
        "country": "Thailand",
        "category": "Rajamangala University",
        "tier": "Central Logistics & Agro Hub",
        "province": "Phra Nakhon Si Ayutthaya",
    },
    {
        "name": "Rajamangala University of Technology Isan",
        "name_th": "มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน (มทร.อีสาน)",
        "country": "Thailand",
        "category": "Rajamangala University",
        "tier": "Northeastern Regional Technical Hub",
        "province": "Nakhon Ratchasima",
    },

    # --------------------------------------------------------------------------
    # 1.4 กลุ่มมหาวิทยาลัยราชภัฏ (ครบทั้ง 38 แห่ง)
    # --------------------------------------------------------------------------
    {"name": "Suan Dusit University", "name_th": "มหาวิทยาลัยสวนดุสิต", "country": "Thailand", "category": "Rajabhat University", "province": "Bangkok"},
    {"name": "Suan Sunandha Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏสวนสุนันทา", "country": "Thailand", "category": "Rajabhat University", "province": "Bangkok"},
    {"name": "Chandrakasem Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏจันทรเกษม", "country": "Thailand", "category": "Rajabhat University", "province": "Bangkok"},
    {"name": "Bansomdejchaopraya Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏบ้านสมเด็จเจ้าพระยา", "country": "Thailand", "category": "Rajabhat University", "province": "Bangkok"},
    {"name": "Dhonburi Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏธนบุรี", "country": "Thailand", "category": "Rajabhat University", "province": "Bangkok"},
    {"name": "Phranakhon Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏพระนคร", "country": "Thailand", "category": "Rajabhat University", "province": "Bangkok"},
    {"name": "Valaya Alongkorn Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏวไลยอลงกรณ์ ในพระบรมราชูปถัมภ์", "country": "Thailand", "category": "Rajabhat University", "province": "Pathum Thani"},
    {"name": "Phranakhon Si Ayutthaya Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏพระนครศรีอยุธยา", "country": "Thailand", "category": "Rajabhat University", "province": "Phra Nakhon Si Ayutthaya"},
    {"name": "Rambhai Barni Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏรำไพพรรณี", "country": "Thailand", "category": "Rajabhat University", "province": "Chanthaburi"},
    {"name": "Rajabhat Rajanagarindra University", "name_th": "มหาวิทยาลัยราชภัฏราชนครินทร์", "country": "Thailand", "category": "Rajabhat University", "province": "Chachoengsao"},
    {"name": "Thepsatri Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏเทพสตรี", "country": "Thailand", "category": "Rajabhat University", "province": "Lopburi"},
    {"name": "Nakhon Pathom Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏนครปฐม", "country": "Thailand", "category": "Rajabhat University", "province": "Nakhon Pathom"},
    {"name": "Phetchaburi Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏเพชรบุรี", "country": "Thailand", "category": "Rajabhat University", "province": "Phetchaburi"},
    {"name": "Kanchanaburi Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏกาญจนบุรี", "country": "Thailand", "category": "Rajabhat University", "province": "Kanchanaburi"},
    {"name": "Muban Chombueng Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏหมู่บ้านจอมบึง", "country": "Thailand", "category": "Rajabhat University", "province": "Ratchaburi"},
    {"name": "Chiang Mai Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏเชียงใหม่", "country": "Thailand", "category": "Rajabhat University", "province": "Chiang Mai"},
    {"name": "Chiang Rai Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏเชียงราย", "country": "Thailand", "category": "Rajabhat University", "province": "Chiang Rai"},
    {"name": "Lampang Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏลำปาง", "country": "Thailand", "category": "Rajabhat University", "province": "Lampang"},
    {"name": "Uttaradit Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏอุตรดิตถ์", "country": "Thailand", "category": "Rajabhat University", "province": "Uttaradit"},
    {"name": "Pibulsongkram Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏพิบูลสงคราม", "country": "Thailand", "category": "Rajabhat University", "province": "Phitsanulok"},
    {"name": "Kamphaeng Phet Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏกำแพงเพชร", "country": "Thailand", "category": "Rajabhat University", "province": "Kamphaeng Phet"},
    {"name": "Nakhon Sawan Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏนครสวรรค์", "country": "Thailand", "category": "Rajabhat University", "province": "Nakhon Sawan"},
    {"name": "Phetchabun Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏเพชรบูรณ์", "country": "Thailand", "category": "Rajabhat University", "province": "Phetchabun"},
    {"name": "Nakhon Ratchasima Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏนครราชสีมา", "country": "Thailand", "category": "Rajabhat University", "province": "Nakhon Ratchasima"},
    {"name": "Buriram Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏบุรีรัมย์", "country": "Thailand", "category": "Rajabhat University", "province": "Buriram"},
    {"name": "Surindra Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏสุรินทร์", "country": "Thailand", "category": "Rajabhat University", "province": "Surin"},
    {"name": "Sisaket Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏศรีสะเกษ", "country": "Thailand", "category": "Rajabhat University", "province": "Sisaket"},
    {"name": "Ubon Ratchathani Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏอุบลราชธานี", "country": "Thailand", "category": "Rajabhat University", "province": "Ubon Ratchathani"},
    {"name": "Udon Thani Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏอุดรธานี", "country": "Thailand", "category": "Rajabhat University", "province": "Udon Thani"},
    {"name": "Sakon Nakhon Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏสกลนคร", "country": "Thailand", "category": "Rajabhat University", "province": "Sakon Nakhon"},
    {"name": "Loei Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏเลย", "country": "Thailand", "category": "Rajabhat University", "province": "Loei"},
    {"name": "Rajabhat Maha Sarakham University", "name_th": "มหาวิทยาลัยราชภัฏมหาสารคาม", "country": "Thailand", "category": "Rajabhat University", "province": "Maha Sarakham"},
    {"name": "Roi Et Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏร้อยเอ็ด", "country": "Thailand", "category": "Rajabhat University", "province": "Roi Et"},
    {"name": "Chaiyaphum Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏชัยภูมิ", "country": "Thailand", "category": "Rajabhat University", "province": "Chaiyaphum"},
    {"name": "Surat Thani Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏสุราษฎร์ธานี", "country": "Thailand", "category": "Rajabhat University", "province": "Surat Thani"},
    {"name": "Nakhon Si Thammarat Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏนครศรีธรรมราช", "country": "Thailand", "category": "Rajabhat University", "province": "Nakhon Si Thammarat"},
    {"name": "Phuket Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏภูเก็ต", "country": "Thailand", "category": "Rajabhat University", "province": "Phuket"},
    {"name": "Songkhla Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏสงขลา", "country": "Thailand", "category": "Rajabhat University", "province": "Songkhla"},
    {"name": "Yala Rajabhat University", "name_th": "มหาวิทยาลัยราชภัฏยะลา", "country": "Thailand", "category": "Rajabhat University", "province": "Yala"},

    # --------------------------------------------------------------------------
    # 1.5 มหาวิทยาลัยสงฆ์ (Buddhist Universities)
    # --------------------------------------------------------------------------
    {
        "name": "Mahachulalongkornrajavidyalaya University",
        "name_th": "มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย (มจร)",
        "country": "Thailand",
        "category": "Buddhist University",
        "province": "Phra Nakhon Si Ayutthaya",
    },
    {
        "name": "Mahamakut Buddhist University",
        "name_th": "มหาวิทยาลัยมหามกุฏราชวิทยาลัย (มมร)",
        "country": "Thailand",
        "category": "Buddhist University",
        "province": "Nakhon Pathom",
    },

    # --------------------------------------------------------------------------
    # 1.6 สถาบันอุดมศึกษาเอกชนในประเทศไทย (Private Universities & Colleges)
    # --------------------------------------------------------------------------
    {
        "name": "Assumption University",
        "name_th": "มหาวิทยาลัยอัสสัมชัญ (เอแบค)",
        "country": "Thailand",
        "category": "Private University",
        "tier": "Top International Private",
        "province": "Samut Prakan / Bangkok",
        "default_degrees": {
            "business": "Bachelor of Business Administration (Martin de Tours School of Management)",
            "tech": "Bachelor of Science in Computer Science (Vincent Mary School)",
            "finance": "Bachelor of Business Administration in Finance and Banking",
            "legal": "Bachelor of Laws (LL.B. Bilingual Program)",
            "creative": "Bachelor of Arts in Visual Communication Arts",
        },
    },
    {
        "name": "Bangkok University",
        "name_th": "มหาวิทยาลัยกรุงเทพ",
        "country": "Thailand",
        "category": "Private University",
        "tier": "Leading Creative & Entrepreneurship Private",
        "province": "Pathum Thani / Bangkok",
        "default_degrees": {
            "creative": "Bachelor of Communication Arts (Film and Digital Media)",
            "business": "Bachelor of Business Administration in Entrepreneurship (BUSEM)",
            "tech": "Bachelor of Science in Game Design and Interactive Media",
            "hospitality": "Bachelor of Arts in International Tourism and Hotel Management",
        },
    },
    {
        "name": "University of the Thai Chamber of Commerce",
        "name_th": "มหาวิทยาลัยหอการค้าไทย (UTCC)",
        "country": "Thailand",
        "category": "Private University",
        "tier": "Pioneer Trade, Commerce & Business University",
        "province": "Bangkok",
        "default_degrees": {
            "business": "Bachelor of Business Administration (International Business)",
            "finance": "Bachelor of Accountancy / Economics",
            "logistics": "Bachelor of Science in Logistics Management",
            "tech": "Bachelor of Science in Digital Technology and Innovation",
        },
    },
    {
        "name": "Rangsit University",
        "name_th": "มหาวิทยาลัยรังสิต",
        "country": "Thailand",
        "category": "Private University",
        "tier": "Comprehensive Private University",
        "province": "Pathum Thani",
        "default_degrees": {
            "healthcare": "Doctor of Medicine / Doctor of Dental Surgery / Doctor of Pharmacy",
            "tech": "Bachelor of Science in Cybersecurity and Ethical Hacking",
            "creative": "Bachelor of Arts in Digital Arts and Animation",
            "engineering": "Bachelor of Engineering (Aviation Engineering and Pilot Training)",
        },
    },
    {
        "name": "Sripatum University",
        "name_th": "มหาวิทยาลัยศรีปทุม",
        "country": "Thailand",
        "category": "Private University",
        "tier": "Digital Tech & Modern Business Private",
        "province": "Bangkok",
        "default_degrees": {
            "tech": "Bachelor of Science in Digital Media and Interactive Games",
            "logistics": "Bachelor of Business Administration in Supply Chain Management",
            "architecture": "Bachelor of Architecture (Interior Architecture)",
        },
    },
    {
        "name": "Dhurakij Pundit University",
        "name_th": "มหาวิทยาลัยธุรกิจบัณฑิตย์ (DPU)",
        "country": "Thailand",
        "category": "Private University",
        "tier": "Business & Creative Startup Private",
        "province": "Bangkok",
    },
    {
        "name": "Kasem Bundit University",
        "name_th": "มหาวิทยาลัยเกษมบัณฑิต",
        "country": "Thailand",
        "category": "Private University",
        "province": "Bangkok",
    },
    {
        "name": "Siam University",
        "name_th": "มหาวิทยาลัยสยาม",
        "country": "Thailand",
        "category": "Private University",
        "province": "Bangkok",
        "default_degrees": {
            "healthcare": "Doctor of Medicine (M.D., Faculty of Medicine)",
            "business": "Bachelor of Business Administration",
            "tech": "Bachelor of Science in Artificial Intelligence",
        },
    },
    {
        "name": "Payap University",
        "name_th": "มหาวิทยาลัยพายัพ",
        "country": "Thailand",
        "category": "Private University",
        "province": "Chiang Mai",
    },
    {
        "name": "Huachiew Chalermprakiet University",
        "name_th": "มหาวิทยาลัยหัวเฉียวเฉลิมพระเกียรติ",
        "country": "Thailand",
        "category": "Private University",
        "province": "Samut Prakan",
        "default_degrees": {
            "healthcare": "Bachelor of Traditional Chinese Medicine (TCM) / Pharmacy",
            "business": "Bachelor of Business Administration in Chinese Business Studies",
        },
    },
    {
        "name": "Krirk University",
        "name_th": "มหาวิทยาลัยเกริก",
        "country": "Thailand",
        "category": "Private University",
        "province": "Bangkok",
    },
    {
        "name": "Rattana Bundit University",
        "name_th": "มหาวิทยาลัยรัตนบัณฑิต (RBAC)",
        "country": "Thailand",
        "category": "Private University",
        "province": "Bangkok",
    },
    {
        "name": "Thonburi University",
        "name_th": "มหาวิทยาลัยธนบุรี",
        "country": "Thailand",
        "category": "Private University",
        "province": "Bangkok",
    },
    {
        "name": "North Bangkok University",
        "name_th": "มหาวิทยาลัยนอร์ทกรุงเทพ",
        "country": "Thailand",
        "category": "Private University",
        "province": "Bangkok",
    },
    {
        "name": "Saint John's University",
        "name_th": "มหาวิทยาลัยเซนต์จอห์น",
        "country": "Thailand",
        "category": "Private University",
        "province": "Bangkok",
    },
    {
        "name": "Western University",
        "name_th": "มหาวิทยาลัยเวสเทิร์น",
        "country": "Thailand",
        "category": "Private University",
        "province": "Pathum Thani / Kanchanaburi",
    },
    {
        "name": "Nation University",
        "name_th": "มหาวิทยาลัยเนชั่น",
        "country": "Thailand",
        "category": "Private University",
        "province": "Lampang",
    },
    {
        "name": "South-East Asia University",
        "name_th": "มหาวิทยาลัยเอเชียอาคเนย์",
        "country": "Thailand",
        "category": "Private University",
        "province": "Bangkok",
    },
    {
        "name": "Stamford International University",
        "name_th": "มหาวิทยาลัยนานาชาติแสตมฟอร์ด",
        "country": "Thailand",
        "category": "Private University",
        "tier": "International Dual-Degree Private",
        "province": "Bangkok / Hua Hin",
    },
    {
        "name": "Panyapiwat Institute of Management",
        "name_th": "สถาบันการจัดการปัญญาภิวัฒน์ (PIM)",
        "country": "Thailand",
        "category": "Corporate Private Institute",
        "tier": "Corporate Work-Integrated Learning (CP Group)",
        "province": "Nonthaburi",
        "default_degrees": {
            "business": "Bachelor of Business Administration in Modern Trade Business",
            "logistics": "Bachelor of Science in Logistics and Transportation Management",
            "tech": "Bachelor of Science in Digital Technology and Artificial Intelligence",
            "agriculture": "Bachelor of Science in Agri-Business Management",
        },
    },
    {
        "name": "Thai-Nichi Institute of Technology",
        "name_th": "สถาบันเทคโนโลยีไทย-ญี่ปุ่น (TNI)",
        "country": "Thailand",
        "category": "Private Institute",
        "tier": "Japanese Monodukuri Engineering & Tech",
        "province": "Bangkok",
        "default_degrees": {
            "engineering": "Bachelor of Engineering in Automotive Engineering / Mechatronics",
            "tech": "Bachelor of Science in Information Technology and Digital Software",
            "business": "Bachelor of Business Administration in Japanese Business Administration",
        },
    },
    {
        "name": "Arsom Silp Institute of the Arts",
        "name_th": "สถาบันอาศรมศิลป์",
        "country": "Thailand",
        "category": "Specialized Private Institute",
        "tier": "Holistic Architecture & Pedagogy Institute",
        "province": "Bangkok",
        "default_degrees": {
            "architecture": "Bachelor of Architecture (Community and Environmental Architecture)",
            "education": "Master of Education in Holistic Educational Leadership",
        },
    },
    {
        "name": "Suvarnabhumi Institute of Technology",
        "name_th": "สถาบันเทคโนโลยีแห่งสุวรรณภูมิ",
        "country": "Thailand",
        "category": "Private Institute",
        "province": "Samut Prakan",
    },
    {
        "name": "Fatoni University",
        "name_th": "มหาวิทยาลัยฟาฏอนี",
        "country": "Thailand",
        "category": "Private University",
        "province": "Pattani",
    },
    {
        "name": "Hatyai University",
        "name_th": "มหาวิทยาลัยหาดใหญ่",
        "country": "Thailand",
        "category": "Private University",
        "province": "Songkhla",
    },
    {
        "name": "Tapi University",
        "name_th": "มหาวิทยาลัยตาปี",
        "country": "Thailand",
        "category": "Private University",
        "province": "Surat Thani",
    },
    {
        "name": "North Eastern University",
        "name_th": "มหาวิทยาลัยภาคตะวันออกเฉียงเหนือ",
        "country": "Thailand",
        "category": "Private University",
        "province": "Khon Kaen",
    },
    {
        "name": "Vongchavalitkul University",
        "name_th": "มหาวิทยาลัยวงษ์ชวลิตกุล",
        "country": "Thailand",
        "category": "Private University",
        "province": "Nakhon Ratchasima",
    },
    {
        "name": "Ratchathani University",
        "name_th": "มหาวิทยาลัยราชธานี",
        "country": "Thailand",
        "category": "Private University",
        "province": "Ubon Ratchathani",
    },
    {
        "name": "Chalermkarnchana University",
        "name_th": "มหาวิทยาลัยเฉลิมกาญจนา",
        "country": "Thailand",
        "category": "Private University",
        "province": "Sisaket",
    },
    {
        "name": "Phitsanulok University",
        "name_th": "มหาวิทยาลัยพิษณุโลก",
        "country": "Thailand",
        "category": "Private University",
        "province": "Phitsanulok",
    },
    {
        "name": "Chaopraya University",
        "name_th": "มหาวิทยาลัยเจ้าพระยา",
        "country": "Thailand",
        "category": "Private University",
        "province": "Nakhon Sawan",
    },
    {
        "name": "The University of Central Thailand",
        "name_th": "มหาวิทยาลัยภาคกลาง",
        "country": "Thailand",
        "category": "Private University",
        "province": "Nakhon Sawan",
    },
    {
        "name": "Bangkok Suvarnabhumi University",
        "name_th": "มหาวิทยาลัยกรุงเทพสุวรรณภูมิ",
        "country": "Thailand",
        "category": "Private University",
        "province": "Bangkok",
    },
    {
        "name": "Bangkok Thonburi University",
        "name_th": "มหาวิทยาลัยกรุงเทพธนบุรี",
        "country": "Thailand",
        "category": "Private University",
        "province": "Bangkok",
    },
    {
        "name": "North Chiang Mai University",
        "name_th": "มหาวิทยาลัยนอร์ท-เชียงใหม่",
        "country": "Thailand",
        "category": "Private University",
        "province": "Chiang Mai",
    },
    {
        "name": "Eastern Asia University",
        "name_th": "มหาวิทยาลัยอีสเทิร์นเอเชีย",
        "country": "Thailand",
        "category": "Private University",
        "province": "Pathum Thani",
    },
    {
        "name": "Pathumthani University",
        "name_th": "มหาวิทยาลัยปทุมธานี",
        "country": "Thailand",
        "category": "Private University",
        "province": "Pathum Thani",
    },
    {
        "name": "Shinawatra University",
        "name_th": "มหาวิทยาลัยชินวัตร",
        "country": "Thailand",
        "category": "Private University",
        "province": "Pathum Thani",
    },
    {
        "name": "Asia-Pacific International University",
        "name_th": "มหาวิทยาลัยนานาชาติเอเชีย-แปซิฟิก",
        "country": "Thailand",
        "category": "Private University",
        "province": "Saraburi",
    },
]


# ==============================================================================
# 2. CREDIBLE INTERNATIONAL UNIVERSITIES BANK (สถาบันชั้นนำระดับโลกที่น่าเชื่อถือ)
# ==============================================================================

INTERNATIONAL_UNIVERSITIES: List[Dict[str, Any]] = [
    # --------------------------------------------------------------------------
    # 2.1 United States (Ivy League & Top STEM/Business/Medical)
    # --------------------------------------------------------------------------
    {
        "name": "Harvard University",
        "name_th": "มหาวิทยาลัยฮาร์วาร์ด",
        "country": "United States",
        "tier": "Global Elite (Ivy League)",
        "default_degrees": {
            "business": "Master of Business Administration (Harvard Business School - HBS)",
            "legal": "Master of Laws (LL.M., Harvard Law School)",
            "healthcare": "Doctor of Medicine (Harvard Medical School)",
            "tech": "Master of Science in Computational Science and Engineering",
            "education": "Master of Education in Education Policy and Analysis",
        },
    },
    {
        "name": "Stanford University",
        "name_th": "มหาวิทยาลัยสแตนฟอร์ด",
        "country": "United States",
        "tier": "Global Elite (Silicon Valley / Tech Leadership)",
        "default_degrees": {
            "tech": "Master of Science in Computer Science (Artificial Intelligence)",
            "business": "Master of Business Administration (Stanford GSB)",
            "engineering": "Master of Science in Mechanical Engineering & Robotics",
            "healthcare": "Doctor of Medicine (Stanford School of Medicine)",
            "legal": "Master of Laws in Law, Science & Technology (LL.M.)",
        },
    },
    {
        "name": "Massachusetts Institute of Technology",
        "name_th": "สถาบันเทคโนโลยีแมสซาชูเซตส์ (MIT)",
        "country": "United States",
        "tier": "Global Elite (World #1 STEM)",
        "default_degrees": {
            "tech": "Master of Science in Electrical Engineering and Computer Science (EECS)",
            "engineering": "Master of Science in Aerospace Engineering",
            "finance": "Master of Finance (MIT Sloan School of Management)",
            "science": "Doctor of Philosophy in Physics & Quantum Information",
            "business": "Master of Business Analytics (MBAn, MIT Sloan)",
        },
    },
    {
        "name": "University of California, Berkeley",
        "name_th": "มหาวิทยาลัยแคลิฟอร์เนีย เบิร์กลีย์ (UC Berkeley)",
        "country": "United States",
        "tier": "Top US Public Flagship",
        "default_degrees": {
            "tech": "Bachelor of Science in Electrical Engineering & Computer Sciences (EECS)",
            "business": "Bachelor of Science in Business Administration (Haas School of Business)",
            "legal": "Master of Laws (Berkeley Law)",
            "engineering": "Master of Engineering (Industrial Engineering & Operations Research)",
        },
    },
    {
        "name": "Columbia University",
        "name_th": "มหาวิทยาลัยโคลัมเบีย",
        "country": "United States",
        "tier": "Ivy League",
        "default_degrees": {
            "finance": "Master of Science in Financial Engineering",
            "creative": "Master of Science in Journalism (Columbia Journalism School)",
            "business": "Master of Business Administration (Columbia Business School)",
            "tech": "Master of Science in Computer Science",
        },
    },
    {
        "name": "Princeton University",
        "name_th": "มหาวิทยาลัยพรินซ์ตัน",
        "country": "United States",
        "tier": "Ivy League",
        "default_degrees": {
            "science": "Doctor of Philosophy in Quantitative Computational Biology",
            "finance": "Master in Finance (Bendheim Center for Finance)",
            "tech": "Bachelor of Science in Computer Science (B.S.E.)",
        },
    },
    {
        "name": "Yale University",
        "name_th": "มหาวิทยาลัยเยล",
        "country": "United States",
        "tier": "Ivy League",
        "default_degrees": {
            "legal": "Master of Laws (LL.M., Yale Law School)",
            "social_dev": "Master of Environmental Management (Yale School of the Environment)",
            "business": "Master of Business Administration (Yale School of Management)",
        },
    },
    {
        "name": "University of Pennsylvania",
        "name_th": "มหาวิทยาลัยเพนซิลเวเนีย (UPenn / Wharton)",
        "country": "United States",
        "tier": "Ivy League",
        "default_degrees": {
            "finance": "Bachelor of Science in Economics / Finance (Wharton School)",
            "business": "Master of Business Administration (Wharton MBA)",
            "healthcare": "Doctor of Medicine (Perelman School of Medicine)",
        },
    },
    {
        "name": "California Institute of Technology",
        "name_th": "สถาบันเทคโนโลยีแคลิฟอร์เนีย (Caltech)",
        "country": "United States",
        "tier": "Global Elite STEM",
        "default_degrees": {
            "tech": "Master of Science in Computing and Mathematical Sciences",
            "science": "Doctor of Philosophy in Applied Physics",
        },
    },
    {
        "name": "University of Chicago",
        "name_th": "มหาวิทยาลัยชิคาโก",
        "country": "United States",
        "tier": "Top Global (Economics & Business)",
        "default_degrees": {
            "finance": "Master of Business Administration (Chicago Booth School of Business)",
            "business": "Master of Science in Financial Mathematics",
        },
    },
    {
        "name": "Carnegie Mellon University",
        "name_th": "มหาวิทยาลัยคาร์เนกีเมลลอน (CMU)",
        "country": "United States",
        "tier": "World #1 Computer Science & AI",
        "default_degrees": {
            "tech": "Master of Science in Machine Learning and Language Technologies (LTI)",
            "creative": "Master of Entertainment Technology (ETC)",
            "engineering": "Master of Science in Software Engineering",
        },
    },
    {
        "name": "Cornell University",
        "name_th": "มหาวิทยาลัยคอร์เนลล์",
        "country": "United States",
        "tier": "Ivy League",
        "default_degrees": {
            "hospitality": "Bachelor of Science in Hotel Administration (Nolan School)",
            "agriculture": "Bachelor of Science in Food and Agricultural Sciences",
            "tech": "Master of Science in Information Systems (Cornell Tech)",
        },
    },
    {
        "name": "University of California, Los Angeles",
        "name_th": "มหาวิทยาลัยแคลิฟอร์เนีย ลอสแอนเจลิส (UCLA)",
        "country": "United States",
        "tier": "Top US Public",
        "default_degrees": {
            "creative": "Bachelor of Arts in Film, Television and Digital Media",
            "business": "Master of Business Administration (UCLA Anderson)",
            "healthcare": "Doctor of Medicine (David Geffen School of Medicine)",
        },
    },
    {
        "name": "University of Michigan, Ann Arbor",
        "name_th": "มหาวิทยาลัยมิชิแกน แอนน์อาร์เบอร์",
        "country": "United States",
        "tier": "Top US Public Research",
        "default_degrees": {
            "engineering": "Master of Science in Automotive and Robotics Engineering",
            "business": "Master of Business Administration (Ross School of Business)",
        },
    },
    {
        "name": "New York University",
        "name_th": "มหาวิทยาลัยนิวยอร์ก (NYU)",
        "country": "United States",
        "tier": "Top Global (Finance, Arts & Media)",
        "default_degrees": {
            "finance": "Master of Science in Quantitative Finance (NYU Stern)",
            "creative": "Bachelor of Fine Arts (Tisch School of the Arts)",
            "legal": "Master of Laws in Corporation Law (NYU School of Law)",
        },
    },
    {
        "name": "University of Washington",
        "name_th": "มหาวิทยาลัยวอชิงตัน (UW Seattle)",
        "country": "United States",
        "tier": "Pacific Northwest Tech Flagship",
        "default_degrees": {
            "tech": "Master of Science in Computer Science & Engineering (Paul G. Allen School)",
            "healthcare": "Doctor of Medicine / Master of Public Health",
        },
    },
    {
        "name": "Johns Hopkins University",
        "name_th": "มหาวิทยาลัยจอห์นส์ ฮอปกินส์",
        "country": "United States",
        "tier": "World #1 Medicine & Public Health",
        "default_degrees": {
            "healthcare": "Doctor of Medicine (Hopkins Med) / Master of Public Health (Bloomberg)",
            "science": "Master of Science in Biotechnology",
        },
    },
    {
        "name": "Georgia Institute of Technology",
        "name_th": "สถาบันเทคโนโลยีจอร์เจีย (Georgia Tech)",
        "country": "United States",
        "tier": "Top US Engineering",
        "default_degrees": {
            "engineering": "Master of Science in Industrial & Systems Engineering",
            "tech": "Master of Science in Cybersecurity / Computer Science",
        },
    },
    {
        "name": "Northwestern University",
        "name_th": "มหาวิทยาลัยนอร์ทเวสเทิร์น",
        "country": "United States",
        "tier": "Top US Private (Kellogg & Medill)",
        "default_degrees": {
            "business": "Master of Business Administration (Kellogg School of Management)",
            "creative": "Master of Science in Integrated Marketing Communications (Medill)",
        },
    },
    {
        "name": "University of Texas at Austin",
        "name_th": "มหาวิทยาลัยเท็กซัส ออสติน (UT Austin)",
        "country": "United States",
        "tier": "Silicon Hills Tech Flagship",
        "default_degrees": {
            "tech": "Bachelor of Science in Computer Science (Turing Scholars)",
            "business": "Master of Professional Accounting (McCombs)",
        },
    },

    # --------------------------------------------------------------------------
    # 2.2 United Kingdom (Oxbridge & Russell Group)
    # --------------------------------------------------------------------------
    {
        "name": "University of Oxford",
        "name_th": "มหาวิทยาลัยออกซฟอร์ด",
        "country": "United Kingdom",
        "tier": "Global Elite (Oxbridge)",
        "default_degrees": {
            "tech": "Master of Science in Advanced Computer Science",
            "healthcare": "Bachelor of Medicine and Surgery (BMBCh)",
            "business": "Master of Business Administration (Saïd Business School)",
            "finance": "Master of Science in Financial Economics (MFE)",
            "legal": "Bachelor of Civil Law (BCL) / Master of Law and Finance (MLF)",
            "social_dev": "Master of Public Policy (Blavatnik School of Government)",
        },
    },
    {
        "name": "University of Cambridge",
        "name_th": "มหาวิทยาลัยเคมบริดจ์",
        "country": "United Kingdom",
        "tier": "Global Elite (Oxbridge)",
        "default_degrees": {
            "tech": "Master of Philosophy in Advanced Computer Science",
            "engineering": "Master of Engineering (Cambridge Engineering Tripos)",
            "business": "Master of Business Administration (Judge Business School)",
            "science": "Doctor of Philosophy in Applied Mathematics and Theoretical Physics",
        },
    },
    {
        "name": "Imperial College London",
        "name_th": "อิมพีเรียลคอลเลจ ลอนดอน",
        "country": "United Kingdom",
        "tier": "Global Top Tier (STEM & Medicine)",
        "default_degrees": {
            "tech": "Master of Science in Computing (Machine Learning and Data Science)",
            "healthcare": "Bachelor of Medicine and Bachelor of Surgery (MBBS)",
            "engineering": "Master of Engineering (Aeronautical Engineering)",
            "finance": "Master of Science in Finance and Accounting",
        },
    },
    {
        "name": "University College London",
        "name_th": "ยูนิเวอร์ซิตีคอลเลจ ลอนดอน (UCL)",
        "country": "United Kingdom",
        "tier": "Russell Group Elite",
        "default_degrees": {
            "architecture": "Master of Architecture (The Bartlett School of Architecture)",
            "tech": "Master of Science in Artificial Intelligence and Computational Science",
            "education": "Master of Arts in Education (UCL Institute of Education - IOE)",
            "healthcare": "Bachelor of Medicine and Surgery (MBBS)",
        },
    },
    {
        "name": "London School of Economics and Political Science",
        "name_th": "วิทยาลัยเศรษฐศาสตร์และรัฐศาสตร์แห่งลอนดอน (LSE)",
        "country": "United Kingdom",
        "tier": "Global Leader in Social Sciences, Finance & Law",
        "default_degrees": {
            "finance": "Master of Science in Finance and Economics",
            "business": "Master of Science in Management and Strategy",
            "legal": "Master of Laws (LL.M., LSE Law School)",
            "social_dev": "Master of Science in International Development and Humanitarian Emergencies",
        },
    },
    {
        "name": "University of Edinburgh",
        "name_th": "มหาวิทยาลัยเอดินบะระ",
        "country": "United Kingdom",
        "tier": "Russell Group (Scotland Flagship)",
        "default_degrees": {
            "tech": "Master of Science in Artificial Intelligence (School of Informatics)",
            "healthcare": "Bachelor of Medicine and Surgery (MBChB)",
        },
    },
    {
        "name": "King's College London",
        "name_th": "คิงส์คอลเลจ ลอนดอน (KCL)",
        "country": "United Kingdom",
        "tier": "Russell Group (Law & Healthcare)",
        "default_degrees": {
            "healthcare": "Bachelor of Dental Surgery / Bachelor of Nursing Science",
            "legal": "Master of Laws (Dickson Poon School of Law)",
        },
    },
    {
        "name": "University of Manchester",
        "name_th": "มหาวิทยาลัยแมนเชสเตอร์",
        "country": "United Kingdom",
        "tier": "Russell Group",
        "default_degrees": {
            "business": "Master of Science in Operations and Supply Chain Management (Alliance MBS)",
            "engineering": "Master of Engineering in Aerospace & Chemical Engineering",
        },
    },
    {
        "name": "University of Bristol",
        "name_th": "มหาวิทยาลัยบริสตอล",
        "country": "United Kingdom",
        "tier": "Russell Group",
    },
    {
        "name": "University of Warwick",
        "name_th": "มหาวิทยาลัยวอริก",
        "country": "United Kingdom",
        "tier": "Russell Group (Warwick Business School)",
        "default_degrees": {
            "business": "Master of Science in Business Analytics (WBS)",
            "finance": "Master of Science in Finance",
        },
    },

    # --------------------------------------------------------------------------
    # 2.3 Asia Flagships (Singapore, Japan, China, Hong Kong, Korea, Taiwan)
    # --------------------------------------------------------------------------
    {
        "name": "National University of Singapore",
        "name_th": "มหาวิทยาลัยแห่งชาติสิงคโปร์ (NUS)",
        "country": "Singapore",
        "tier": "Global Elite / Top Asia",
        "default_degrees": {
            "tech": "Bachelor of Computing in Computer Science / AI (NUS Computing)",
            "healthcare": "Bachelor of Medicine and Bachelor of Surgery (MBBS, Yong Loo Lin)",
            "business": "Bachelor of Business Administration (NUS Business School)",
            "finance": "Master of Science in Quantitative Finance",
            "legal": "Master of Laws (LL.M. in International Business Law)",
            "engineering": "Bachelor of Engineering (Electrical & Computer Engineering)",
        },
    },
    {
        "name": "Nanyang Technological University",
        "name_th": "มหาวิทยาลัยเทคโนโลยีนันยาง (NTU)",
        "country": "Singapore",
        "tier": "Global Elite / Top Asia",
        "default_degrees": {
            "tech": "Bachelor of Science in Data Science and Artificial Intelligence",
            "engineering": "Bachelor of Engineering (Materials Science & Robotics)",
            "business": "Bachelor of Business (Nanyang Business School)",
            "healthcare": "Bachelor of Medicine and Surgery (Lee Kong Chian)",
        },
    },
    {
        "name": "University of Tokyo",
        "name_th": "มหาวิทยาลัยโตเกียว (โทได)",
        "country": "Japan",
        "tier": "Top Japan National Flagship",
        "default_degrees": {
            "tech": "Master of Information Science and Technology",
            "engineering": "Bachelor of Engineering (Precision Engineering / Quantum Computing)",
            "healthcare": "Doctor of Medicine (Faculty of Medicine)",
        },
    },
    {
        "name": "Kyoto University",
        "name_th": "มหาวิทยาลัยเกียวโต",
        "country": "Japan",
        "tier": "Nobel Laureate Science Flagship",
        "default_degrees": {
            "science": "Doctor of Philosophy in Chemistry and Molecular Biology",
            "engineering": "Master of Engineering in Electrical Engineering",
        },
    },
    {
        "name": "Tsinghua University",
        "name_th": "มหาวิทยาลัยชิงหวา",
        "country": "China",
        "tier": "Top China STEM & Innovation",
        "default_degrees": {
            "tech": "Bachelor of Engineering in Computer Science and Technology",
            "engineering": "Master of Science in Automation and Electronic Engineering",
            "business": "Master of Business Administration (Tsinghua SEM)",
        },
    },
    {
        "name": "Peking University",
        "name_th": "มหาวิทยาลัยปักกิ่ง",
        "country": "China",
        "tier": "Top China Humanities & Comprehensive",
        "default_degrees": {
            "business": "Master of Finance (Guanghua School of Management)",
            "legal": "Master of Laws (PKU Law School)",
        },
    },
    {
        "name": "University of Hong Kong",
        "name_th": "มหาวิทยาลัยฮ่องกง (HKU)",
        "country": "Hong Kong",
        "tier": "Top Hong Kong Flagship",
        "default_degrees": {
            "finance": "Master of Finance in Financial Technology (HKU Business School)",
            "healthcare": "Bachelor of Medicine and Surgery (Li Ka Shing Faculty of Medicine)",
            "architecture": "Bachelor of Arts in Architectural Studies",
        },
    },
    {
        "name": "Hong Kong University of Science and Technology",
        "name_th": "มหาวิทยาลัยวิทยาศาสตร์และเทคโนโลยีฮ่องกง (HKUST)",
        "country": "Hong Kong",
        "tier": "Top Asian Tech & Business",
        "default_degrees": {
            "tech": "Bachelor of Science in Data Science and Technology",
            "business": "Master of Business Administration (HKUST MBA)",
        },
    },
    {
        "name": "Seoul National University",
        "name_th": "มหาวิทยาลัยแห่งชาติโซล (SNU)",
        "country": "South Korea",
        "tier": "Top South Korea Flagship (SKY)",
        "default_degrees": {
            "tech": "Bachelor of Science in Computer Science and Engineering",
            "business": "Bachelor of Business Administration (SNU Business School)",
            "healthcare": "Doctor of Medicine (College of Medicine)",
        },
    },
    {
        "name": "KAIST",
        "name_th": "สถาบันชั้นสูงวิทยาศาสตร์และเทคโนโลยีเกาหลี (KAIST)",
        "country": "South Korea",
        "tier": "Top Korea Science & Tech",
        "default_degrees": {
            "tech": "Master of Science in Artificial Intelligence / Robotics",
            "engineering": "Bachelor of Science in Electrical Engineering",
        },
    },
    {
        "name": "Yonsei University",
        "name_th": "มหาวิทยาลัยยอนเซ",
        "country": "South Korea",
        "tier": "SKY Elite (Underwood International College)",
        "default_degrees": {
            "business": "Bachelor of Business Administration (Yonsei School of Business)",
            "healthcare": "Doctor of Medicine (Severance Hospital)",
        },
    },
    {
        "name": "National Taiwan University",
        "name_th": "มหาวิทยาลัยแห่งชาติไต้หวัน (NTU)",
        "country": "Taiwan",
        "tier": "Top Taiwan Flagship",
        "default_degrees": {
            "tech": "Bachelor of Science in Computer Science & Information Engineering (CSIE)",
            "engineering": "Master of Science in Electrical Engineering (Semiconductors)",
        },
    },

    # --------------------------------------------------------------------------
    # 2.4 Europe (Top Swiss, German, Dutch, French, Swedish Flagships)
    # --------------------------------------------------------------------------
    {
        "name": "ETH Zurich",
        "name_th": "สถาบันเทคโนโลยีแห่งสหพันธ์สวิส ซูริก (ETH Zurich)",
        "country": "Switzerland",
        "tier": "World #1 Continental Europe Tech",
        "default_degrees": {
            "tech": "Master of Science in Computer Science (Distributed Systems & Robotics)",
            "engineering": "Master of Science in Mechanical and Process Engineering",
            "science": "Doctor of Philosophy in Quantum Engineering",
        },
    },
    {
        "name": "EPFL",
        "name_th": "สถาบันเทคโนโลยีแห่งสหพันธ์สวิส โลซานน์ (EPFL)",
        "country": "Switzerland",
        "tier": "Top European Tech Institute",
        "default_degrees": {
            "tech": "Master of Science in Data Science and Cybersecurity",
            "engineering": "Master of Science in Microengineering",
        },
    },
    {
        "name": "Technical University of Munich",
        "name_th": "มหาวิทยาลัยเทคนิคแห่งมิวนิก (TUM)",
        "country": "Germany",
        "tier": "Germany TU9 Tech Flagship",
        "default_degrees": {
            "engineering": "Master of Science in Automotive and Aerospace Engineering",
            "tech": "Master of Science in Informatics (Data Engineering and Analytics)",
        },
    },
    {
        "name": "Heidelberg University",
        "name_th": "มหาวิทยาลัยไฮเดลเบิร์ก",
        "country": "Germany",
        "tier": "Pioneer Medicine & Natural Sciences",
        "default_degrees": {
            "healthcare": "Doctor of Medicine (Heidelberg Medical Faculty)",
            "science": "Doctor of Philosophy in Molecular Biosciences",
        },
    },
    {
        "name": "University of Amsterdam",
        "name_th": "มหาวิทยาลัยอัมสเตอร์ดัม",
        "country": "Netherlands",
        "tier": "Top European Comprehensive",
        "default_degrees": {
            "creative": "Master of Science in Communication Science (Media & Persuasion)",
            "finance": "Master of Science in Econometrics and Data Science",
        },
    },
    {
        "name": "Delft University of Technology",
        "name_th": "มหาวิทยาลัยเทคโนโลยีเดลฟท์ (TU Delft)",
        "country": "Netherlands",
        "tier": "World Top Civil & Industrial Design",
        "default_degrees": {
            "architecture": "Master of Science in Architecture, Urbanism and Building Sciences",
            "engineering": "Master of Science in Civil Engineering and Hydraulic Systems",
        },
    },
    {
        "name": "Sorbonne University",
        "name_th": "มหาวิทยาลัยซอร์บอนน์",
        "country": "France",
        "tier": "Top French Historic Flagship",
        "default_degrees": {
            "science": "Doctor of Philosophy in Applied Mathematics and Theoretical Physics",
            "social_dev": "Master of Arts in Comparative Literature and International Philosophy",
        },
    },
    {
        "name": "Karolinska Institute",
        "name_th": "สถาบันคาโรลินสกา (Karolinska)",
        "country": "Sweden",
        "tier": "World Top Medical (Nobel Assembly)",
        "default_degrees": {
            "healthcare": "Master of Medical Science in Biomedicine / Global Health",
            "science": "Doctor of Philosophy in Molecular Medicine",
        },
    },

    # --------------------------------------------------------------------------
    # 2.5 Canada & Australasia (Go8 & U15 Flagships)
    # --------------------------------------------------------------------------
    {
        "name": "University of Toronto",
        "name_th": "มหาวิทยาลัยโทรอนโต",
        "country": "Canada",
        "tier": "Top Canada Flagship",
        "default_degrees": {
            "tech": "Master of Science in Applied Computing (Vector Institute AI)",
            "business": "Master of Business Administration (Rotman School of Management)",
            "healthcare": "Doctor of Medicine (Temerty Faculty of Medicine)",
        },
    },
    {
        "name": "University of British Columbia",
        "name_th": "มหาวิทยาลัยบริติชโคลัมเบีย (UBC)",
        "country": "Canada",
        "tier": "U15 Canada Research Flagship",
        "default_degrees": {
            "environment": "Master of Science in Forestry and Ecological Sustainability",
            "business": "Bachelor of Commerce (Sauder School of Business)",
        },
    },
    {
        "name": "McGill University",
        "name_th": "มหาวิทยาลัยแมกแกล",
        "country": "Canada",
        "tier": "Top Canada Historic Flagship",
        "default_degrees": {
            "healthcare": "Doctor of Medicine (Faculty of Medicine and Health Sciences)",
            "legal": "Bachelor of Civil Law and Juris Doctor (BCL/JD)",
        },
    },
    {
        "name": "University of Melbourne",
        "name_th": "มหาวิทยาลัยเมลเบิร์น",
        "country": "Australia",
        "tier": "Top Australia Flagship (Group of Eight - Go8)",
        "default_degrees": {
            "business": "Master of Management (Melbourne Business School)",
            "healthcare": "Doctor of Medicine (Melbourne Medical School)",
            "tech": "Master of Information Technology (Distributed Computing)",
            "legal": "Master of Laws (Melbourne Law School)",
        },
    },
    {
        "name": "University of Sydney",
        "name_th": "มหาวิทยาลัยซิดนีย์",
        "country": "Australia",
        "tier": "Group of Eight (Go8)",
        "default_degrees": {
            "business": "Bachelor of Commerce in Professional Accounting",
            "engineering": "Bachelor of Engineering (Software & Aerospace)",
            "healthcare": "Doctor of Medicine (Sydney Medical School)",
        },
    },
    {
        "name": "Australian National University",
        "name_th": "มหาวิทยาลัยแห่งชาติออสเตรเลีย (ANU)",
        "country": "Australia",
        "tier": "National Research Flagship (Go8)",
        "default_degrees": {
            "social_dev": "Master of International Affairs and Public Policy",
            "science": "Doctor of Philosophy in Astronomy and Astrophysics",
        },
    },
    {
        "name": "University of New South Wales",
        "name_th": "มหาวิทยาลัยนิวเซาท์เวลส์ (UNSW Sydney)",
        "country": "Australia",
        "tier": "Top Australia Engineering & Solar Tech (Go8)",
        "default_degrees": {
            "engineering": "Bachelor of Engineering in Photovoltaics and Renewable Energy",
            "tech": "Bachelor of Science in Computer Science",
        },
    },
    {
        "name": "University of Auckland",
        "name_th": "มหาวิทยาลัยออกแลนด์",
        "country": "New Zealand",
        "tier": "Top New Zealand Flagship",
        "default_degrees": {
            "healthcare": "Bachelor of Medicine and Surgery (MBChB)",
            "business": "Master of International Business",
        },
    },
]


# ==============================================================================
# COMBINED COMPLETE UNIVERSITIES DIRECTORY
# ==============================================================================

UNIVERSITIES: List[Dict[str, Any]] = THAI_UNIVERSITIES + INTERNATIONAL_UNIVERSITIES


# ==============================================================================
# 3. COMPANIES & ORGANIZATIONS ECOSYSTEM (MULTI-TIERED BY INDUSTRY)
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
    "hospitality": [
        {"name": "Minor Hotels Global Operations", "type": "Luxury Hospitality Chain", "hq": "Bangkok, Thailand"},
        {"name": "Centara Hotels & Resorts Group", "type": "Resort & Lodging Conglomerate", "hq": "Bangkok, Thailand"},
        {"name": "Thai Airways International Catering & Ground Operations", "type": "Aviation Hospitality", "hq": "Bangkok, Thailand"},
        {"name": "Siam Destination Hospitality Specialists", "type": "Luxury Tour Operator", "hq": "Phuket, Thailand"},
    ],
    "science": [
        {"name": "National Nanotechnology Center (NANOTEC)", "type": "National Science Institute", "hq": "Pathum Thani, Thailand"},
        {"name": "BIOTEC National Center for Genetic Engineering", "type": "Genomics & Bio-Industry Center", "hq": "Pathum Thani, Thailand"},
        {"name": "Synchrotron Light Research Institute (SLRI)", "type": "National Advanced Accelerator Lab", "hq": "Nakhon Ratchasima, Thailand"},
    ],
    "agriculture": [
        {"name": "Charoen Pokphand Foods (CPF) Agrotech", "type": "Global Food & Agribusiness", "hq": "Bangkok, Thailand"},
        {"name": "Betagro Agro-Industrial Innovation Center", "type": "Livestock & Smart Farm Systems", "hq": "Bangkok, Thailand"},
        {"name": "Mitr Phol Bio-Energy & Sugarcane Research", "type": "Renewable Agrochemicals", "hq": "Bangkok, Thailand"},
    ],
    "logistics": [
        {"name": "Kerry Express Thailand Logistics Hub", "type": "Express Parcel Network", "hq": "Bangkok, Thailand"},
        {"name": "JWD Infologistics Cold Chain Solutions", "type": "Integrated Multimodal Logistics", "hq": "Bangkok, Thailand"},
        {"name": "Hutchison Ports Laem Chabang", "type": "Deep-Sea Container Terminal", "hq": "Chonburi, Thailand"},
        {"name": "Flash Express Regional Sorting Center", "type": "E-Commerce Logistics", "hq": "Bangkok, Thailand"},
    ],
    "architecture": [
        {"name": "Architects 49 (A49)", "type": "Leading Architectural Practice", "hq": "Bangkok, Thailand"},
        {"name": "Plan Associates Architectural Consultants", "type": "Urban Masterplanning & Architecture", "hq": "Bangkok, Thailand"},
        {"name": "Department of Architecture Co.", "type": "Award-Winning Design Studio", "hq": "Bangkok, Thailand"},
    ],
    "environment": [
        {"name": "Energy Absolute (EA) Renewables", "type": "EV & Solar Storage Systems", "hq": "Bangkok, Thailand"},
        {"name": "BCPG Clean Energy Innovation", "type": "Wind & Solar Utility Scale", "hq": "Bangkok, Thailand"},
        {"name": "Global Power Synergy (GPSC)", "type": "Power & Clean Utilities", "hq": "Rayong / Bangkok, Thailand"},
    ],
    "social_dev": [
        {"name": "United Nations ESCAP Regional Hub", "type": "Intergovernmental Development Body", "hq": "Bangkok, Thailand"},
        {"name": "Kenan Foundation Asia", "type": "Sustainable Economic Development NGO", "hq": "Bangkok, Thailand"},
        {"name": "Raks Thai Foundation (CARE International Member)", "type": "Humanitarian Community Development", "hq": "Bangkok, Thailand"},
    ],
}


# ==============================================================================
# 4. GEOGRAPHIC LOCATIONS & HUBS
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
    "Phitsanulok, Thailand",
    "Ubon Ratchathani, Thailand",
    "Nakhon Pathom, Thailand",
    "Surat Thani, Thailand",
    "Chiang Rai, Thailand",
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

CITIES: List[str] = CITIES_THAI + CITIES_GLOBAL


# ==============================================================================
# 5. RESOLUTION HELPERS
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
    is_phd = any(k in lowered_sen for k in ["phd", "doctoral", "fellow", "principal", "senior researcher"])
    is_master = any(k in lowered_sen for k in ["master", "lead", "manager", "head", "director", "specialist"])

    # Match industry key
    ind_key = industry_key.lower()
    matched_industry = "tech"
    for k in COMPANIES_BY_INDUSTRY.keys():
        if k in ind_key:
            matched_industry = k
            break

    # Filter universities: Thai vs International depending on language and tier
    if language == "th":
        # 90% Thai universities, 10% international prestigious
        uni_pool = THAI_UNIVERSITIES if random.random() < 0.90 else INTERNATIONAL_UNIVERSITIES
    elif candidate_tier == "global" or is_phd:
        # High likelihood of top international or top national Thai
        top_thai = [u for u in THAI_UNIVERSITIES if "Flagship" in u.get("tier", "")]
        uni_pool = INTERNATIONAL_UNIVERSITIES + top_thai
    else:
        # Default English: 45% Thai universities (Bilingual/Inter), 55% Global universities
        uni_pool = THAI_UNIVERSITIES if random.random() < 0.45 else INTERNATIONAL_UNIVERSITIES

    uni = random.choice(uni_pool)
    degrees_map = uni.get("default_degrees") or {}
    degree_text = degrees_map.get(matched_industry)

    if not degree_text:
        degree_text = INDUSTRY_DEFAULT_DEGREES.get(
            matched_industry, f"Bachelor of Science in {industry_key.title()}"
        )

    # Adjust degree level based on seniority
    if is_phd:
        if "Bachelor" in degree_text:
            degree_text = degree_text.replace("Bachelor of Science", "Doctor of Philosophy (Ph.D.)")
            degree_text = degree_text.replace("Bachelor of Engineering", "Doctor of Philosophy (Ph.D.) in Engineering")
            degree_text = degree_text.replace("Bachelor of Business Administration", "Doctor of Philosophy (Ph.D.) in Business")
            degree_text = degree_text.replace("Bachelor of Arts", "Doctor of Philosophy (Ph.D.) in Arts")
            degree_text = degree_text.replace("Bachelor", "Doctor of Philosophy")
    elif is_master and not any(k in degree_text for k in ["Doctor", "Master"]):
        if "Bachelor" in degree_text:
            degree_text = degree_text.replace("Bachelor of Science", "Master of Science (M.Sc.)")
            degree_text = degree_text.replace("Bachelor of Engineering", "Master of Engineering (M.Eng.)")
            degree_text = degree_text.replace("Bachelor of Business Administration", "Master of Business Administration (MBA)")
            degree_text = degree_text.replace("Bachelor of Laws", "Master of Laws (LL.M.)")
            degree_text = degree_text.replace("Bachelor", "Master")

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
        "institution_th": uni.get("name_th") or uni["name"],
        "country": uni["country"],
        "category": uni.get("category", "University"),
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
