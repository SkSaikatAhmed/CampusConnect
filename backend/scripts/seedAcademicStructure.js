const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Meta = require("../models/MetaModel");

dotenv.config();

const DATA = {
  "Applied Mechanics": {
    BTECH: [
      "Engineering & Computational Mechanics",
      "Materials Engineering",
    ],
    MTECH: [
      "Engineering Mechanics & Design",
      "Material Science & Engineering",
      "Fluids Engineering",
      "Bio-Medical Engineering",
    ],
  },

  Biotechnology: {
    BTECH: ["Biotechnology"],
    MTECH: ["Biotechnology", "Medical Diagnostics & Devices"],
  },

  "Chemical Engineering": {
    BTECH: ["Chemical Engineering"],
    MTECH: ["Chemical Engineering"],
  },

  "Civil Engineering": {
    BTECH: ["Civil Engineering (Old)", "Civil Engineering (NEP)"],
    MTECH: [
      "Structural Engineering",
      "Geotechnical Engineering",
      "Environmental Engineering",
      "Transportation Engineering",
    ],
  },

  "Computer Science & Engineering": {
    BTECH: ["Computer Science & Engineering"],
    MTECH: [
      "Information Security",
      "Computer Science & Engineering",
      "AI & Data Science",
    ],
    MCA: ["MCA"],
  },

  "Electrical Engineering": {
    BTECH: ["Electrical Engineering"],
    MTECH: [
      "Control & Instrumentation",
      "Power Electronics & Drives",
      "Power System",
      "Cyber Physical System",
    ],
  },

  "Electronics & Communication Engineering": {
    BTECH: ["Electronics & Communication Engineering"],
    MTECH: [
      "Communication Systems",
      "Signal Processing",
      "Microelectronics & VLSI Design",
    ],
  },

  "Mechanical Engineering": {
    BTECH: [
      "Mechanical Engineering",
      "Production & Industrial Engineering",
    ],
    MTECH: [
      "CAD & Manufacturing",
      "Design Engineering",
      "Production Engineering",
      "Product Design & Development",
      "Thermal Engineering",
      "Part-Time Production Engineering",
    ],
  },

  Chemistry: {
    MSC: ["Applied Chemistry"],
  },

  Mathematics: {
    MSC: ["Mathematics & Scientific Computing"],
  },

  "School of Management Studies": {
    MBA: ["MBA"],
  },
};

async function seed() {
  if (process.env.CONFIRM_SEED !== "YES") {
    console.error("❌ Seeding blocked. Set CONFIRM_SEED=YES");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  console.log("🧹 Clearing old META data...");
  await Meta.deleteMany({});

  // PROGRAMS
  const programs = ["BTECH", "MTECH", "MCA", "MBA", "MSC"];
  for (const p of programs) {
    await Meta.create({ type: "PROGRAM", value: p });
  }

  // DEPARTMENTS
  for (const dept of Object.keys(DATA)) {
    await Meta.create({ type: "DEPARTMENT", value: dept });
  }

  // BRANCHES
  for (const [dept, programs] of Object.entries(DATA)) {
    for (const [program, branches] of Object.entries(programs)) {
      for (const branch of branches) {
        await Meta.create({
          type: "BRANCH",
          value: branch,
          program,
          department: dept,
        });
      }
    }
  }

  console.log("✅ Academic Meta seeded successfully");
  process.exit();
}

seed().catch(err => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
