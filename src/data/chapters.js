export const chapters = [
  {
    id: 1,
    title: "Antibiotics & Antimicrobials",
    description: "Learn about drugs that fight bacterial infections",
    icon: "AB",
    color: "#FF6B6B",
    drugs: [
      {
        name: "Amoxicillin",
        correctClass: "Antibiotic",
        options: ["Antibiotic", "Analgesic", "Antidiabetic", "Statin"],
        description: "Penicillin-type antibiotic used to treat bacterial infections",
        difficulty: "easy"
      },
      {
        name: "Ciprofloxacin",
        correctClass: "Antibiotic",
        options: ["Antibiotic", "Antiviral", "Antifungal", "Analgesic"],
        description: "Fluoroquinolone antibiotic for serious bacterial infections",
        difficulty: "medium"
      },
      {
        name: "Azithromycin",
        correctClass: "Antibiotic",
        options: ["Antibiotic", "Steroid", "Antihistamine", "Bronchodilator"],
        description: "Macrolide antibiotic commonly used for respiratory infections",
        difficulty: "medium"
      }
    ]
  },
  {
    id: 2,
    title: "Pain Management",
    description: "Analgesics and pain relief medications",
    icon: "PM",
    color: "#4ECDC4",
    drugs: [
      {
        name: "Paracetamol",
        correctClass: "Analgesic",
        options: ["Antibiotic", "Analgesic", "Antidiabetic", "Statin"],
        description: "Common over-the-counter pain reliever and fever reducer",
        difficulty: "easy"
      },
      {
        name: "Ibuprofen",
        correctClass: "NSAID",
        options: ["NSAID", "Opioid", "Muscle Relaxant", "Anticonvulsant"],
        description: "Non-steroidal anti-inflammatory drug for pain and inflammation",
        difficulty: "easy"
      },
      {
        name: "Morphine",
        correctClass: "Opioid",
        options: ["Opioid", "NSAID", "Analgesic", "Sedative"],
        description: "Strong opioid pain medication for severe pain",
        difficulty: "hard"
      }
    ]
  },
  {
    id: 3,
    title: "Cardiovascular Drugs",
    description: "Medications for heart and blood vessel conditions",
    icon: "CV",
    color: "#45B7D1",
    drugs: [
      {
        name: "Atenolol",
        correctClass: "Beta Blocker",
        options: ["Beta Blocker", "ACE Inhibitor", "Diuretic", "Calcium Channel Blocker"],
        description: "Beta-blocker used to treat high blood pressure and heart conditions",
        difficulty: "medium"
      },
      {
        name: "Losartan",
        correctClass: "ARB",
        options: ["ARB", "ACE Inhibitor", "Beta Blocker", "Diuretic"],
        description: "Angiotensin receptor blocker for hypertension",
        difficulty: "hard"
      },
      {
        name: "Simvastatin",
        correctClass: "Statin",
        options: ["Statin", "Fibrate", "Beta Blocker", "Diuretic"],
        description: "Cholesterol-lowering medication",
        difficulty: "medium"
      }
    ]
  },
  {
    id: 4,
    title: "Diabetes Management",
    description: "Medications for blood sugar control",
    icon: "DM",
    color: "#96CEB4",
    drugs: [
      {
        name: "Metformin",
        correctClass: "Antidiabetic",
        options: ["Antibiotic", "Analgesic", "Antidiabetic", "Statin"],
        description: "First-line medication for type 2 diabetes",
        difficulty: "easy"
      },
      {
        name: "Insulin",
        correctClass: "Hormone",
        options: ["Hormone", "Antidiabetic", "Enzyme", "Vitamin"],
        description: "Essential hormone for blood glucose regulation",
        difficulty: "medium"
      },
      {
        name: "Glipizide",
        correctClass: "Sulfonylurea",
        options: ["Sulfonylurea", "Biguanide", "Insulin", "DPP-4 Inhibitor"],
        description: "Oral medication that stimulates insulin release",
        difficulty: "hard"
      }
    ]
  },
  {
    id: 5,
    title: "Gastrointestinal Drugs",
    description: "Medications for digestive system disorders",
    icon: "GI",
    color: "#FECA57",
    drugs: [
      {
        name: "Omeprazole",
        correctClass: "PPI",
        options: ["PPI", "H2 Blocker", "Antacid", "Prokinetic"],
        description: "Proton pump inhibitor for acid reflux and ulcers",
        difficulty: "medium"
      },
      {
        name: "Ranitidine",
        correctClass: "H2 Blocker",
        options: ["H2 Blocker", "PPI", "Antacid", "Antiemetic"],
        description: "Histamine-2 receptor blocker for stomach acid reduction",
        difficulty: "medium"
      },
      {
        name: "Loperamide",
        correctClass: "Antidiarrheal",
        options: ["Antidiarrheal", "Laxative", "Antiemetic", "Prokinetic"],
        description: "Medication to treat diarrhea",
        difficulty: "easy"
      }
    ]
  }
];

export const getAllDrugs = () => {
  return chapters.flatMap(chapter => 
    chapter.drugs.map(drug => ({
      ...drug,
      chapterId: chapter.id,
      chapterTitle: chapter.title
    }))
  );
};

export const getDrugsByChapter = (chapterId) => {
  const chapter = chapters.find(c => c.id === chapterId);
  return chapter ? chapter.drugs : [];
};

export const getChapterById = (chapterId) => {
  return chapters.find(c => c.id === chapterId);
};