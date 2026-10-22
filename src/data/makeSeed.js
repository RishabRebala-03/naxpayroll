import fs from 'fs';

const firstNamesM = [
  'Aarav', 'Aditya', 'Ajay', 'Akash', 'Alok', 'Amit', 'Anand', 'Aniket', 'Aniruddh', 'Arjun',
  'Arun', 'Ashish', 'Bharat', 'Chirag', 'Deepak', 'Devendra', 'Gaurav', 'Harish', 'Hemant', 'Jitin',
  'Karan', 'Karthik', 'Ketan', 'Kishore', 'Madhav', 'Manish', 'Manoj', 'Mayank', 'Mukesh', 'Naman',
  'Naveen', 'Nikhil', 'Nilesh', 'Nitin', 'Pankaj', 'Pawan', 'Pradeep', 'Prashant', 'Praveen', 'Rahul',
  'Rajesh', 'Rakesh', 'Ramesh', 'Ravi', 'Rohan', 'Rohit', 'Sachin', 'Sameer', 'Sandip', 'Sanjay',
  'Saurabh', 'Shashank', 'Siddharth', 'Sourabh', 'Subhash', 'Sudhir', 'Sujit', 'Sumeet', 'Sunil', 'Suresh',
  'Tarun', 'Uday', 'Utkarsh', 'Varun', 'Venkatesh', 'Vikas', 'Vikram', 'Vinay', 'Vishal', 'Vivek'
];

const firstNamesF = [
  'Aishwarya', 'Ananya', 'Anita', 'Anjali', 'Ankita', 'Anshika', 'Archana', 'Arundhati', 'Bhavna', 'Charu',
  'Deepa', 'Divya', 'Garima', 'Geeta', 'Harshita', 'Isha', 'Jaya', 'Jyoti', 'Kalyani', 'Kavita',
  'Kirti', 'Komal', 'Lavanya', 'Madhuri', 'Malini', 'Meena', 'Meera', 'Mitali', 'Namrata', 'Neelam',
  'Neha', 'Nidhi', 'Nisha', 'Pallavi', 'Payal', 'Pooja', 'Poonam', 'Prachi', 'Prerna', 'Priya',
  'Priyanka', 'Radha', 'Ragini', 'Rakhi', 'Rashmi', 'Reema', 'Richa', 'Ritu', 'Roshni', 'Rupali',
  'Sakshi', 'Sandhya', 'Sangeeta', 'Shalini', 'Sharmila', 'Sheetal', 'Shipra', 'Shreya', 'Shruti', 'Smita',
  'Sneha', 'Sonal', 'Sonam', 'Sudha', 'Sujata', 'Sunita', 'Swati', 'Tanvi', 'Vandana', 'Vidya'
];

const lastNames = [
  'Agarwal', 'Banerjee', 'Bhat', 'Bhattacharya', 'Chauhan', 'Chawla', 'Chopra', 'Das', 'Deshmukh', 'Dey',
  'Dubey', 'Ganguly', 'Ghosh', 'Gowda', 'Gupta', 'Iyer', 'Jadhav', 'Jain', 'Jha', 'Joshi',
  'Kamble', 'Kapoor', 'Khanna', 'Kulkarni', 'Kumar', 'Mahajan', 'Malhotra', 'Mani', 'Mehta', 'Menon',
  'Mishra', 'Mukherjee', 'Nair', 'Nambiar', 'Pandey', 'Patel', 'Patil', 'Pawar', 'Prasad', 'Puri',
  'Ranganathan', 'Rao', 'Reddy', 'Roy', 'Saha', 'Saxena', 'Sen', 'Sengupta', 'Shah', 'Sharma',
  'Shetty', 'Shinde', 'Shukla', 'Singh', 'Singhania', 'Sinha', 'Subramanian', 'Sunder', 'Talwar', 'Tandon',
  'Tiwari', 'Tripathi', 'Upadhyay', 'Varma', 'Venkat', 'Verma', 'Vora', 'Vyas', 'Yadav'
];

const banks = [
  { name: 'HDFC Bank', ifsc: 'HDFC0001234' },
  { name: 'ICICI Bank', ifsc: 'ICIC0000021' },
  { name: 'State Bank of India', ifsc: 'SBIN0004567' },
  { name: 'Axis Bank', ifsc: 'UTIB0000843' },
  { name: 'Kotak Mahindra Bank', ifsc: 'KKBK0000261' },
];

const org1Locations = ['Bangalore', 'Hyderabad', 'Pune', 'Remote'];
const org2Locations = ['Mumbai', 'Gurgaon', 'Pune', 'Chennai'];

const deptsAndRoles = [
  {
    dept: 'Engineering',
    roles: [
      { title: 'Senior Software Engineer', structure: 'Senior Engineer', salary: 110000 },
      { title: 'Software Engineer', structure: 'Junior Engineer', salary: 65000 },
      { title: 'Lead Full Stack Engineer', structure: 'Manager', salary: 155000 },
      { title: 'DevOps & Cloud Engineer', structure: 'Senior Engineer', salary: 120000 },
      { title: 'QA Automation Engineer', structure: 'Junior Engineer', salary: 55000 },
      { title: 'Frontend Specialist', structure: 'Senior Engineer', salary: 105000 },
      { title: 'Data Platform Engineer', structure: 'Senior Engineer', salary: 125000 },
      { title: 'Associate Software Engineer', structure: 'Junior Engineer', salary: 48000 },
      { title: 'Principal Systems Architect', structure: 'Director', salary: 260000 },
      { title: 'Engineering Manager', structure: 'Manager', salary: 175000 },
    ]
  },
  {
    dept: 'Product & Design',
    roles: [
      { title: 'Senior Product Manager', structure: 'Manager', salary: 150000 },
      { title: 'Product Manager', structure: 'Manager', salary: 120000 },
      { title: 'Associate Product Manager', structure: 'Junior Engineer', salary: 62000 },
      { title: 'Lead UI/UX Designer', structure: 'Manager', salary: 140000 },
      { title: 'Senior Product Designer', structure: 'Senior Engineer', salary: 100000 },
      { title: 'UX Researcher', structure: 'Junior Engineer', salary: 58000 },
    ]
  },
  {
    dept: 'Human Resources',
    roles: [
      { title: 'Senior HRBP', structure: 'Senior Engineer', salary: 95000 },
      { title: 'HR Business Partner', structure: 'Associate', salary: 45000 },
      { title: 'Talent Acquisition Specialist', structure: 'Associate', salary: 42000 },
      { title: 'Payroll & Operations Lead', structure: 'Senior Engineer', salary: 85000 },
      { title: 'HR Operations Executive', structure: 'Associate', salary: 36000 },
    ]
  },
  {
    dept: 'Finance & Accounts',
    roles: [
      { title: 'Senior Financial Analyst', structure: 'Senior Engineer', salary: 92000 },
      { title: 'Financial Analyst', structure: 'Associate', salary: 48000 },
      { title: 'Accounts Payable Specialist', structure: 'Associate', salary: 38000 },
      { title: 'Corporate Finance Controller', structure: 'Manager', salary: 160000 },
    ]
  },
  {
    dept: 'Sales & Marketing',
    roles: [
      { title: 'Enterprise Account Executive', structure: 'Senior Engineer', salary: 115000 },
      { title: 'Business Development Representative', structure: 'Associate', salary: 40000 },
      { title: 'Senior Growth Marketer', structure: 'Senior Engineer', salary: 95000 },
      { title: 'Regional Sales Director', structure: 'Director', salary: 240000 },
      { title: 'Content & Brand Strategist', structure: 'Junior Engineer', salary: 54000 },
    ]
  },
  {
    dept: 'Customer Success',
    roles: [
      { title: 'Senior Customer Success Manager', structure: 'Senior Engineer', salary: 90000 },
      { title: 'Customer Success Specialist', structure: 'Associate', salary: 45000 },
      { title: 'Technical Support Lead', structure: 'Senior Engineer', salary: 82000 },
      { title: 'Tier-2 Support Engineer', structure: 'Associate', salary: 38000 },
    ]
  },
  {
    dept: 'IT & Security',
    roles: [
      { title: 'Senior Cloud Security Specialist', structure: 'Senior Engineer', salary: 125000 },
      { title: 'Systems Administrator', structure: 'Junior Engineer', salary: 58000 },
      { title: 'IT Infrastructure Lead', structure: 'Manager', salary: 145000 },
    ]
  }
];

function generatePan(index) {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const a = letters[index % 24];
  const b = letters[(index * 3) % 24];
  const c = letters[(index * 7) % 24];
  const d = 'P';
  const e = letters[(index * 11) % 24];
  const num = String(1000 + (index * 37) % 9000);
  const last = letters[(index * 13) % 24];
  return `${a}${b}${c}${d}${e}${num}${last}`;
}

function generateUan(index) {
  return String(100900000000 + (index * 48271) % 900000000);
}

function generateAccount(index) {
  return String(501000000000 + (index * 73921) % 900000000);
}

function generatePf(code, index) {
  return `${code}/0048123/000/${String(index + 1).padStart(7, '0')}`;
}

function generatePhone(index) {
  const prefixes = ['98450', '98200', '97110', '98800', '99000', '98190', '97690', '98330'];
  const prefix = prefixes[index % prefixes.length];
  const suffix = String(10000 + (index * 137) % 90000);
  return `+91 ${prefix.slice(0, 5)} ${suffix}`;
}

function generateDoj(index) {
  const years = [2021, 2022, 2023, 2024, 2025, 2026];
  const y = years[index % years.length];
  const m = String(1 + (index % 12)).padStart(2, '0');
  const d = String(1 + ((index * 3) % 27)).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generateDob(index) {
  const y = 1982 + (index % 18);
  const m = String(1 + ((index * 5) % 12)).padStart(2, '0');
  const d = String(1 + ((index * 7) % 28)).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 1. Build Employees
const empsOrg1 = [];
const empsOrg2 = [];

// Preserve original 9 employees for ORG-001 with 100% exact backward compatibility
const legacyEmps = [
  {
    id: "EMP-001",
    code: "NX-001",
    name: "Priya Nair",
    email: "priya.nair@globaltech.in",
    department: "Engineering",
    designation: "Senior Software Engineer",
    doj: "2021-03-15",
    empType: "Full-Time",
    manager: "Rajesh Kumar",
    location: "Bangalore",
    mobile: "+91 98765 43210",
    dob: "1992-06-18",
    gender: "Female",
    fatherName: "K. Narayanan Nair",
    pan: "ABCDE1234F",
    address: "#42, 3rd Cross, Indiranagar 1st Stage, Bengaluru, Karnataka 560038",
    differentlyAbled: false,
    pfNumber: "KN/BNG/0048123/000/0000001",
    esiNumber: "",
    uan: "100912345678",
    bankName: "HDFC Bank",
    bankAccount: "50100412345678",
    ifsc: "HDFC0001234",
    status: "Active",
    portalStatus: "Enabled",
    salaryStructure: "Senior Engineer",
    grossSalary: 110000,
    orgId: "ORG-001"
  },
  {
    id: "EMP-002",
    code: "NX-002",
    name: "Arjun Sharma",
    email: "arjun.sharma@globaltech.in",
    department: "Engineering",
    designation: "Junior Software Engineer",
    doj: "2023-06-01",
    empType: "Full-Time",
    manager: "Priya Nair",
    location: "Bangalore",
    mobile: "+91 98765 43211",
    dob: "1998-11-24",
    gender: "Male",
    fatherName: "Manoj Sharma",
    pan: "BCDEF2345G",
    address: "#12B, Green Glen Layout, Bellandur, Bengaluru 560103",
    differentlyAbled: false,
    pfNumber: "KN/BNG/0048123/000/0000002",
    esiNumber: "",
    uan: "100912345679",
    bankName: "ICICI Bank",
    bankAccount: "50100412345679",
    ifsc: "ICIC0000021",
    status: "Active",
    portalStatus: "Enabled",
    salaryStructure: "Junior Engineer",
    grossSalary: 55000,
    orgId: "ORG-001"
  },
  {
    id: "EMP-003",
    code: "NX-003",
    name: "Kavita Menon",
    email: "kavita.menon@globaltech.in",
    department: "Engineering",
    designation: "QA Lead",
    doj: "2020-09-15",
    empType: "Full-Time",
    manager: "Rajesh Kumar",
    location: "Bangalore",
    mobile: "+91 98765 43212",
    dob: "1990-04-12",
    gender: "Female",
    fatherName: "Suresh Menon",
    pan: "CDEFG3456H",
    address: "#78, 14th Main, HSR Layout Sector 4, Bengaluru 560102",
    differentlyAbled: false,
    pfNumber: "KN/BNG/0048123/000/0000003",
    esiNumber: "",
    uan: "100912345680",
    bankName: "State Bank of India",
    bankAccount: "50100412345680",
    ifsc: "SBIN0004567",
    status: "Active",
    portalStatus: "Enabled",
    salaryStructure: "Senior Engineer",
    grossSalary: 110000,
    orgId: "ORG-001"
  },
  {
    id: "EMP-004",
    code: "NX-004",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@globaltech.in",
    department: "Engineering",
    designation: "Engineering Manager",
    doj: "2019-01-10",
    empType: "Full-Time",
    manager: "Meena Iyer",
    location: "Bangalore",
    mobile: "+91 98765 43213",
    dob: "1986-08-30",
    gender: "Male",
    fatherName: "Ramesh Kumar",
    pan: "DEFGH4567J",
    address: "Villa 14, Prestige Silver Oak, Whitefield, Bengaluru 560066",
    differentlyAbled: false,
    pfNumber: "KN/BNG/0048123/000/0000004",
    esiNumber: "",
    uan: "100912345681",
    bankName: "HDFC Bank",
    bankAccount: "50100412345681",
    ifsc: "HDFC0001234",
    status: "Active",
    portalStatus: "Enabled",
    salaryStructure: "Manager",
    grossSalary: 150000,
    orgId: "ORG-001"
  },
  {
    id: "EMP-005",
    code: "NX-005",
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni@globaltech.in",
    department: "Product",
    designation: "Product Designer",
    doj: "2022-01-10",
    empType: "Full-Time",
    manager: "Meena Iyer",
    location: "Pune",
    mobile: "+91 98765 43214",
    dob: "1994-03-15",
    gender: "Female",
    fatherName: "Anand Kulkarni",
    pan: "EFGHI5678K",
    address: "Flat 402, Rohan Mithila, Viman Nagar, Pune 411014",
    differentlyAbled: false,
    pfNumber: "KN/BNG/0048123/000/0000005",
    esiNumber: "",
    uan: "100912345682",
    bankName: "Axis Bank",
    bankAccount: "50100412345682",
    ifsc: "UTIB0000843",
    status: "Active",
    portalStatus: "Enabled",
    salaryStructure: "Senior Engineer",
    grossSalary: 110000,
    orgId: "ORG-001"
  },
  {
    id: "EMP-006",
    code: "NX-006",
    name: "Vikramaditya Rao",
    email: "vikram.rao@globaltech.in",
    department: "Sales",
    designation: "Account Executive",
    doj: "2023-02-01",
    empType: "Full-Time",
    manager: "Meena Iyer",
    location: "Hyderabad",
    mobile: "+91 98765 43215",
    dob: "1993-07-20",
    gender: "Male",
    fatherName: "Prabhakar Rao",
    pan: "FGHIJ6789L",
    address: "#204, Fortune Enclave, Madhapur, Hyderabad 500081",
    differentlyAbled: false,
    pfNumber: "KN/BNG/0048123/000/0000006",
    esiNumber: "",
    uan: "100912345683",
    bankName: "Kotak Mahindra Bank",
    bankAccount: "50100412345683",
    ifsc: "KKBK0000261",
    status: "Active",
    portalStatus: "Enabled",
    salaryStructure: "Associate",
    grossSalary: 35000,
    orgId: "ORG-001"
  },
  {
    id: "EMP-007",
    code: "NX-007",
    name: "Ananya Sen",
    email: "ananya.sen@globaltech.in",
    department: "HR",
    designation: "HR Associate",
    doj: "2024-01-08",
    empType: "Full-Time",
    manager: "Meena Iyer",
    location: "Bangalore",
    mobile: "+91 98765 43216",
    dob: "1997-09-05",
    gender: "Female",
    fatherName: "Soumitra Sen",
    pan: "GHIJK7890M",
    address: "#56, 5th Cross, Koramangala 4th Block, Bengaluru 560034",
    differentlyAbled: false,
    pfNumber: "KN/BNG/0048123/000/0000007",
    esiNumber: "",
    uan: "100912345684",
    bankName: "HDFC Bank",
    bankAccount: "50100412345684",
    ifsc: "HDFC0001234",
    status: "Active",
    portalStatus: "Enabled",
    salaryStructure: "Associate",
    grossSalary: 35000,
    orgId: "ORG-001"
  },
  {
    id: "EMP-008",
    code: "NX-008",
    name: "Rahul Mehta",
    email: "rahul.mehta@globaltech.in",
    department: "Engineering",
    designation: "DevOps Engineer",
    doj: "2022-08-15",
    empType: "Full-Time",
    manager: "Rajesh Kumar",
    location: "Bangalore",
    mobile: "+91 98765 43217",
    dob: "1991-12-14",
    gender: "Male",
    fatherName: "Kishore Mehta",
    pan: "HIJKL8901N",
    address: "Tower 2 - 801, Godrej Woodsman Estate, Bellary Road, Bengaluru 560024",
    differentlyAbled: false,
    pfNumber: "KN/BNG/0048123/000/0000008",
    esiNumber: "",
    uan: "100912345685",
    bankName: "ICICI Bank",
    bankAccount: "50100412345685",
    ifsc: "ICIC0000021",
    status: "Active",
    portalStatus: "Enabled",
    salaryStructure: "Senior Engineer",
    grossSalary: 110000,
    orgId: "ORG-001"
  },
  {
    id: "EMP-009",
    code: "NX-009",
    name: "Deepa Nair",
    email: "deepa.nair@globaltech.in",
    department: "Finance",
    designation: "Finance Associate",
    doj: "2023-11-01",
    empType: "Full-Time",
    manager: "Meena Iyer",
    location: "Bangalore",
    mobile: "+91 98765 43218",
    dob: "1995-05-28",
    gender: "Female",
    fatherName: "Gopinath Nair",
    pan: "IJKLM9012P",
    address: "#19, 2nd Main, Malleshwaram 7th Cross, Bengaluru 560003",
    differentlyAbled: false,
    pfNumber: "KN/BNG/0048123/000/0000009",
    esiNumber: "",
    uan: "100912345686",
    bankName: "State Bank of India",
    bankAccount: "50100412345686",
    ifsc: "SBIN0004567",
    status: "Active",
    portalStatus: "Enabled",
    salaryStructure: "Associate",
    grossSalary: 35000,
    orgId: "ORG-001"
  }
];

empsOrg1.push(...legacyEmps);

// Generate EMP-010 through EMP-210 (201 more employees for Org 1 = 210 total)
for (let i = 10; i <= 210; i++) {
  const isFemale = (i % 2 === 0);
  const fnList = isFemale ? firstNamesF : firstNamesM;
  const firstName = fnList[i % fnList.length];
  const lastName = lastNames[(i * 3 + 7) % lastNames.length];
  const fullName = `${firstName} ${lastName}`;
  const fatherFirst = firstNamesM[(i * 5 + 3) % firstNamesM.length];
  const fatherName = `${fatherFirst} ${lastName}`;
  
  const deptGroup = deptsAndRoles[i % deptsAndRoles.length];
  const roleObj = deptGroup.roles[(i * 2) % deptGroup.roles.length];
  const b = banks[i % banks.length];
  const loc = org1Locations[i % org1Locations.length];
  
  const status = (i === 42 || i === 88 || i === 150) ? 'On Leave' : (i === 198) ? 'Inactive' : 'Active';
  const portalStatus = (i % 15 === 0) ? 'Yet to Accept Invite' : 'Enabled';
  
  empsOrg1.push({
    id: `EMP-${String(i).padStart(3, '0')}`,
    code: `NX-${String(i).padStart(3, '0')}`,
    name: fullName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@naxrita.com`,
    department: deptGroup.dept,
    designation: roleObj.title,
    doj: generateDoj(i),
    empType: (i % 12 === 0) ? "Contract" : (i % 25 === 0) ? "Part-Time" : "Full-Time",
    manager: (i % 5 === 0) ? "Rajesh Kumar" : (i % 3 === 0) ? "Priya Nair" : "Meena Iyer",
    location: loc,
    mobile: generatePhone(i),
    dob: generateDob(i),
    gender: isFemale ? "Female" : "Male",
    fatherName: fatherName,
    pan: generatePan(i),
    address: `#${(i * 17) % 500 + 1}, Sector ${(i % 7) + 1}, Bellandur Outer Ring Road, ${loc}`,
    differentlyAbled: (i % 45 === 0),
    pfNumber: generatePf("KN/BNG", i),
    esiNumber: roleObj.salary <= 21000 ? `53000${String(1000000000 + i * 231).slice(0, 11)}` : "",
    uan: generateUan(i),
    bankName: b.name,
    bankAccount: generateAccount(i),
    ifsc: b.ifsc,
    status: status,
    portalStatus: portalStatus,
    salaryStructure: roleObj.structure,
    grossSalary: roleObj.salary,
    orgId: "ORG-001"
  });
}

// Generate NST-001 through NST-205 for Org 2 (NovaSoft Technologies)
for (let i = 1; i <= 205; i++) {
  const isFemale = (i % 2 === 1);
  const fnList = isFemale ? firstNamesF : firstNamesM;
  const firstName = (i === 1) ? 'Rohan' : fnList[(i + 13) % fnList.length];
  const lastName = (i === 1) ? 'Gupta' : lastNames[(i * 4 + 11) % lastNames.length];
  const fullName = `${firstName} ${lastName}`;
  const fatherFirst = firstNamesM[(i * 7 + 5) % firstNamesM.length];
  const fatherName = `${fatherFirst} ${lastName}`;
  
  const deptGroup = deptsAndRoles[(i + 3) % deptsAndRoles.length];
  const roleObj = (i === 1) 
    ? { title: 'Managing Director & Platform Admin', structure: 'Director', salary: 280000 }
    : deptGroup.roles[(i * 3) % deptGroup.roles.length];
  const b = banks[(i + 2) % banks.length];
  const loc = org2Locations[i % org2Locations.length];
  
  const status = (i === 55 || i === 112) ? 'On Leave' : (i === 185) ? 'Inactive' : 'Active';
  const portalStatus = (i % 18 === 0) ? 'Yet to Accept Invite' : 'Enabled';
  
  empsOrg2.push({
    id: `NST-${String(i).padStart(3, '0')}`,
    code: `NST-${String(i).padStart(3, '0')}`,
    name: fullName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@novasoft.in`,
    department: (i === 1) ? 'Executive Management' : deptGroup.dept,
    designation: roleObj.title,
    doj: generateDoj(i + 50),
    empType: (i % 14 === 0) ? "Contract" : "Full-Time",
    manager: (i === 1) ? "Board of Directors" : (i % 4 === 0) ? "Meera Sundaram" : "Rohan Gupta",
    location: loc,
    mobile: generatePhone(i + 500),
    dob: generateDob(i + 30),
    gender: (i === 1) ? "Male" : (isFemale ? "Female" : "Male"),
    fatherName: fatherName,
    pan: generatePan(i + 1000),
    address: `Suite ${(i * 23) % 800 + 100}, Platina Building, Bandra Kurla Complex (BKC), ${loc}`,
    differentlyAbled: (i % 50 === 0),
    pfNumber: generatePf("MH/BAN", i + 2000),
    esiNumber: roleObj.salary <= 21000 ? `31000${String(1000000000 + i * 441).slice(0, 11)}` : "",
    uan: generateUan(i + 2000),
    bankName: b.name,
    bankAccount: generateAccount(i + 2000),
    ifsc: b.ifsc,
    status: status,
    portalStatus: portalStatus,
    salaryStructure: roleObj.structure,
    grossSalary: roleObj.salary,
    orgId: "ORG-002"
  });
}

const allEmployees = [...empsOrg1, ...empsOrg2];

// 3. Organizations definition
const seedOrgs = [
  {
    id: "ORG-001",
    name: "Naxrita Solutions Pvt. Ltd.",
    code: "GTS",
    legalName: "Naxrita Solutions Private Limited",
    country: "India",
    currency: "INR",
    financialYear: "April-March",
    status: "Active",
    employees: empsOrg1.length,
    admin: "Meena Iyer",
    adminEmail: "meena.iyer@naxrita.com",
    domain: "naxrita.com",
    phone: "+91 (080) 4128-9000",
    address: "Tower 4, Level 7, RMZ Ecoworld, Outer Ring Road, Bellandur, Bengaluru 560103",
    gstin: "29AAACN8123M1ZQ",
    pan: "AAACN8123M",
    tan: "BLRN12345D",
    epfCode: "KN/BNG/0048123/000",
    esicCode: "53000847290001001",
    founded: "2018"
  },
  {
    id: "ORG-002",
    name: "NovaSoft Technologies",
    code: "NST",
    legalName: "NovaSoft Technologies Pvt. Ltd.",
    country: "India",
    currency: "INR",
    financialYear: "April-March",
    status: "Active",
    employees: empsOrg2.length,
    admin: "Rohan Gupta",
    adminEmail: "rohan.gupta@novasoft.in",
    domain: "novasoft.in",
    phone: "+91 (022) 6780-3400",
    address: "Plot C-59, G-Block, Bandra Kurla Complex (BKC), Bandra East, Mumbai 400051",
    gstin: "27AABCN5432P1ZK",
    pan: "AABCN5432P",
    tan: "MUMN54321E",
    epfCode: "MH/BAN/0092451/000",
    esicCode: "31000628170001002",
    founded: "2015"
  }
];

// 4. Documents Definition
const seedDocuments = [
  {
    id: "DOC-001",
    orgId: "ORG-001",
    title: "NaxPayroll Enterprise Code of Conduct 2025-2026",
    category: "Policy",
    assignedTo: "All Employees",
    assignedCount: empsOrg1.length,
    owner: "Meena Iyer",
    createdOn: "2025-01-05",
    status: "Published",
    description: "Official organizational governance, professional ethics, workplace integrity, and anti-harassment charter.",
    fileName: "Code_of_Conduct_2025_2026.pdf"
  },
  {
    id: "DOC-002",
    orgId: "ORG-001",
    title: "Prevention of Sexual Harassment (POSH) Policy 2025",
    category: "Compliance",
    assignedTo: "All Employees",
    assignedCount: empsOrg1.length,
    owner: "Meena Iyer",
    createdOn: "2025-01-10",
    status: "Published",
    description: "Statutory workplace harassment protection framework in strict accordance with the POSH Act 2013.",
    fileName: "POSH_Policy_Guidelines_2025.pdf"
  },
  {
    id: "DOC-003",
    orgId: "ORG-001",
    title: "Annual Leave & Paid Time Off (PTO) Rules 2025-2026",
    category: "Policy",
    assignedTo: "All Employees",
    assignedCount: empsOrg1.length,
    owner: "Meena Iyer",
    createdOn: "2025-01-15",
    status: "Published",
    description: "Guidelines on earned leave accrual, carry-forward caps, casual leaves, maternity, and bereavement entitlements.",
    fileName: "Leave_And_Attendance_Policy_2025_26.pdf"
  },
  {
    id: "DOC-004",
    orgId: "ORG-001",
    title: "Information Security & ISO 27001 Acceptable Usage",
    category: "Compliance",
    assignedTo: "All Employees",
    assignedCount: empsOrg1.length,
    owner: "Meena Iyer",
    createdOn: "2025-02-01",
    status: "Published",
    description: "Confidentiality, secure device handling, clean desk rules, VPN access, and incident reporting procedures.",
    fileName: "ISO_27001_Data_Security_Policy.pdf"
  },
  {
    id: "DOC-005",
    orgId: "ORG-001",
    title: "Form 16 Tax Deduction Certificates FY 2024-25 (AY 2025-26)",
    category: "Tax",
    assignedTo: "All Employees",
    assignedCount: empsOrg1.length,
    owner: "Finance Team",
    createdOn: "2025-06-15",
    status: "Published",
    description: "Consolidated Part A and Part B Form 16 annual income tax deductions for all salaried personnel.",
    fileName: "Form_16_FY_2024_2025_Batch.pdf"
  },
  {
    id: "DOC-006",
    orgId: "ORG-001",
    title: "Form 16 Tax Deduction Certificates FY 2025-26 (AY 2026-27)",
    category: "Tax",
    assignedTo: "All Employees",
    assignedCount: empsOrg1.length,
    owner: "Finance Team",
    createdOn: "2026-06-14",
    status: "Published",
    description: "Annual statutory tax statement issued under Section 203 of the Income-tax Act 1961.",
    fileName: "Form_16_FY_2025_2026_Batch.pdf"
  },
  {
    id: "DOC-007",
    orgId: "ORG-001",
    title: "Provident Fund (EPF) & Statutory Pension Regulations",
    category: "Payroll",
    assignedTo: "All Employees",
    assignedCount: empsOrg1.length,
    owner: "Meena Iyer",
    createdOn: "2025-03-20",
    status: "Published",
    description: "Explains employee 12% matching contribution, employer EPS transfer, voluntary PF (VPF), and UAN linking.",
    fileName: "EPF_Scheme_Handbook_2025.pdf"
  },
  {
    id: "DOC-008",
    orgId: "ORG-001",
    title: "Group Mediclaim & Term Life Insurance Schedule FY 25-26",
    category: "Policy",
    assignedTo: "All Employees",
    assignedCount: empsOrg1.length,
    owner: "Meena Iyer",
    createdOn: "2025-04-01",
    status: "Published",
    description: "Comprehensive health coverage (₹7,50,000 per family unit), cashless network hospitals, and parental add-on guidelines.",
    fileName: "Group_Health_Insurance_Benefits_FY25_26.pdf"
  },
  {
    id: "DOC-009",
    orgId: "ORG-001",
    title: "Hybrid Working & Travel Expense Reimbursement Policy",
    category: "Policy",
    assignedTo: "All Employees",
    assignedCount: empsOrg1.length,
    owner: "Meena Iyer",
    createdOn: "2025-05-12",
    status: "Published",
    description: "Daily per-diem allowances, cab fare entitlements, client dinner rules, and automated claim submission steps.",
    fileName: "Expense_Reimbursement_Policy.pdf"
  },
  {
    id: "DOC-010",
    orgId: "ORG-001",
    title: "Annual Appraisal & Increment Framework FY 2026-27",
    category: "HR Letter",
    assignedTo: "All Employees",
    assignedCount: empsOrg1.length,
    owner: "Meena Iyer",
    createdOn: "2026-04-05",
    status: "Published",
    description: "Merit-based compensation review bands, promotion guidelines, and performance scorecard rubric.",
    fileName: "Annual_Appraisal_Cycle_2026.pdf"
  },
  {
    id: "DOC-011",
    orgId: "ORG-002",
    title: "NovaSoft Technologies Master Employment Terms & Standards",
    category: "Policy",
    assignedTo: "All Employees",
    assignedCount: empsOrg2.length,
    owner: "Rohan Gupta",
    createdOn: "2025-01-08",
    status: "Published",
    description: "Core workplace guidelines, proprietary IP assignment, confidentiality agreements, and consulting ethics.",
    fileName: "NovaSoft_Employee_Handbook_2025.pdf"
  },
  {
    id: "DOC-012",
    orgId: "ORG-002",
    title: "NovaSoft Group Medical & Accidental Insurance FY 25-26",
    category: "Policy",
    assignedTo: "All Employees",
    assignedCount: empsOrg2.length,
    owner: "Rohan Gupta",
    createdOn: "2025-04-02",
    status: "Published",
    description: "Coverage details for corporate cashless hospitalizations across Mumbai, Pune, and NCR regions.",
    fileName: "NovaSoft_Medical_Insurance_Summary.pdf"
  },
  {
    id: "DOC-013",
    orgId: "ORG-002",
    title: "Client Confidentiality & Non-Disclosure Agreement (NDA)",
    category: "Compliance",
    assignedTo: "All Employees",
    assignedCount: empsOrg2.length,
    owner: "Rohan Gupta",
    createdOn: "2025-02-14",
    status: "Published",
    description: "Mandatory corporate NDA binding consultants and engineers to global enterprise client secrecy standards.",
    fileName: "Corporate_NDA_Standard_2025.pdf"
  },
  {
    id: "DOC-014",
    orgId: "ORG-002",
    title: "Form 16 Tax Certificate Batch FY 2024-25",
    category: "Tax",
    assignedTo: "All Employees",
    assignedCount: empsOrg2.length,
    owner: "Finance Department",
    createdOn: "2025-06-12",
    status: "Published",
    description: "TRACES digitally signed Form 16 Part A & Part B for financial year ending March 31, 2025.",
    fileName: "NST_Form_16_FY24_25.pdf"
  },
  {
    id: "DOC-015",
    orgId: "ORG-002",
    title: "Form 16 Tax Certificate Batch FY 2025-26",
    category: "Tax",
    assignedTo: "All Employees",
    assignedCount: empsOrg2.length,
    owner: "Finance Department",
    createdOn: "2026-06-11",
    status: "Published",
    description: "TRACES digitally signed Form 16 Part A & Part B for financial year ending March 31, 2026.",
    fileName: "NST_Form_16_FY25_26.pdf"
  }
];

// 5. Audit Logs Definition across 2025 and 2026
const seedAuditLogs = [
  {
    id: "AL-101",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Payroll Approved",
    module: "Payroll",
    oldValue: "Under Review",
    newValue: "Approved (PR-2026-10)",
    timestamp: "2026-10-14 16:30:10"
  },
  {
    id: "AL-102",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Diwali Bonus Applied",
    module: "Payroll",
    oldValue: "Bonus: 0",
    newValue: "Quarter 4 Festive Bonus Distributed",
    timestamp: "2026-10-12 11:20:45"
  },
  {
    id: "AL-103",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "TDS Q2 24Q Filed",
    module: "Compliance",
    oldValue: "Draft Return",
    newValue: "Filed on TRACES Portal (Ack: 8492019482)",
    timestamp: "2026-09-30 18:45:12"
  },
  {
    id: "AL-104",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Payroll Completed",
    module: "Payroll",
    oldValue: "Approved",
    newValue: "Paid via HDFC Corporate Batch (PR-2026-09)",
    timestamp: "2026-09-30 14:15:00"
  },
  {
    id: "AL-105",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Employee Onboarded",
    module: "Employees",
    oldValue: "-",
    newValue: "EMP-210: Vivek Yadav (Engineering)",
    timestamp: "2026-08-15 09:30:00"
  },
  {
    id: "AL-106",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Payroll Completed",
    module: "Payroll",
    oldValue: "Approved",
    newValue: "Paid (PR-2026-08)",
    timestamp: "2026-08-28 17:30:00"
  },
  {
    id: "AL-107",
    user: "Rajesh Kumar",
    org: "Naxrita Solutions",
    action: "Salary Structure Changed",
    module: "Salary",
    oldValue: "Gross: 95000",
    newValue: "Gross: 110000",
    timestamp: "2026-08-20 09:05:11"
  },
  {
    id: "AL-108",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "EPF ECR Challan Paid",
    module: "Statutory",
    oldValue: "Unpaid",
    newValue: "TRRN 8492020581 Paid",
    timestamp: "2026-08-15 11:22:44"
  },
  {
    id: "AL-109",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Form 16 Batch Issued",
    module: "Tax",
    oldValue: "Draft",
    newValue: "Published for FY 2025-26",
    timestamp: "2026-06-14 15:00:00"
  },
  {
    id: "AL-110",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Annual Increment Applied",
    module: "Salary",
    oldValue: "FY 2025-26 Grid",
    newValue: "FY 2026-27 Grid (Avg 12.5% increase)",
    timestamp: "2026-04-01 10:00:00"
  },
  {
    id: "AL-111",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "FY25-26 Q4 Payroll Closed",
    module: "Payroll",
    oldValue: "Under Review",
    newValue: "Completed with Fiscal Bonuses (PR-2026-03)",
    timestamp: "2026-03-31 19:40:00"
  },
  {
    id: "AL-112",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Diwali Bonus Applied",
    module: "Payroll",
    oldValue: "Bonus: 0",
    newValue: "Festive Payouts Executed (PR-2025-10)",
    timestamp: "2025-10-31 17:00:00"
  },
  {
    id: "AL-113",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Form 16 Batch Issued",
    module: "Tax",
    oldValue: "Draft",
    newValue: "Published for FY 2024-25",
    timestamp: "2025-06-15 16:10:00"
  },
  {
    id: "AL-114",
    user: "Meena Iyer",
    org: "Naxrita Solutions",
    action: "Fiscal Year 2024-25 Closed",
    module: "Payroll",
    oldValue: "Open",
    newValue: "Reconciled and Closed (PR-2025-03)",
    timestamp: "2025-03-31 18:30:00"
  },
  {
    id: "AL-201",
    user: "Rohan Gupta",
    org: "NovaSoft Technologies",
    action: "Payroll Approved",
    module: "Payroll",
    oldValue: "Under Review",
    newValue: "Approved (PR-NST-2026-10)",
    timestamp: "2026-10-14 17:15:22"
  },
  {
    id: "AL-202",
    user: "Rohan Gupta",
    org: "NovaSoft Technologies",
    action: "TDS Q2 Return Filed",
    module: "Compliance",
    oldValue: "Draft Return",
    newValue: "Filed on NSDL (Ack: 9102847291)",
    timestamp: "2026-09-29 16:40:00"
  },
  {
    id: "AL-203",
    user: "Rohan Gupta",
    org: "NovaSoft Technologies",
    action: "Payroll Completed",
    module: "Payroll",
    oldValue: "Approved",
    newValue: "Paid via ICICI Direct Batch (PR-NST-2026-09)",
    timestamp: "2026-09-30 15:20:00"
  },
  {
    id: "AL-204",
    user: "Rohan Gupta",
    org: "NovaSoft Technologies",
    action: "New Tenant Onboarded",
    module: "Organizations",
    oldValue: "-",
    newValue: "NovaSoft Technologies Pvt. Ltd. (NST)",
    timestamp: "2025-01-01 09:00:00"
  }
];

const headerLines = [
  '// Auto-generated Enterprise Seed Data for Naxpayroll',
  '// 2 Organizations with 200+ employees each, 2 Full Years (2025 & 2026) across 8 Quarters',
  '',
  'export interface Employee {',
  '  id: string',
  '  code?: string',
  '  name: string',
  '  email: string',
  '  department: string',
  '  designation: string',
  '  doj: string',
  '  empType: "Full-Time" | "Part-Time" | "Contract"',
  '  manager: string',
  '  location: string',
  '  mobile?: string',
  '  dob?: string',
  '  gender?: string',
  '  fatherName?: string',
  '  pan?: string',
  '  address?: string',
  '  differentlyAbled?: boolean',
  '  pfNumber?: string',
  '  esiNumber?: string',
  '  uan?: string',
  '  bankName?: string',
  '  bankAccount?: string',
  '  ifsc?: string',
  '  status: "Active" | "Inactive" | "On Leave" | "Incomplete" | "Exited"',
  '  portalStatus?: "Enabled" | "Disabled" | "Yet to Accept Invite"',
  '  salaryStructure: string',
  '  grossSalary: number',
  '  orgId?: string',
  '}',
  '',
  'export interface SalaryStructure {',
  '  id: string',
  '  name: string',
  '  basic: number',
  '  hra: number',
  '  fixedAllowance: number',
  '  specialAllowance: number',
  '  gross: number',
  '}',
  '',
  'export interface PayrunInputRow {',
  '  empId: string',
  '  empName: string',
  '  department: string',
  '  grossSalary: number',
  '  bonus: number',
  '  incentive: number',
  '  lopDays: number',
  '  lopDeduction: number',
  '  otherDeduction: number',
  '  pf: number',
  '  esi: number',
  '  tds: number',
  '  profTax: number',
  '  totalEarnings: number',
  '  totalDeductions: number',
  '  netSalary: number',
  '}',
  '',
  'export interface Payrun {',
  '  id: string',
  '  orgId?: string',
  '  period: string',
  '  month: number',
  '  year: number',
  '  quarter?: "Q1" | "Q2" | "Q3" | "Q4"',
  '  status: "Draft" | "Calculated" | "Under Review" | "Approved" | "Completed" | "Locked" | "Payment Due" | "Paid" | "PAID" | "PAYMENT DUE"',
  '  scope?: "All Employees" | "Specific Employees" | "Department Batch"',
  '  employeeIds?: string[]',
  '  note?: string',
  '  totalEmployees: number',
  '  grossPayroll: number',
  '  totalDeductions: number',
  '  netPayroll: number',
  '  generatedBy: string',
  '  generatedOn: string',
  '  payrunType?: "Regular" | "One Time Payout" | "Off Cycle Payrun" | string',
  '  oneTimeComponent?: string',
  '  paymentDate?: string',
  '  rows: PayrunInputRow[]',
  '}',
  '',
  'export interface Organization {',
  '  id: string',
  '  name: string',
  '  code: string',
  '  legalName: string',
  '  country: string',
  '  currency: string',
  '  financialYear: string',
  '  status: "Active" | "Draft" | "Inactive" | "Suspended"',
  '  employees: number',
  '  admin: string',
  '  adminEmail?: string',
  '  domain?: string',
  '  phone?: string',
  '  address?: string',
  '  gstin?: string',
  '  pan?: string',
  '  tan?: string',
  '  epfCode?: string',
  '  esicCode?: string',
  '  founded?: string',
  '}',
  '',
  'export interface OrgDocument {',
  '  id: string',
  '  orgId?: string',
  '  title: string',
  '  category: "Policy" | "Payroll" | "Compliance" | "HR Letter" | "Tax"',
  '  assignedTo: "All Employees" | string',
  '  assignedCount: number',
  '  owner: string',
  '  createdOn: string',
  '  status: "Draft" | "Published"',
  '  description: string',
  '  fileName?: string',
  '}',
  '',
  'export interface AuditLog {',
  '  id: string',
  '  user: string',
  '  org: string',
  '  action: string',
  '  module: string',
  '  oldValue: string',
  '  newValue: string',
  '  timestamp: string',
  '}',
  '',
  'export const SEED_SALARY_STRUCTURES: SalaryStructure[] = [',
  '  { id: "SS-001", name: "Senior Engineer", basic: 60000, hra: 24000, fixedAllowance: 12000, specialAllowance: 14000, gross: 110000 },',
  '  { id: "SS-002", name: "Junior Engineer", basic: 30000, hra: 12000, fixedAllowance: 6000, specialAllowance: 7000, gross: 55000 },',
  '  { id: "SS-003", name: "Manager", basic: 80000, hra: 32000, fixedAllowance: 16000, specialAllowance: 22000, gross: 150000 },',
  '  { id: "SS-004", name: "Associate", basic: 20000, hra: 8000, fixedAllowance: 4000, specialAllowance: 3000, gross: 35000 },',
  '  { id: "SS-005", name: "Director", basic: 150000, hra: 60000, fixedAllowance: 30000, specialAllowance: 50000, gross: 290000 },',
  '  { id: "SS-006", name: "Executive Leadership", basic: 180000, hra: 72000, fixedAllowance: 36000, specialAllowance: 62000, gross: 350000 },',
  '  { id: "SS-007", name: "Senior Engineering Lead", basic: 90000, hra: 36000, fixedAllowance: 18000, specialAllowance: 26000, gross: 170000 },',
  '  { id: "SS-008", name: "Product & Design Lead", basic: 75000, hra: 30000, fixedAllowance: 15000, specialAllowance: 20000, gross: 140000 },',
  '  { id: "SS-009", name: "HR & Talent Operations", basic: 45000, hra: 18000, fixedAllowance: 9000, specialAllowance: 8000, gross: 80000 },',
  '  { id: "SS-010", name: "Sales & Account Director", basic: 70000, hra: 28000, fixedAllowance: 14000, specialAllowance: 18000, gross: 130000 },',
  '];',
  ''
];

const payrunGeneratorFn = [
  'const MONTH_NAMES = [',
  '  "January", "February", "March", "April", "May", "June",',
  '  "July", "August", "September", "October", "November", "December"',
  '];',
  '',
  'export function generateEnterprisePayruns(employees: Employee[], salaryStructures: SalaryStructure[]): Payrun[] {',
  '  const payruns: Payrun[] = [];',
  '  const orgs = [',
  '    { id: "ORG-001", admin: "Meena Iyer", prefix: "PR" },',
  '    { id: "ORG-002", admin: "Rohan Gupta", prefix: "PR-NST" }',
  '  ];',
  '',
  '  for (const org of orgs) {',
  '    const orgEmps = employees.filter(e => (e.orgId || "ORG-001") === org.id && e.status !== "Inactive" && e.grossSalary > 0);',
  '',
  '    for (const year of [2025, 2026]) {',
  '      for (let m = 1; m <= 12; m++) {',
  '        const period = `${MONTH_NAMES[m - 1]} ${year}`;',
  '        const quarter = (m <= 3 ? "Q1" : m <= 6 ? "Q2" : m <= 9 ? "Q3" : "Q4") as "Q1" | "Q2" | "Q3" | "Q4";',
  '        const isMarch = (m === 3);',
  '        const isOct = (m === 10);',
  '',
  '        let status: Payrun["status"] = "Paid";',
  '        let paymentDate = `28/${String(m).padStart(2, "0")}/${year}`;',
  '        let note = `Regular monthly payroll processing for ${period}.`;',
  '',
  '        if (isMarch) note = `Fiscal Year End Q4 closing run with annual performance appraisal payouts.`;',
  '        if (m === 4) note = `FY New Year kick-off payroll with annual salary increment rollouts.`;',
  '        if (isOct) note = `Q4 Festive Diwali Special payout batch including festival bonus.`;',
  '',
  '        if (year === 2026) {',
  '          if (m === 8) {',
  '            status = "Paid";',
  '            paymentDate = "28/08/2026";',
  '          } else if (m === 9) {',
  '            status = "Paid";',
  '            paymentDate = "30/09/2026";',
  '          } else if (m === 10) {',
  '            status = "Payment Due";',
  '            paymentDate = "31/10/2026";',
  '            note = "Diwali festive compensation verified. Scheduled for bank disbursement.";',
  '          } else if (m === 11) {',
  '            status = "Approved";',
  '            paymentDate = "30/11/2026";',
  '            note = "Payroll calculations verified by Finance Controller.";',
  '          } else if (m === 12) {',
  '            status = "Draft";',
  '            paymentDate = "";',
  '            note = "Attendance reconciliation in progress.";',
  '          }',
  '        }',
  '',
  '        const rows: PayrunInputRow[] = orgEmps.map((e, idx) => {',
  '          const basic = Math.round(e.grossSalary * 0.5);',
  '          let lopDays = 0;',
  '          if ((idx + m) % 19 === 0) lopDays = 1;',
  '          if ((idx + m) % 37 === 0) lopDays = 2;',
  '          if ((idx + m) % 73 === 0) lopDays = 3;',
  '',
  '          const lopDeduction = Math.round((e.grossSalary / 26) * lopDays);',
  '          let bonus = 0;',
  '          if (isMarch && (idx % 4 === 0)) bonus = Math.round(e.grossSalary * 0.25);',
  '          else if (isOct && (idx % 3 === 0)) bonus = Math.round(e.grossSalary * 0.15);',
  '',
  '          const pf = Math.round(basic * 0.12);',
  '          const esi = e.grossSalary <= 21000 ? Math.round(e.grossSalary * 0.0075) : 0;',
  '          const tds = Math.round(e.grossSalary * 0.10);',
  '          const profTax = e.grossSalary > 15000 ? 200 : 150;',
  '          const totalEarnings = e.grossSalary + bonus - lopDeduction;',
  '          const totalDeductions = pf + esi + tds + profTax;',
  '          const netSalary = totalEarnings - totalDeductions;',
  '',
  '          return {',
  '            empId: e.id,',
  '            empName: e.name,',
  '            department: e.department,',
  '            grossSalary: e.grossSalary,',
  '            bonus,',
  '            incentive: (idx % 7 === 0) ? 2500 : 0,',
  '            lopDays,',
  '            lopDeduction,',
  '            otherDeduction: 0,',
  '            pf,',
  '            esi,',
  '            tds,',
  '            profTax,',
  '            totalEarnings,',
  '            totalDeductions,',
  '            netSalary,',
  '          };',
  '        });',
  '',
  '        const grossPayroll = rows.reduce((s, r) => s + r.totalEarnings, 0);',
  '        const totalDeductions = rows.reduce((s, r) => s + r.totalDeductions, 0);',
  '        const netPayroll = grossPayroll - totalDeductions;',
  '',
  '        payruns.push({',
  '          id: `${org.prefix}-${year}-${String(m).padStart(2, "0")}`,',
  '          orgId: org.id,',
  '          period,',
  '          month: m,',
  '          year,',
  '          quarter,',
  '          status,',
  '          paymentDate,',
  '          scope: "All Employees",',
  '          generatedBy: org.admin,',
  '          generatedOn: `${year}-${String(m).padStart(2, "0")}-25`,',
  '          payrunType: (isMarch || isOct) ? "One Time Payout" : "Regular",',
  '          oneTimeComponent: isMarch ? "Annual Appraisal Bonus" : isOct ? "Diwali Festive Bonus" : "",',
  '          note,',
  '          totalEmployees: rows.length,',
  '          grossPayroll,',
  '          totalDeductions,',
  '          netPayroll,',
  '          rows,',
  '        });',
  '      }',
  '    }',
  '  }',
  '  return payruns;',
  '}',
  ''
];

let out = headerLines.join('\n') + '\n\n';
out += 'export const SEED_ORGS: Organization[] = ' + JSON.stringify(seedOrgs, null, 2) + ';\n\n';
out += 'export const SEED_EMPLOYEES: Employee[] = ' + JSON.stringify(allEmployees, null, 2) + ';\n\n';
out += payrunGeneratorFn.join('\n') + '\n\n';
out += 'export const SEED_PAYRUNS: Payrun[] = generateEnterprisePayruns(SEED_EMPLOYEES, SEED_SALARY_STRUCTURES);\n\n';
out += 'export const SEED_ORG_DOCUMENTS: OrgDocument[] = ' + JSON.stringify(seedDocuments, null, 2) + ';\n\n';
out += 'export const SEED_AUDIT_LOGS: AuditLog[] = ' + JSON.stringify(seedAuditLogs, null, 2) + ';\n';

fs.writeFileSync('src/data/seedData.ts', out, 'utf8');

console.log('Successfully written src/data/seedData.ts');
console.log('Organizations:', seedOrgs.length);
console.log('Total Employees:', allEmployees.length, ' (Org 1:', empsOrg1.length, 'Org 2:', empsOrg2.length, ')');
console.log('Payruns generated dynamically on load: 48 cycles (24 months x 2 Orgs, 8 Quarters)');
console.log('Total Documents:', seedDocuments.length);
console.log('Total Audit Logs:', seedAuditLogs.length);
