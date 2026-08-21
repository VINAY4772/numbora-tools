export const CATEGORIES = {
  CALCULATORS: {
    id: 'calculators',
    title: 'Calculators',
    description: 'Essential financial, physical, and daily math tools',
    badgeClass: 'badge-calculator',
    gradient: 'var(--gradient-primary)',
    color: '#818cf8'
  },
  STUDENT_TOOLS: {
    id: 'student-tools',
    title: 'Student Tools',
    description: 'Academic tools for tracking grades, attendance, and percentages',
    badgeClass: 'badge-student',
    gradient: 'var(--gradient-secondary)',
    color: '#38bdf8'
  },
  UTILITY_TOOLS: {
    id: 'utility-tools',
    title: 'Utility Tools',
    description: 'High-productivity digital generators, converters, and assets',
    badgeClass: 'badge-utility',
    gradient: 'var(--gradient-emerald)',
    color: '#34d399'
  }
};

export const TOOLS = [
  // Calculators Category
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'calculators',
    description: 'Calculate body mass index, weight category, and healthy weight range advice.',
    iconName: 'Activity',
    tags: ['health', 'fitness', 'weight', 'body mass', 'bmi'],
    popular: true
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    category: 'calculators',
    description: 'Calculate your exact age in years, months, days, total time breakdown, and birthday countdown.',
    iconName: 'Calendar',
    tags: ['age', 'date', 'birthday', 'days', 'time'],
    popular: true
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    category: 'calculators',
    description: 'Calculate monthly loan EMI payments, total interest, and amortization visual schedule.',
    iconName: 'DollarSign',
    tags: ['loan', 'finance', 'mortgage', 'emi', 'bank', 'interest'],
    popular: true
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    category: 'calculators',
    description: 'Compute inclusive and exclusive GST, CGST/SGST split, and total amounts instantly.',
    iconName: 'Receipt',
    tags: ['tax', 'gst', 'business', 'vat', 'accounting'],
    popular: false
  },

  // Student Tools Category
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    category: 'student-tools',
    description: 'Calculate overall CGPA, semester GPA, percentage equivalence, and target requirements.',
    iconName: 'GraduationCap',
    tags: ['student', 'gpa', 'cgpa', 'grades', 'university', 'marks'],
    popular: true
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'student-tools',
    description: '4-in-1 tool for X% of Y, percentage increase/decrease, fraction to %, and marks %.',
    iconName: 'Percent',
    tags: ['math', 'percentage', 'ratio', 'discount', 'increase'],
    popular: true
  },
  {
    id: 'attendance-calculator',
    name: 'Attendance Calculator',
    category: 'student-tools',
    description: 'Track class attendance percentage and calculate how many classes to attend or bunk.',
    iconName: 'CheckSquare',
    tags: ['college', 'school', 'attendance', 'bunk', 'target', 'student'],
    popular: true
  },
  {
    id: 'marks-calculator',
    name: 'Marks Calculator',
    category: 'student-tools',
    description: 'Multi-subject grade & marks calculator with total percentage, average, and summary export.',
    iconName: 'BookOpen',
    tags: ['marks', 'exam', 'subjects', 'report card', 'grade'],
    popular: false
  },

  // Utility Tools Category
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    category: 'utility-tools',
    description: 'Generate high-resolution QR codes for text, URLs, WiFi, and contacts with PNG download.',
    iconName: 'QrCode',
    tags: ['qr', 'generator', 'code', 'barcode', 'wifi', 'url'],
    popular: true
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    category: 'utility-tools',
    description: 'Convert between Length, Weight, Temperature, Area, Speed, Volume, and Digital Storage.',
    iconName: 'Repeat',
    tags: ['units', 'convert', 'length', 'weight', 'metric', 'imperial'],
    popular: true
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    category: 'utility-tools',
    description: 'Create strong, secure passwords & memorable passphrases with entropy strength meter.',
    iconName: 'Key',
    tags: ['password', 'security', 'crypto', 'passphrase', 'random'],
    popular: true
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    category: 'utility-tools',
    description: 'Compress JPG, PNG, and WebP images client-side with quality sliders and side-by-side preview.',
    iconName: 'Image',
    tags: ['image', 'compress', 'photo', 'resize', 'jpeg', 'png'],
    popular: true
  }
];
