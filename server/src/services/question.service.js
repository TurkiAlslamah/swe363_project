import Question from "../models/Question.model.js";
import QuestionType from "../models/QuestionType.model.js";
import InternalType from "../models/InternalType.model.js";
import Passage from "../models/Passage.model.js";
import ApiError from "../utils/ApiError.js";

class QuestionService {
    // ============ QUESTION TYPES ============
    async getAllQuestionTypes() {
        return await QuestionType.find().sort({ type_id: 1 });
    }

    async createQuestionType(data) {
        const exists = await QuestionType.findOne({ type_id: data.type_id });
        if (exists) {
            throw new ApiError(400, "نوع السؤال موجود بالفعل");
        }
        return await QuestionType.create(data);
    }

    // ============ INTERNAL TYPES ============
    async getAllInternalTypes() {
        return await InternalType.find().sort({ internal_type_id: 1 });
    }

    async getInternalTypesByTypeId(type_id) {
        return await InternalType.find({ type_id }).sort({ internal_type_id: 1 });
    }

    async createInternalType(data) {
        const exists = await InternalType.findOne({ internal_type_id: data.internal_type_id });
        if (exists) {
            throw new ApiError(400, "النوع الفرعي موجود بالفعل");
        }
        return await InternalType.create(data);
    }

    // ============ PASSAGES ============
    async getAllPassages() {
        return await Passage.find().sort({ createdAt: -1 });
    }

    async getPassageById(id) {
        const passage = await Passage.findById(id);
        if (!passage) {
            throw new ApiError(404, "الفقرة غير موجودة");
        }
        return passage;
    }

    async createPassage(data) {
        return await Passage.create(data);
    }

    async updatePassage(id, data) {
        const passage = await Passage.findByIdAndUpdate(id, data, { new: true });
        if (!passage) {
            throw new ApiError(404, "الفقرة غير موجودة");
        }
        return passage;
    }

    async deletePassage(id) {
        const passage = await Passage.findByIdAndDelete(id);
        if (!passage) {
            throw new ApiError(404, "الفقرة غير موجودة");
        }
        return passage;
    }

    // ============ QUESTIONS ============
    async getAllQuestions(filters = {}) {
        const query = {};
        
        if (filters.type_id) query.type_id = filters.type_id;
        if (filters.internal_type_id) query.internal_type_id = filters.internal_type_id;
        if (filters.passage_id) query.passage_id = filters.passage_id;

        return await Question.find(query)
            .populate("passage_id")
            .sort({ q_no: 1 });
    }

    async getQuestionById(id) {
        const question = await Question.findById(id).populate("passage_id");
        if (!question) {
            throw new ApiError(404, "السؤال غير موجود");
        }
        return question;
    }

    async getQuestionsByPassageId(passage_id) {
        return await Question.find({ passage_id }).sort({ q_no: 1 });
    }

    async createQuestion(data) {
        // Validate: must have either text or image
        if (data.is_question_text && !data.question_text) {
            throw new ApiError(400, "نص السؤال مطلوب");
        }
        if (!data.is_question_text && !data.question_image) {
            throw new ApiError(400, "صورة السؤال مطلوبة");
        }

        return await Question.create(data);
    }

    async updateQuestion(id, data) {
        // Verify question exists
        const currentQuestion = await Question.findById(id);
        if (!currentQuestion) {
            throw new ApiError(404, "السؤال غير موجود");
        }

        // MANDATORY: Always set status to "قيد المراجعة" when updating ANY question
        // This overrides any existing status (مقبول, مرفوض, etc.)
        data.status = "قيد المراجعة";

        // Update the question
        const question = await Question.findByIdAndUpdate(id, data, { new: true });
        return question;
    }

    async deleteQuestion(id) {
        // Delete the question
        const question = await Question.findByIdAndDelete(id);
        if (!question) {
            throw new ApiError(404, "السؤال غير موجود");
        }

        // MANDATORY: Re-sequence all remaining questions after deletion
        // Fetch all remaining questions sorted by current q_no
        const remainingQuestions = await Question.find().sort({ q_no: 1 });
        
        // Reassign q_no values sequentially starting from 1
        for (let i = 0; i < remainingQuestions.length; i++) {
            await Question.findByIdAndUpdate(
                remainingQuestions[i]._id,
                { q_no: i + 1 }
            );
        }

        return question;
    }

    // ============ RANDOM QUESTIONS ============
    async getRandomQuestions(type_id, count = 10) {
        return await Question.aggregate([
            { $match: { type_id: parseInt(type_id) } },
            { $sample: { size: parseInt(count) } }
        ]);
    }
}

export default new QuestionService();