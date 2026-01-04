const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Meta = require("../models/MetaModel");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seed = async () => {
  await Meta.deleteMany({}); // clean start

  // PROGRAMS
  const programs = ["BTECH", "MTECH", "MCA", "MBA"];
  for (const p of programs) {
    await Meta.create({ type: "PROGRAM", value: p });
  }

  // DEPARTMENTS
  const departments = [
    "CSE",
    "ECE",
    "EE",
    "ME",
    "CIVIL",
    "BIOTECH",
    "CHEMICAL",
    "PRODUCTION",
  ];

  for (const d of departments) {
    await Meta.create({ type: "DEPARTMENT", value: d });
  }

  // MTECH BRANCHES
  const branches = {
    CSE: ["CS", "DSAI", "IS"],
    ECE: ["VLSI", "COMM", "EMBEDDED"],
    EE: ["POWER", "CONTROL"],
    ME: ["THERMAL", "DESIGN", "MANUFACTURING"],
  };

  for (const dept in branches) {
    for (const br of branches[dept]) {
      await Meta.create({
        type: "BRANCH",
        value: br,
        program: "MTECH",
        department: dept,
      });
    }
  }

  console.log("✅ Meta data seeded successfully");
  process.exit();
};

seed();
