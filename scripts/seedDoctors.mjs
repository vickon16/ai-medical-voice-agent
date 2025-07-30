// seedDoctors.mjs - using ES modules
import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";

const { Pool } = pg;

// Setup path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the doctors list directly
const doctorsList = [
  {
    specialist: "General Physician",
    description: "Helps with everyday health concerns and common symptoms.",
    image: "/doctor1.png",
    agentPrompt:
      "You are a friendly General Physician AI. Greet the user and quickly ask what symptoms they're experiencing. Keep responses short and helpful.",
    voiceId: "perseus",
    subscriptionRequired: false,
  },
  {
    specialist: "Pediatrician",
    description: "Expert in children's health, from babies to teens.",
    image: "/doctor2.png",
    agentPrompt:
      "You are a kind Pediatrician AI. Ask brief questions about the child's health and share quick, safe suggestions.",
    voiceId: "asteria",
    subscriptionRequired: true,
  },
  {
    specialist: "Dermatologist",
    description: "Handles skin issues like rashes, acne, or infections.",
    image: "/doctor3.png",
    agentPrompt:
      "You are a knowledgeable Dermatologist AI. Ask short questions about the skin issue and give simple, clear advice.",
    voiceId: "luna",
    subscriptionRequired: true,
  },
  {
    specialist: "Psychologist",
    description: "Supports mental health and emotional well-being.",
    image: "/doctor4.png",
    agentPrompt:
      "You are a caring Psychologist AI. Ask how the user is feeling emotionally and give short, supportive tips.",
    voiceId: "stella",
    subscriptionRequired: true,
  },
  {
    specialist: "Nutritionist",
    description: "Provides advice on healthy eating and weight management.",
    image: "/doctor5.png",
    agentPrompt:
      "You are a motivating Nutritionist AI. Ask about current diet or goals and suggest quick, healthy tips.",
    voiceId: "helios",
    subscriptionRequired: true,
  },
  {
    specialist: "Cardiologist",
    description: "Focuses on heart health and blood pressure issues.",
    image: "/doctor6.png",
    agentPrompt:
      "You are a calm Cardiologist AI. Ask about heart symptoms and offer brief, helpful advice.",
    voiceId: "angus",
    subscriptionRequired: true,
  },
  {
    specialist: "ENT Specialist",
    description: "Handles ear, nose, and throat-related problems.",
    image: "/doctor7.png",
    agentPrompt:
      "You are a friendly ENT AI. Ask quickly about ENT symptoms and give simple, clear suggestions.",
    voiceId: "hera",
    subscriptionRequired: true,
  },
  {
    specialist: "Orthopedic",
    description: "Helps with bone, joint, and muscle pain.",
    image: "/doctor8.png",
    agentPrompt:
      "You are an understanding Orthopedic AI. Ask where the pain is and give short, supportive advice.",
    voiceId: "arcas",
    subscriptionRequired: true,
  },
  {
    specialist: "Gynecologist",
    description: "Cares for women's reproductive and hormonal health.",
    image: "/doctor9.png",
    agentPrompt:
      "You are a respectful Gynecologist AI. Ask brief, gentle questions and keep answers short and reassuring.",
    voiceId: "athena",
    subscriptionRequired: true,
  },
  {
    specialist: "Dentist",
    description: "Handles oral hygiene and dental problems.",
    image: "/doctor10.png",
    agentPrompt:
      "You are a cheerful Dentist AI. Ask about the dental issue and give quick, calming suggestions.",
    voiceId: "zeus",
    subscriptionRequired: true,
  },
];

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedDoctors() {
  console.log("⏳ Seeding doctors data...");

  try {
    // First, clear existing doctors to avoid duplicates
    await pool.query("DELETE FROM doctor");
    console.log("✅ Cleared existing doctors data");

    // Insert doctors from the doctorsList
    for (const doctor of doctorsList) {
      await pool.query(
        `INSERT INTO doctor 
     (id, specialist, description, image, "agentPrompt", "voiceId", "subscriptionRequired") 
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          crypto.randomUUID(),
          doctor.specialist,
          doctor.description,
          doctor.image,
          doctor.agentPrompt,
          doctor.voiceId,
          doctor.subscriptionRequired,
        ]
      );
      console.log(`✅ Seeded doctor: ${doctor.specialist}`);
    }

    console.log("✅ All doctors seeded successfully");
  } catch (error) {
    console.error("❌ Seeding failed", error);
  } finally {
    await pool.end();
  }
}

// Run the seed function
seedDoctors();
