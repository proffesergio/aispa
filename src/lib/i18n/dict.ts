export type Language = "en" | "bn";

export const banglaDigitsMap: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

export function toBanglaNumerals(input: string | number): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (digit) => banglaDigitsMap[digit] || digit);
}

export function formatBDT(amount: number, lang: Language): string {
  const formattedNumber = amount.toLocaleString("en-US");
  if (lang === "bn") {
    return `৳${toBanglaNumerals(formattedNumber)}`;
  }
  return `BDT ${formattedNumber}`;
}

/**
 * Formats price according to active language mode.
 * In English: USD ($85)
 * In Bangla: BDT (৳১০,২০০) using 1 USD = 120 BDT conversion rounded cleanly.
 */
export function formatPrice(usdAmount: number, lang: Language): string {
  if (lang === "bn") {
    const bdtAmount = Math.round(usdAmount * 120 / 50) * 50; // Clean 50 BDT rounding
    const formatted = bdtAmount.toLocaleString("en-US");
    return `৳${toBanglaNumerals(formatted)}`;
  }
  return `$${usdAmount}`;
}

export const translations = {
  en: {
    // Brand
    appName: "AiSpa",
    tagline: "Smart Salon & Spa Booking System",
    langName: "English",
    toggleLang: "বাংলা",

    // Navbar
    navTreatments: "Treatments",
    navAiMatch: "AI Match",
    navNextAvailable: "Next Available",
    navReviews: "Reviews",
    navSignIn: "Sign In",
    navBookNow: "Book Now",
    liveSlotsPill: "3 Slots Open Today",
    aiConciergeBtn: "AI Concierge",

    // Hero Section
    heroBadge: "AI-Powered Smart Salon Scheduling",
    heroTitleLine1: "Elevate Your Beauty &",
    heroTitleLine2: "Personal Wellness",
    heroSubtitle: "Experience predictive slot booking, weather-matched skin therapy, and 1-click reservations at Bangladesh's premier luxury salon.",
    heroSearchPlaceholder: "Try 'Hydro Facial', 'Balayage', or 'Hydra Glow'...",
    heroSearchBtn: "Find Slots",
    heroAiActive: "AI Matcher Active",

    // Hero Filters
    heroFilterAll: "All Services",
    heroFilterFacial: "Hydro Facials",
    heroFilterHair: "Hair & Styling",
    heroFilterNails: "Nails Couture",
    heroFilterMassage: "Spa Massage",

    // AI Recommendation Widget
    aiRecBadge: "Proactive AI Recommendation",
    aiRecTitle: "Weather & Skin Match Engine",
    aiRecSubtitle: "Real-time atmospheric analysis based on local humidity and UV index.",
    weatherCardTitle: "Dhaka Ambient Climate",
    weatherCondition: "Sunny 32°C • High Humidity (78%)",
    weatherRecommendationTitle: "Recommended Therapy Today",
    weatherRecDesc: "High humidity accelerates sebum production. We suggest our Hydro-O2 Pore Purifier to restore pH balance.",
    aiMatchScore: "98% Match",
    bookTreatmentBtn: "Reserve Slot Now",

    // Service Categories
    servicesBadge: "Curated Treatment Menu",
    servicesTitle: "Luxury Services & AI Fit",
    servicesSubtitle: "Explore specialized treatments tailored to your personal biometric skin profile.",
    catAll: "All Categories",
    catHair: "Hair & Styling",
    catFacial: "Facials & Skin",
    catNails: "Nails Couture",
    catMassage: "Massage & Spa",
    instantBook: "Book Slot",
    mins: "Mins",

    // Service Items
    svc1Title: "Hydro-O2 Oxygen Facial",
    svc1Desc: "Deep pore infusion with botanical serums and cryo sculpting wand.",
    svc2Title: "Precision Cut & Botanical Gloss",
    svc2Desc: "Specialized haircut, scalp detox massage, and shine-enhancing glaze.",
    svc3Title: "Japanese Gel Couture Nails",
    svc3Desc: "Long-lasting non-toxic gel extension with hand-drawn nail art.",
    svc4Title: "Hot Stone Aromatherapy Massage",
    svc4Desc: "Volcanic stone tension relief infused with lavender essential oils.",
    svc5Title: "Balayage Hair Color Treatment",
    svc5Desc: "Custom hand-painted highlights with Bond-Repair hair treatment.",
    svc6Title: "24K Gold Luxury Skin Detox",
    svc6Desc: "Pure gold leaf firming facial for instant radiance and collagen boost.",

    // Next Available Slot Finder
    slotBadge: "Real-Time Urgency Matrix",
    slotTitle: "Next Available Open Slots",
    slotSubtitle: "Instant booking slots opening in the next 3 hours with up to 20% priority discount.",
    holdSlotBtn: "Hold Slot Now",
    startsIn: "Starts in",
    discountBadge: "OFF",

    // Testimonials
    reviewsBadge: "Verified Client Reviews",
    reviewsTitle: "Loved by Over 12,000 Clients",
    reviewsSubtitle: "Discover why clients rate AiSpa 4.9/5 stars for elegance and seamless AI booking.",
    rev1Name: "Anika Rahman",
    rev1Loc: "Gulshan 2, Dhaka",
    rev1Text: "The AI recommendation suggested the Hydro-O2 facial during high humidity week. My skin has never glowed like this!",
    rev2Name: "Nusrat Jahan",
    rev2Loc: "Dhanmondi, Dhaka",
    rev2Text: "Booking a 1-click slot took literally 10 seconds on mobile. The phone +880 OTP login is super smooth!",
    rev3Name: "Dr. Farhana Ahmed",
    rev3Loc: "Banani, Dhaka",
    rev3Text: "The atmosphere at the Downtown studio is world-class. Best salon booking experience in Bangladesh.",

    // Footer
    footerDesc: "The next-generation smart salon & spa booking engine. Real-time slot prediction, AI biometric skin matching, and effortless 1-click reservations.",
    vipTitle: "Join VIP AI Glow Club (Priority Slots)",
    emailPlaceholder: "Enter your email address...",
    joinBtn: "Join",
    vipSuccess: "✓ Welcome to the VIP Club! Check your inbox for your 15% welcome code.",
    navHeader1: "Smart Navigation",
    navHeader2: "Core Specialties",
    navHeader3: "Flagship Studios",
    loc1Name: "Gulshan Glass Pavilion",
    loc1Addr: "450 Gulshan Ave, Fl 3",
    loc1Status: "OPEN TODAY • 9AM - 9PM",
    loc2Name: "Dhanmondi Luxury Loft",
    loc2Addr: "Satmasjid Road, Fl 5",
    loc2Status: "OPEN TODAY • 10AM - 8PM",
    copyright: "© 2026 AiSpa Technologies, Inc. All rights reserved.",

    // Auth & Status
    loginTitle: "Welcome to AiSpa",
    loginSubtitle: "Book luxury spa & salon services with instant AI matching.",
    phoneLabel: "Bangladeshi Mobile Number",
    phonePlaceholder: "1712-345678",
    phoneHelper: "We'll send a 6-digit SMS verification code to your number.",
    sendOtpBtn: "Send Verification Code",
    sendingOtp: "Sending OTP...",
    invalidPhoneErr: "Please enter a valid BD phone number (+88013-019XXXXXXXX)",
    otpTitle: "Verify Mobile Number",
    otpSubtitle: "Enter the 6-digit code sent to",
    otpLabel: "6-Digit Verification Code",
    verifyBtn: "Verify & Continue",
    verifying: "Verifying Code...",
    resendOtp: "Resend Code",
    resendCountdown: "Resend available in",
    changeNumber: "Change phone number",
    invalidOtpErr: "Invalid or expired OTP code. Please try again.",
    orDivider: "OR CONTINUE WITH",
    googleAuth: "Continue with Google",
    facebookAuth: "Continue with Facebook",
    bdtPreviewTitle: "Localized BDT Service Catalog",
    sampleServiceTitle: "Hydro-O2 Oxygen Facial & Skin Glow",
    sampleServicePrice: 85,
    sampleServiceDuration: "45 Mins",
    rateLimitErr: "Too many OTP attempts. Please wait 10 minutes before retrying.",
    serverErr: "Something went wrong. Please check your internet connection.",
    successLogin: "Login Successful! Redirecting to Dashboard...",
  },
  bn: {
    // Brand
    appName: "আইস্পা",
    tagline: "স্মার্ট সেলুন এবং স্পা বুকিং সিস্টেম",
    langName: "বাংলা",
    toggleLang: "English",

    // Navbar
    navTreatments: "ট্রিটমেন্টসমূহ",
    navAiMatch: "এআই ম্যাচ",
    navNextAvailable: "পরবর্তী খালি স্লট",
    navReviews: "রিভিউ",
    navSignIn: "সাইন ইন",
    navBookNow: "বুকিং দিন",
    liveSlotsPill: "আজ ৩টি স্লট খালি",
    aiConciergeBtn: "এআই অ্যাসিস্ট্যান্ট",

    // Hero Section
    heroBadge: "এআই চালিত স্মার্ট সেলুন শিডিউলিং",
    heroTitleLine1: "আপনার রূপচর্চা ও",
    heroTitleLine2: "ওয়েলনেস সার্ভিস বাড়ান",
    heroSubtitle: "বাংলাদেশের সেরা লাক্সারি সেলুনে প্রেডিক্টিভ স্লট বুকিং, আবহাওয়া-ভিত্তিক স্কিন কেয়ার ও ১-ক্লিকে অ্যাপয়েন্টমেন্ট পান।",
    heroSearchPlaceholder: "খুঁজুন 'হাইড্রো ফেসিয়াল', 'হেয়ার কালার', বা 'ব্রাইডাল মেকআপ'...",
    heroSearchBtn: "স্লট খুঁজুন",
    heroAiActive: "এআই ম্যাচ চালু আছে",

    // Hero Filters
    heroFilterAll: "সকল সার্ভিস",
    heroFilterFacial: "হাইড্রো ফেসিয়াল",
    heroFilterHair: "হেয়ার ও স্টাইলিং",
    heroFilterNails: "নেল আর্ট",
    heroFilterMassage: "স্পা ও মাসাজ",

    // AI Recommendation Widget
    aiRecBadge: "প্রোঅ্যাক্টিভ এআই সাজেশন",
    aiRecTitle: "আবহাওয়া ও স্কিন ম্যাচ ইঞ্জিন",
    aiRecSubtitle: "স্থানীয় আর্দ্রতা ও ইউভি ইনডেক্সের ওপর ভিত্তি করে রিয়েল-টাইম বায়োমেট্রিক বিশ্লেষণ।",
    weatherCardTitle: "ঢাকা শহরের বর্তমান আবহাওয়া",
    weatherCondition: "সোনালী রোদ ৩২°সে • উচ্চ আর্দ্রতা (৭৮%)",
    weatherRecommendationTitle: "আজকের জন্য সেরা ট্রিটমেন্ট",
    weatherRecDesc: "উচ্চ আর্দ্রতা ত্বকে তেল বাড়ায়। স্কিনের পিএইচ ব্যালেন্স বজায় রাখতে আমাদের 'হাইড্রো-অক্সিজেন ফেসিয়াল' নিন।",
    aiMatchScore: "৯৮% ম্যাচ",
    bookTreatmentBtn: "স্লট বুক করুন",

    // Service Categories
    servicesBadge: "সেরা সার্ভিস ক্যাটালগ",
    servicesTitle: "লাক্সারি সার্ভিস ও এআই ফিট",
    servicesSubtitle: "আপনার ব্যক্তিগত স্কিন প্রোফাইলের জন্য বিশেষভাবে নির্বাচিত প্রিমিয়াম স্পা ও স্টাইলিং।",
    catAll: "সব ক্যাটাগরি",
    catHair: "হেয়ার ও স্টাইলিং",
    catFacial: "ফেসিয়াল ও স্কিন",
    catNails: "নেল আর্ট",
    catMassage: "মাসাজ ও স্পা",
    instantBook: "বুক করুন",
    mins: "মিনিট",

    // Service Items
    svc1Title: "হাইড্রো-অক্সিজেন ফেসিয়াল",
    svc1Desc: "বোটানিক্যাল সিরাম এবং ক্রায়ো স্কাল্পটিং এর মাধ্যমে গভীর ত্বক পরিষ্কার।",
    svc2Title: "প্রিসিশন কাট ও বোটানিক্যাল গ্লস",
    svc2Desc: "বিশেষজ্ঞ হেয়ারকাট, স্কাল্প ডিটক্স মাসাজ এবং শাইন এনহ্যান্সিং গ্লেজ।",
    svc3Title: "জাপানি জেল কুটিউর নেল আর্ট",
    svc3Desc: "দীর্ঘস্থায়ী নন-টক্সিক জেল এক্সটেনশন ও হাতে আঁকা নেল ডিজাইন।",
    svc4Title: "হট স্টোন অ্যারোমাথেরাপি মাসাজ",
    svc4Desc: "ল্যাভেন্ডার এসেনশিয়াল অয়েল দিয়ে ভলকানিক হট স্টোন রিল্যাক্সেশন।",
    svc5Title: "বালেয়াজ হেয়ার কালার ট্রিটমেন্ট",
    svc5Desc: "কাস্টম হ্যান্ড-পেইন্টেড হাইলাইটস ও বন্ড-রিপেয়ার হেয়ার স্পা।",
    svc6Title: "২৪কে গোল্ড লাক্সারি স্কিন ডিটক্স",
    svc6Desc: "তাৎক্ষণিক উজ্জ্বলতা ও কোলাজেন বৃদ্ধিতে খাঁটি স্বর্ণের পাতা সংবলিত ফেসিয়াল।",

    // Next Available Slot Finder
    slotBadge: "রিয়েল-টাইম স্লট মেট্রিক্স",
    slotTitle: "পরবর্তী উপলব্ধ খালি স্লট",
    slotSubtitle: "আগামী ৩ ঘণ্টার মধ্যে ২০% পর্যন্ত ছাড়ের বিশেষ বুকিং স্লটসমূহ।",
    holdSlotBtn: "স্লট হোল্ড করুন",
    startsIn: "শুরু হবে",
    discountBadge: "ছাড়",

    // Testimonials
    reviewsBadge: "যাচাইকৃত ক্লায়েন্ট রিভিউ",
    reviewsTitle: "১২,০০০+ সন্তুষ্ট ক্লায়েন্টের পছন্দ",
    reviewsSubtitle: "জানুন কেন আমাদের গ্রাহকরা আইস্পা-কে ৪.৯/৫ স্টার রেটিং প্রদান করেছেন।",
    rev1Name: "আনিকা রহমান",
    rev1Loc: "গুলশান ২, ঢাকা",
    rev1Text: "এআই আর্দ্রতার ওপর ভিত্তি করে ফেসিয়াল সাজেস্ট করেছিল। এত সুন্দর ত্বক আগে কখনও হয়নি!",
    rev2Name: "নুসরাত জাহান",
    rev2Loc: "ধানমণ্ডি, ঢাকা",
    rev2Text: "মোবাইলে ১-ক্লিকে বুকিং দিতে মাত্র ১০ সেকেন্ড লেগেছে। ৮৮০ মোবাইল ওটিপি দারুণ কাজ করে!",
    rev3Name: "ডা. ফারহানা আহমেদ",
    rev3Loc: "বনানী, ঢাকা",
    rev3Text: "গুলশান স্টুডিওর পরিবেশ সত্যিই চমৎকার। বাংলাদেশে বুকিংয়ের এমন আধুনিক অভিজ্ঞতা সেরা।",

    // Footer
    footerDesc: "বাংলাদেশের পরবর্তী প্রজন্মের স্মার্ট সেলুন ও স্পা বুকিং ইঞ্জিন। রিয়েল-টাইম স্লট প্রেডিকশন, বায়োমেট্রিক স্কিন ম্যাচিং এবং ১-ক্লিকে সহজ বুকিং।",
    vipTitle: "ভিআইপি এআই ক্লাবে যোগ দিন (বিশেষ স্লট)",
    emailPlaceholder: "আপনার ইমেইল দিন...",
    joinBtn: "যোগ দিন",
    vipSuccess: "✓ ভিআইপি ক্লাবে স্বাগতম! আপনার ইমেইলে ১৫% ডিসকাউন্ট কোড পাঠানো হয়েছে।",
    navHeader1: "স্মার্ট নেভিগেশন",
    navHeader2: "মূল বিশেষত্ব",
    navHeader3: "ফ্ল্যাগশিপ স্টুডিও",
    loc1Name: "গুলশান গ্লাস প্যাভিলিয়ন",
    loc1Addr: "৪৫০ গুলশান এভিনিউ, তলা ৩",
    loc1Status: "খোলা আছে • সকাল ৯টা - রাত ৯টা",
    loc2Name: "ধানমণ্ডি লাক্সারি লফ্ট",
    loc2Addr: "সাতমসজিদ রোড, তলা ৫",
    loc2Status: "খোলা আছে • সকাল ১০টা - রাত ৮টা",
    copyright: "© ২০২৬ আইস্পা টেকনোলজিস। সর্বস্বত্ব সংরক্ষিত।",

    // Auth & Status
    loginTitle: "আইস্পা-তে স্বাগতম",
    loginSubtitle: "তাৎক্ষণিক এআই পারসোনালাইজেশনের সাথে লাক্সারি স্পা ও সেলুন সার্ভিস বুক করুন।",
    phoneLabel: "বাংলাদেশী মোবাইল নম্বর",
    phonePlaceholder: "১৭১২-৩৪৫৬৭৮",
    phoneHelper: "আপনার নম্বরে একটি ৬-ডিজিটের এসএমএস ভেরিফিকেশন কোড পাঠানো হবে।",
    sendOtpBtn: "ভেরিফিকেশন কোড পাঠান",
    sendingOtp: "ওটিপি পাঠানো হচ্ছে...",
    invalidPhoneErr: "সঠিক বাংলাদেশী মোবাইল নম্বর দিন (+৮৮০১৩-০১৯XXXXXXXX)",
    otpTitle: "মোবাইল নম্বর যাচাইকরণ",
    otpSubtitle: "পাঠানো ৬-ডিজিটের কোডটি লিখুন:",
    otpLabel: "৬-ডিজিটের ভেরিফিকেশন কোড",
    verifyBtn: "যাচাই করুন ও এগিয়ে যান",
    verifying: "ওটিপি যাচাই করা হচ্ছে...",
    resendOtp: "পুনরায় কোড পাঠান",
    resendCountdown: "পুনরায় কোড পাবেন",
    changeNumber: "নম্বর পরিবর্তন করুন",
    invalidOtpErr: "ভুল অথবা মেয়াদোত্তীর্ণ ওটিপি কোড। আবার চেষ্টা করুন।",
    orDivider: "অথবা সোশ্যাল দিয়ে ঢুকুন",
    googleAuth: "গুগল দিয়ে অবিরত রাখুন",
    facebookAuth: "ফেসবুক দিয়ে অবিরত রাখুন",
    bdtPreviewTitle: "বাংলা টাকায় লোকাল সার্ভিস ক্যাটালগ",
    sampleServiceTitle: "হাইড্রো-অক্সিজেন ফেসিয়াল ও স্কিন গ্লো",
    sampleServicePrice: 85,
    sampleServiceDuration: "৪৫ মিনিট",
    rateLimitErr: "অতিরিক্ত ওটিপি অনুরোধ করা হয়েছে। ১০ মিনিট পর আবার চেষ্টা করুন।",
    serverErr: "কোথাও সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।",
    successLogin: "সফলভাবে লগইন হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...",
  },
};
