"""Realistic Thai and International Name Banks for High-Fidelity Synthetic Profiles.

Categorized into:
- Thai Male & Female Names (with standardized RTGS-style Romanization)
- Authentic Thai Surnames (Traditional, Sino-Thai, Modern)
- Thai Popular Workplace Nicknames (ชื่อเล่น) in Thai and English
- International Names (Anglo-American, East Asian, Southeast Asian, South Asian, European)
"""

import random
from typing import Dict, List, Optional, Tuple

# ==============================================================================
# 1. THAI NAME BANKS
# ==============================================================================

# (Thai Name, Romanized Name)
THAI_MALE_NAMES: List[Tuple[str, str]] = [
    ("กิตติพงษ์", "Kittipong"),
    ("ณัฐพร", "Nattaporn"),
    ("ธนวัฒน์", "Thanawat"),
    ("วรุตม์", "Warut"),
    ("ศุภชัย", "Supachai"),
    ("วรภัทร", "Vorapat"),
    ("ปิยพงษ์", "Piyapong"),
    ("ภัทรพล", "Pattaraphol"),
    ("ธนากร", "Thanakorn"),
    ("ชวัลกร", "Chawankorn"),
    ("ธีรภัทร", "Theerapat"),
    ("ชนกันต์", "Chonnakarn"),
    ("ปิยวัฒน์", "Piyawat"),
    ("ภูริณัฐ", "Phurinat"),
    ("กษิดิศ", "Kasidit"),
    ("นพคุณ", "Noppakhun"),
    ("วรปรัชญ์", "Voraprach"),
    ("วริทธิ์", "Varit"),
    ("ศิวกร", "Sivakorn"),
    ("จิรวัฒน์", "Jirawat"),
    ("พีรดนย์", "Peeradon"),
    ("พิชญะ", "Pitchaya"),
    ("เอกลักษณ์", "Ekkaluck"),
    ("นรวิชญ์", "Norrawit"),
    ("กฤติน", "Krittin"),
    ("พงศกร", "Pongsakorn"),
    ("ชานนท์", "Chanon"),
    ("รัชชานนท์", "Ratchanon"),
    ("ศุภวิชญ์", "Suphawit"),
    ("ธนกฤต", "Thanakrit"),
    ("ณภัทร", "Naphat"),
    ("คณิน", "Kanin"),
    ("เมธัส", "Methas"),
    ("ธนภัทร", "Thanaphat"),
    ("อัครวินท์", "Akarawin"),
    ("กรวิชญ์", "Kornwich"),
    ("พลวัฒน์", "Phonlawat"),
    ("นราธิป", "Narathip"),
    ("รัชพล", "Ratchaphol"),
    ("นฤเบศร์", "Narubet"),
    ("กานต์", "Karn"),
    ("ชัยวัฒน์", "Chaiwat"),
    ("ฐิติกร", "Thitikorn"),
    ("วรินทร", "Varintorn"),
    ("สิทธิพงศ์", "Sitthiphong"),
    ("ธีรดนย์", "Teeradon"),
    ("รณกร", "Ronnakorn"),
    ("ศรุต", "Sarut"),
    ("อภิสิทธิ์", "Abhisit"),
    ("บุณยกร", "Boonyakorn"),
    ("เจษฎา", "Jetsada"),
    ("อภิวัฒน์", "Apiwat"),
    ("เกียรติศักดิ์", "Kiattisak"),
    ("ปวริศ", "Pawaris"),
    ("วีรภัทร", "Weerapat"),
]

THAI_FEMALE_NAMES: List[Tuple[str, str]] = [
    ("ศิริพร", "Siriporn"),
    ("พิมพ์ชนก", "Pimchanok"),
    ("อภิญญา", "Apinya"),
    ("กัญญารัตน์", "Kanyarat"),
    ("กนกพร", "Kanokporn"),
    ("พัชรพร", "Patcharaporn"),
    ("ภัทรวดี", "Phatrawadee"),
    ("ชนนนิกานต์", "Channonikarn"),
    ("วรรณภา", "Wannapha"),
    ("ญาณิศา", "Yanisa"),
    ("นภัสสร", "Napatsorn"),
    ("พิมพรรณ", "Pimphan"),
    ("มินตรา", "Mintra"),
    ("ศุภิสรา", "Supissara"),
    ("ธัญชนก", "Thanchanok"),
    ("รินรดา", "Rinrada"),
    ("ลภัสรดา", "Laphasrada"),
    ("พิชญา", "Pitchaya"),
    ("อารียา", "Areeya"),
    ("ชนิกานต์", "Chanikan"),
    ("วรัทยา", "Warattaya"),
    ("ศศิภา", "Sasipha"),
    ("ชลธิชา", "Chonthicha"),
    ("พลอยไพลิน", "Ployphailin"),
    ("อัจฉรา", "Atchara"),
    ("จุฬารัตน์", "Chularat"),
    ("เขมิกา", "Khemika"),
    ("ปิยธิดา", "Piyathida"),
    ("กุลธิดา", "Kulthida"),
    ("มนัสนันท์", "Manatsanan"),
    ("ธนพร", "Thanaporn"),
    ("ปัณฑิตา", "Panthita"),
    ("พรปวีณ์", "Pornpawee"),
    ("ภาวิณี", "Pawinee"),
    ("นลินี", "Nalinee"),
    ("วริศรา", "Warisara"),
    ("ธิษณา", "Thisana"),
    ("ศิรภัสสร", "Sirapatsorn"),
    ("ธมลวรรณ", "Thamolwan"),
    ("กานต์พิชชา", "Karnpitcha"),
    ("นันท์นภัส", "Nannaphat"),
    ("จุฑามาศ", "Juthamas"),
    ("สุพิชชา", "Supitcha"),
    ("กุลนันท์", "Kulnan"),
    ("อรณิชา", "Ornnicha"),
    ("พัทธนันท์", "Phatthanan"),
    ("ธัญญารัตน์", "Thanyarat"),
    ("กวิสรา", "Kawisara"),
    ("ณัฐณิชา", "Natnicha"),
    ("แพรวา", "Praewa"),
    ("ปาณิสรา", "Panisara"),
    ("จิดาภา", "Jidapa"),
    ("สุชานันท์", "Suchanan"),
    ("วิมลวรรณ", "Wimonwan"),
    ("ทิพวรรณ", "Thipphawan"),
]

# (Thai Surname, Romanized Surname)
THAI_SURNAMES: List[Tuple[str, str]] = [
    ("วงษ์ประดิษฐ์", "Vongpradit"),
    ("ศรีสุข", "Srisuk"),
    ("รัตนากร", "Rattanakorn"),
    ("สุวรรณรัตน์", "Suwanarat"),
    ("แก้วมณี", "Kaewmanee"),
    ("เจริญสุข", "Charoensuk"),
    ("สันติภาพ", "Santipap"),
    ("กิตติสุข", "Kittisuk"),
    ("บุณยสิทธิ์", "Bunyasit"),
    ("พัฒนาวิทย์", "Pattanawit"),
    ("อัศวรุ่งเรือง", "Asawarungruang"),
    ("เลิศพิชญานันท์", "Lertpichayanant"),
    ("สถิรพร", "Sathiraporn"),
    ("วิริยะพาณิชย์", "Wiriyapanich"),
    ("ไชยศิริ", "Chaisiri"),
    ("เตชะวณิช", "Techawanich"),
    ("ศิริวัฒนา", "Siriwattana"),
    ("จันทรานนท์", "Chantranon"),
    ("โสภณพนิช", "Sophonpanich"),
    ("กาญจนประดิษฐ์", "Kanchanapradit"),
    ("เกียรติไพบูลย์", "Kiatpaiboon"),
    ("ทัศนวิสุทธิ์", "Tassanawisut"),
    ("ดำรงธรรม", "Damrongtham"),
    ("พิทยานุกูล", "Pittayanukul"),
    ("รัตนโชติ", "Rattanachot"),
    ("สิริโภคทรัพย์", "Siriphokasap"),
    ("จงประสิทธิ์", "Jongprasit"),
    ("เลิศวัฒนากุล", "Lertwattanakul"),
    ("ภูมิรัตน์", "Bhumiratana"),
    ("วรเชษฐ์กุล", "Worachetkul"),
    ("วิจิตรสุนทร", "Wijitsunthorn"),
    ("ธรรมสถิตย์", "Thammasathit"),
    ("เมธาวีวงศ์", "Methaweewong"),
    ("ศักดิ์เจริญกิจ", "Sakcharoenkit"),
    ("ปิยสิริพร", "Piyasiriporn"),
    ("ชนะไพศาล", "Chanapaisan"),
    ("อนันตชล", "Anantachon"),
    ("บุญยรัตกลิน", "Boonyaratkalin"),
    ("วราภรณ์สกุล", "Warapornsakul"),
    ("สุขสมบูรณ์", "Suksomboon"),
    ("กิจวณิชย์กุล", "Kitwanitkul"),
    ("เลิศปัญญาวุฒิ", "Lertpanyawut"),
    ("ธนโชคกุล", "Thanachokkul"),
    ("โชติรสกุล", "Chotirotsakul"),
    ("วงศ์วิลาศ", "Wongwilas"),
    ("จินดาวงศ์", "Jindawong"),
    ("พรประภัทร", "Pornpraphat"),
    ("ชาญณรงค์", "Channarong"),
    ("บุณยเกียรติ", "Boonyakiat"),
    ("อัครเดชไพศาล", "Akaradejpaisan"),
]

# Popular Workplace Nicknames (ชื่อเล่นไทย + English Transliteration)
THAI_NICKNAMES: List[Tuple[str, str]] = [
    ("แบงค์", "Bank"),
    ("มายด์", "Mind"),
    ("เจมส์", "James"),
    ("พลอย", "Ploy"),
    ("ออม", "Aom"),
    ("บอส", "Boss"),
    ("ต้น", "Ton"),
    ("โบว์", "Bow"),
    ("ปลาย", "Plai"),
    ("บาส", "Bas"),
    ("มุก", "Mook"),
    ("กานต์", "Karn"),
    ("ฟลุ๊ค", "Fluke"),
    ("ต้า", "Tar"),
    ("เบสท์", "Best"),
    ("นุ่น", "Noon"),
    ("วิน", "Win"),
    ("นิว", "New"),
    ("ภีม", "Peem"),
    ("ข้าวฟ่าง", "Khao-fang"),
    ("จูน", "June"),
    ("บี", "Bee"),
    ("โอม", "Ohm"),
    ("มาร์ค", "Mark"),
    ("เคน", "Ken"),
    ("ปาล์ม", "Palm"),
    ("เฟิร์น", "Fern"),
    ("ฝน", "Fon"),
    ("อาร์ต", "Art"),
    ("ตูน", "Toon"),
    ("แม็กซ์", "Max"),
    ("นัท", "Nut"),
    ("แนน", "Nan"),
    ("เต้", "Tae"),
    ("แอน", "Ann"),
]

# ==============================================================================
# 2. INTERNATIONAL NAME BANKS (CATEGORIZED BY REGIONAL ORIGIN)
# ==============================================================================

# Western / Anglo-American
WESTERN_FIRST_NAMES_MALE = [
    "Alexander",
    "Liam",
    "Oliver",
    "Lucas",
    "Benjamin",
    "William",
    "Ethan",
    "Henry",
    "Sebastian",
    "James",
    "Daniel",
    "Gabriel",
    "Julian",
    "Thomas",
    "Arthur",
    "Felix",
    "Noah",
    "Samuel",
    "Christopher",
    "Nicholas",
]

WESTERN_FIRST_NAMES_FEMALE = [
    "Sophia",
    "Charlotte",
    "Emily",
    "Amelia",
    "Harper",
    "Evelyn",
    "Isabella",
    "Olivia",
    "Ava",
    "Chloe",
    "Emma",
    "Grace",
    "Victoria",
    "Clara",
    "Elena",
    "Hannah",
    "Audrey",
    "Zoe",
    "Maya",
    "Stella",
]

WESTERN_LAST_NAMES = [
    "Anderson",
    "Miller",
    "Vance",
    "Montgomery",
    "Hayes",
    "Bennett",
    "Davis",
    "Watson",
    "Taylor",
    "Brooks",
    "Sullivan",
    "Henderson",
    "Reynolds",
    "Chapman",
    "Morrison",
    "Fischer",
    "Williams",
    "Smith",
    "Carter",
    "Phillips",
]

# East Asian: Chinese, Japanese, Korean
EAST_ASIAN_NAMES: List[Dict[str, str]] = [
    # Chinese
    {"first": "Wei", "last": "Zhang", "origin": "East Asian (Chinese)"},
    {"first": "Meiling", "last": "Chen", "origin": "East Asian (Chinese)"},
    {"first": "Jian", "last": "Liu", "origin": "East Asian (Chinese)"},
    {"first": "Xiao", "last": "Wang", "origin": "East Asian (Chinese)"},
    {"first": "Li", "last": "Yang", "origin": "East Asian (Chinese)"},
    {"first": "Jing", "last": "Zhao", "origin": "East Asian (Chinese)"},
    {"first": "Haoran", "last": "Huang", "origin": "East Asian (Chinese)"},
    {"first": "Ruoxi", "last": "Lin", "origin": "East Asian (Chinese)"},
    {"first": "Junjie", "last": "Wu", "origin": "East Asian (Chinese)"},
    {"first": "Siyuan", "last": "Xu", "origin": "East Asian (Chinese)"},
    # Japanese
    {"first": "Haruto", "last": "Tanaka", "origin": "East Asian (Japanese)"},
    {"first": "Sakura", "last": "Sato", "origin": "East Asian (Japanese)"},
    {"first": "Kenji", "last": "Takahashi", "origin": "East Asian (Japanese)"},
    {"first": "Yui", "last": "Watanabe", "origin": "East Asian (Japanese)"},
    {"first": "Daiki", "last": "Kobayashi", "origin": "East Asian (Japanese)"},
    {"first": "Aoi", "last": "Suzuki", "origin": "East Asian (Japanese)"},
    {"first": "Ren", "last": "Yamamoto", "origin": "East Asian (Japanese)"},
    {"first": "Misaki", "last": "Ito", "origin": "East Asian (Japanese)"},
    {"first": "Yuto", "last": "Nakamura", "origin": "East Asian (Japanese)"},
    {"first": "Hina", "last": "Saito", "origin": "East Asian (Japanese)"},
    # Korean
    {"first": "Jun-ho", "last": "Kim", "origin": "East Asian (Korean)"},
    {"first": "Min-seo", "last": "Lee", "origin": "East Asian (Korean)"},
    {"first": "Ji-won", "last": "Park", "origin": "East Asian (Korean)"},
    {"first": "Do-hyun", "last": "Choi", "origin": "East Asian (Korean)"},
    {"first": "Seo-yeon", "last": "Jung", "origin": "East Asian (Korean)"},
    {"first": "Hyun-woo", "last": "Kang", "origin": "East Asian (Korean)"},
    {"first": "Ha-eun", "last": "Cho", "origin": "East Asian (Korean)"},
    {"first": "Tae-hyung", "last": "Yoon", "origin": "East Asian (Korean)"},
    {"first": "Ye-jin", "last": "Shin", "origin": "East Asian (Korean)"},
    {"first": "Sung-min", "last": "Han", "origin": "East Asian (Korean)"},
]

# Southeast Asian (Singapore, Malaysia, Vietnam, Philippines, Indonesia)
SEA_NAMES: List[Dict[str, str]] = [
    {"first": "Darren", "last": "Tan", "origin": "Southeast Asian (Singapore)"},
    {"first": "Cheryl", "last": "Lim", "origin": "Southeast Asian (Singapore)"},
    {"first": "Wei Lun", "last": "Ng", "origin": "Southeast Asian (Malaysia)"},
    {"first": "Jonathan", "last": "Wong", "origin": "Southeast Asian (Malaysia)"},
    {"first": "Nguyen Van", "last": "Minh", "origin": "Southeast Asian (Vietnam)"},
    {"first": "Tran Thi", "last": "Mai", "origin": "Southeast Asian (Vietnam)"},
    {"first": "Le Hoang", "last": "Anh", "origin": "Southeast Asian (Vietnam)"},
    {"first": "Maria", "last": "Santos", "origin": "Southeast Asian (Philippines)"},
    {"first": "Kevin", "last": "Bautista", "origin": "Southeast Asian (Philippines)"},
    {"first": "Patricia", "last": "Reyes", "origin": "Southeast Asian (Philippines)"},
    {"first": "Arya", "last": "Pratama", "origin": "Southeast Asian (Indonesia)"},
    {"first": "Siti", "last": "Nurhaliza", "origin": "Southeast Asian (Indonesia)"},
]

# South Asian (India, Regional Hubs)
SOUTH_ASIAN_NAMES: List[Dict[str, str]] = [
    {"first": "Aarav", "last": "Sharma", "origin": "South Asian (India)"},
    {"first": "Priya", "last": "Patel", "origin": "South Asian (India)"},
    {"first": "Rohan", "last": "Mehta", "origin": "South Asian (India)"},
    {"first": "Ananya", "last": "Iyer", "origin": "South Asian (India)"},
    {"first": "Vikram", "last": "Nair", "origin": "South Asian (India)"},
    {"first": "Divya", "last": "Rao", "origin": "South Asian (India)"},
    {"first": "Aditya", "last": "Verma", "origin": "South Asian (India)"},
    {"first": "Kavita", "last": "Krishnan", "origin": "South Asian (India)"},
    {"first": "Arjun", "last": "Singhania", "origin": "South Asian (India)"},
    {"first": "Neha", "last": "Gupta", "origin": "South Asian (India)"},
]

# Continental European
EUROPEAN_NAMES: List[Dict[str, str]] = [
    {"first": "Lucas", "last": "Dupont", "origin": "European (France)"},
    {"first": "Matteo", "last": "Rossi", "origin": "European (Italy)"},
    {"first": "Felix", "last": "Müller", "origin": "European (Germany)"},
    {"first": "Clara", "last": "Lindqvist", "origin": "European (Sweden)"},
    {"first": "Elena", "last": "Petrova", "origin": "European (Eastern Europe)"},
    {"first": "Jonas", "last": "Weber", "origin": "European (Switzerland)"},
    {"first": "Lars", "last": "Nielsen", "origin": "European (Denmark)"},
    {"first": "Sofie", "last": "Vermeulen", "origin": "European (Netherlands)"},
]


# ==============================================================================
# 3. HIGH-FIDELITY NAME RESOLUTION HELPER FUNCTIONS
# ==============================================================================

class SyntheticCandidateIdentity:
    def __init__(
        self,
        full_name: str,
        full_name_th: Optional[str] = None,
        first_name: str = "",
        last_name: str = "",
        nickname: Optional[str] = None,
        nickname_th: Optional[str] = None,
        gender: str = "Neutral",
        cultural_background: str = "Thai",
        clean_email_slug: str = "",
    ):
        self.full_name = full_name
        self.full_name_th = full_name_th
        self.first_name = first_name
        self.last_name = last_name
        self.nickname = nickname
        self.nickname_th = nickname_th
        self.gender = gender
        self.cultural_background = cultural_background
        self.clean_email_slug = clean_email_slug


def generate_candidate_identity(
    language: str = "en",
    gender: Optional[str] = None,
    include_nickname: bool = True,
    origin_preference: Optional[str] = None,
) -> SyntheticCandidateIdentity:
    """Generates a high-fidelity synthetic candidate identity across Thai and International dimensions."""
    chosen_gender = gender if gender in ["male", "female"] else random.choice(["male", "female"])

    if language == "th":
        # Pure Thai Profile (ชื่อภาษาไทย พร้อมชื่อเล่นไทย)
        first_pair = random.choice(THAI_MALE_NAMES if chosen_gender == "male" else THAI_FEMALE_NAMES)
        surname_pair = random.choice(THAI_SURNAMES)
        nick_pair = random.choice(THAI_NICKNAMES)

        fn_th, fn_en = first_pair
        ln_th, ln_en = surname_pair
        nn_th, nn_en = nick_pair

        if include_nickname and random.random() < 0.75:
            full_th = f"{fn_th} {ln_th} ({nn_th})"
            full_en = f"{fn_en} ({nn_en}) {ln_en}"
        else:
            full_th = f"{fn_th} {ln_th}"
            full_en = f"{fn_en} {ln_en}"

        clean_slug = f"{fn_en.lower()}.{ln_en.lower()}"
        return SyntheticCandidateIdentity(
            full_name=full_th,
            full_name_th=full_th,
            first_name=fn_th,
            last_name=ln_th,
            nickname=nn_en,
            nickname_th=nn_th,
            gender=chosen_gender.capitalize(),
            cultural_background="Thai (Domestic Native)",
            clean_email_slug=clean_slug,
        )

    elif language == "mixed":
        # Bilingual / Hybrid Profile (Thai candidate with Romanized name and Thai counterpart)
        first_pair = random.choice(THAI_MALE_NAMES if chosen_gender == "male" else THAI_FEMALE_NAMES)
        surname_pair = random.choice(THAI_SURNAMES)
        nick_pair = random.choice(THAI_NICKNAMES)

        fn_th, fn_en = first_pair
        ln_th, ln_en = surname_pair
        nn_th, nn_en = nick_pair

        full_en = f"{fn_en} ({nn_en}) {ln_en}" if include_nickname else f"{fn_en} {ln_en}"
        full_th = f"{fn_th} {ln_th} ({nn_th})" if include_nickname else f"{fn_th} {ln_th}"
        clean_slug = f"{fn_en.lower()}.{ln_en.lower()}"

        return SyntheticCandidateIdentity(
            full_name=full_en,
            full_name_th=full_th,
            first_name=fn_en,
            last_name=ln_en,
            nickname=nn_en,
            nickname_th=nn_th,
            gender=chosen_gender.capitalize(),
            cultural_background="Thai-International Bilingual",
            clean_email_slug=clean_slug,
        )

    else:  # language == "en" (or international)
        # Probabilistic distribution:
        # 45% Romanized Thai Professional (high relevance in Thai/SEA job market)
        # 25% Western / Anglo-American
        # 15% East Asian (Chinese, Japanese, Korean)
        # 10% Southeast Asian (SG, MY, VN, PH)
        # 5% South Asian / European
        dice = random.random()

        if dice < 0.45 and origin_preference != "international_only":
            # Romanized Thai Professional
            first_pair = random.choice(THAI_MALE_NAMES if chosen_gender == "male" else THAI_FEMALE_NAMES)
            surname_pair = random.choice(THAI_SURNAMES)
            nick_pair = random.choice(THAI_NICKNAMES)

            fn_th, fn_en = first_pair
            ln_th, ln_en = surname_pair
            nn_th, nn_en = nick_pair

            full_en = f"{fn_en} ({nn_en}) {ln_en}" if (include_nickname and random.random() < 0.5) else f"{fn_en} {ln_en}"
            full_th = f"{fn_th} {ln_th}"
            clean_slug = f"{fn_en.lower()}.{ln_en.lower()}"

            return SyntheticCandidateIdentity(
                full_name=full_en,
                full_name_th=full_th,
                first_name=fn_en,
                last_name=ln_en,
                nickname=nn_en,
                nickname_th=nn_th,
                gender=chosen_gender.capitalize(),
                cultural_background="Thai Professional (International CV)",
                clean_email_slug=clean_slug,
            )

        elif dice < 0.70:
            # Western / Anglo-American
            fn = random.choice(WESTERN_FIRST_NAMES_MALE if chosen_gender == "male" else WESTERN_FIRST_NAMES_FEMALE)
            ln = random.choice(WESTERN_LAST_NAMES)
            clean_slug = f"{fn.lower()}.{ln.lower()}"

            return SyntheticCandidateIdentity(
                full_name=f"{fn} {ln}",
                full_name_th=None,
                first_name=fn,
                last_name=ln,
                nickname=None,
                nickname_th=None,
                gender=chosen_gender.capitalize(),
                cultural_background="Western / Global Expat",
                clean_email_slug=clean_slug,
            )

        elif dice < 0.85:
            # East Asian
            item = random.choice(EAST_ASIAN_NAMES)
            clean_slug = f"{item['first'].lower().replace('-', '')}.{item['last'].lower()}"
            return SyntheticCandidateIdentity(
                full_name=f"{item['first']} {item['last']}",
                full_name_th=None,
                first_name=item["first"],
                last_name=item["last"],
                nickname=None,
                nickname_th=None,
                gender=chosen_gender.capitalize(),
                cultural_background=item["origin"],
                clean_email_slug=clean_slug,
            )

        elif dice < 0.95:
            # Southeast Asian
            item = random.choice(SEA_NAMES)
            clean_slug = f"{item['first'].lower().replace(' ', '.')}.{item['last'].lower()}"
            return SyntheticCandidateIdentity(
                full_name=f"{item['first']} {item['last']}",
                full_name_th=None,
                first_name=item["first"],
                last_name=item["last"],
                nickname=None,
                nickname_th=None,
                gender=chosen_gender.capitalize(),
                cultural_background=item["origin"],
                clean_email_slug=clean_slug,
            )

        else:
            # South Asian or Continental European
            pool = SOUTH_ASIAN_NAMES if random.random() < 0.5 else EUROPEAN_NAMES
            item = random.choice(pool)
            clean_slug = f"{item['first'].lower()}.{item['last'].lower()}"
            return SyntheticCandidateIdentity(
                full_name=f"{item['first']} {item['last']}",
                full_name_th=None,
                first_name=item["first"],
                last_name=item["last"],
                nickname=None,
                nickname_th=None,
                gender=chosen_gender.capitalize(),
                cultural_background=item["origin"],
                clean_email_slug=clean_slug,
            )


# Compatibility Lists for legacy imports or tests
FIRST_NAMES_EN = [name[1] for name in THAI_MALE_NAMES[:15]] + WESTERN_FIRST_NAMES_MALE[:15] + WESTERN_FIRST_NAMES_FEMALE[:15]
LAST_NAMES_EN = [name[1] for name in THAI_SURNAMES[:15]] + WESTERN_LAST_NAMES[:15]
FIRST_NAMES_TH = [name[0] for name in THAI_MALE_NAMES[:20]] + [name[0] for name in THAI_FEMALE_NAMES[:20]]
LAST_NAMES_TH = [name[0] for name in THAI_SURNAMES[:30]]
