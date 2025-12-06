import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

import QuestionType from "./models/QuestionType.model.js";
import InternalType from "./models/InternalType.model.js";

const questionTypes = [
    { type_id: 1, type_name: "لفظي", type_name_en: "Verbal" },
    { type_id: 2, type_name: "كمي", type_name_en: "Quantitative" }
];

const internalTypes = [
    { internal_type_id: 1, type_id: 1, internal_name: "استيعاب المقروء", internal_name_en: "Reading Comprehension" },
    { internal_type_id: 2, type_id: 1, internal_name: "التناظر اللفظي", internal_name_en: "Verbal Analogies" },
    { internal_type_id: 3, type_id: 1, internal_name: "إكمال الجمل", internal_name_en: "Sentence Completion" },
    { internal_type_id: 4, type_id: 1, internal_name: "الخطأ السياقي", internal_name_en: "Contextual Error" },
    { internal_type_id: 5, type_id: 1, internal_name: "المفردة الشاذة", internal_name_en: "Odd Word Out" },
    { internal_type_id: 6, type_id: 2, internal_name: "جبر", internal_name_en: "Algebra" },
    { internal_type_id: 7, type_id: 2, internal_name: "هندسة", internal_name_en: "Geometry" },
    { internal_type_id: 8, type_id: 2, internal_name: "الإحصاء والاحتمالات", internal_name_en: "Statistics" },
    { internal_type_id: 9, type_id: 2, internal_name: "حساب", internal_name_en: "Arithmetic" },
    { internal_type_id: 10, type_id: 2, internal_name: "مقارنات كمية", internal_name_en: "Quantitative Comparisons" }
  
];
const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔥 Connected to MongoDB");

        await QuestionType.deleteMany({});
        await InternalType.deleteMany({});

        await QuestionType.insertMany(questionTypes);
        await InternalType.insertMany(internalTypes);

        console.log("✅ Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

seedDB();