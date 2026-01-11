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
      },
      {
        name: "Vancomycin",
        correctClass: "Antibiotic",
        options: ["Antibiotic", "Antifungal", "Antiviral", "Immunosuppressant"],
        description: "Glycopeptide antibiotic for serious gram-positive infections",
        difficulty: "hard"
      },
      {
        name: "Doxycycline",
        correctClass: "Antibiotic",
        options: ["Antibiotic", "Antimalarial", "Anti-inflammatory", "Antacid"],
        description: "Tetracycline antibiotic with broad spectrum activity",
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
      },
      {
        name: "Tramadol",
        correctClass: "Opioid",
        options: ["Opioid", "NSAID", "Muscle Relaxant", "Anticonvulsant"],
        description: "Synthetic opioid for moderate to severe pain",
        difficulty: "medium"
      },
      {
        name: "Aspirin",
        correctClass: "NSAID",
        options: ["NSAID", "Anticoagulant", "Analgesic", "Antiplatelet"],
        description: "NSAID with anti-inflammatory and antiplatelet effects",
        difficulty: "medium"
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
      },
      {
        name: "Lisinopril",
        correctClass: "ACE Inhibitor",
        options: ["ACE Inhibitor", "ARB", "Beta Blocker", "Calcium Channel Blocker"],
        description: "ACE inhibitor for high blood pressure and heart failure",
        difficulty: "medium"
      },
      {
        name: "Amlodipine",
        correctClass: "Calcium Channel Blocker",
        options: ["Calcium Channel Blocker", "Beta Blocker", "ACE Inhibitor", "Diuretic"],
        description: "Calcium channel blocker for hypertension and angina",
        difficulty: "hard"
      },
      {
        name: "Furosemide",
        correctClass: "Diuretic",
        options: ["Diuretic", "Beta Blocker", "ACE Inhibitor", "Vasodilator"],
        description: "Loop diuretic for fluid retention and heart failure",
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
      },
      {
        name: "Sitagliptin",
        correctClass: "DPP-4 Inhibitor",
        options: ["DPP-4 Inhibitor", "Sulfonylurea", "GLP-1 Agonist", "SGLT-2 Inhibitor"],
        description: "DPP-4 inhibitor that increases insulin and decreases glucagon",
        difficulty: "hard"
      },
      {
        name: "Pioglitazone",
        correctClass: "Thiazolidinedione",
        options: ["Thiazolidinedione", "Biguanide", "Sulfonylurea", "Alpha-glucosidase Inhibitor"],
        description: "Insulin sensitizer that improves glucose utilization",
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
      },
      {
        name: "Ondansetron",
        correctClass: "Antiemetic",
        options: ["Antiemetic", "Prokinetic", "Antacid", "Antispasmodic"],
        description: "5-HT3 receptor antagonist for nausea and vomiting",
        difficulty: "hard"
      },
      {
        name: "Simethicone",
        correctClass: "Antiflatulent",
        options: ["Antiflatulent", "Antacid", "Laxative", "Antispasmodic"],
        description: "Anti-gas medication that reduces bloating",
        difficulty: "medium"
      }
    ]
  },
  {
    id: 6,
    title: "Respiratory Drugs",
    description: "Medications for breathing and lung conditions",
    icon: "RS",
    color: "#A8E6CF",
    drugs: [
      {
        name: "Salbutamol",
        correctClass: "Bronchodilator",
        options: ["Bronchodilator", "Corticosteroid", "Antihistamine", "Mucolytic"],
        description: "Short-acting beta-2 agonist for asthma and COPD",
        difficulty: "medium"
      },
      {
        name: "Prednisolone",
        correctClass: "Corticosteroid",
        options: ["Corticosteroid", "Bronchodilator", "Antihistamine", "Antitussive"],
        description: "Anti-inflammatory steroid for respiratory conditions",
        difficulty: "medium"
      },
      {
        name: "Montelukast",
        correctClass: "Leukotriene Antagonist",
        options: ["Leukotriene Antagonist", "Antihistamine", "Bronchodilator", "Corticosteroid"],
        description: "Leukotriene receptor antagonist for asthma prevention",
        difficulty: "hard"
      },
      {
        name: "Dextromethorphan",
        correctClass: "Antitussive",
        options: ["Antitussive", "Expectorant", "Bronchodilator", "Antihistamine"],
        description: "Cough suppressant for dry cough",
        difficulty: "medium"
      }
    ]
  },
  {
    id: 7,
    title: "Neurological Drugs",
    description: "Medications for brain and nervous system disorders",
    icon: "NR",
    color: "#FFB6C1",
    drugs: [
      {
        name: "Levodopa",
        correctClass: "Antiparkinsonian",
        options: ["Antiparkinsonian", "Anticonvulsant", "Antidepressant", "Antipsychotic"],
        description: "Dopamine precursor for Parkinson's disease",
        difficulty: "hard"
      },
      {
        name: "Phenytoin",
        correctClass: "Anticonvulsant",
        options: ["Anticonvulsant", "Antidepressant", "Anxiolytic", "Antipsychotic"],
        description: "Anti-seizure medication for epilepsy",
        difficulty: "medium"
      },
      {
        name: "Sertraline",
        correctClass: "Antidepressant",
        options: ["Antidepressant", "Anxiolytic", "Antipsychotic", "Mood Stabilizer"],
        description: "SSRI antidepressant for depression and anxiety",
        difficulty: "medium"
      },
      {
        name: "Haloperidol",
        correctClass: "Antipsychotic",
        options: ["Antipsychotic", "Antidepressant", "Anxiolytic", "Anticonvulsant"],
        description: "Typical antipsychotic for schizophrenia and psychosis",
        difficulty: "hard"
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