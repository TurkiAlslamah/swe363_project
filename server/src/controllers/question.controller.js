import QuestionService from "../services/question.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ============ QUESTION TYPES ============
export const getAllQuestionTypes = asyncHandler(async (req, res) => {
    const types = await QuestionService.getAllQuestionTypes();
    res.status(200).json(new ApiResponse(200, types, "تم جلب أنواع الأسئلة"));
});

export const createQuestionType = asyncHandler(async (req, res) => {
    const type = await QuestionService.createQuestionType(req.body);
    res.status(201).json(new ApiResponse(201, type, "تم إنشاء نوع السؤال"));
});

// ============ INTERNAL TYPES ============
export const getAllInternalTypes = asyncHandler(async (req, res) => {
    const types = await QuestionService.getAllInternalTypes();
    res.status(200).json(new ApiResponse(200, types, "تم جلب الأنواع الفرعية"));
});

export const getInternalTypesByTypeId = asyncHandler(async (req, res) => {
    const types = await QuestionService.getInternalTypesByTypeId(req.params.typeId);
    res.status(200).json(new ApiResponse(200, types, "تم جلب الأنواع الفرعية"));
});

export const createInternalType = asyncHandler(async (req, res) => {
    const type = await QuestionService.createInternalType(req.body);
    res.status(201).json(new ApiResponse(201, type, "تم إنشاء النوع الفرعي"));
});

// ============ PASSAGES ============
export const getAllPassages = asyncHandler(async (req, res) => {
    const passages = await QuestionService.getAllPassages();
    res.status(200).json(new ApiResponse(200, passages, "تم جلب الفقرات"));
});

export const getPassageById = asyncHandler(async (req, res) => {
    const passage = await QuestionService.getPassageById(req.params.id);
    res.status(200).json(new ApiResponse(200, passage, "تم جلب الفقرة"));
});

export const createPassage = asyncHandler(async (req, res) => {
    const { title, passage_text } = req.body;
    
    if (!title || !passage_text) {
        return res.status(400).json(new ApiResponse(400, null, "العنوان والنص مطلوبان"));
    }

    const passage = await QuestionService.createPassage(req.body);
    res.status(201).json(new ApiResponse(201, passage, "تم إنشاء الفقرة"));
});

export const updatePassage = asyncHandler(async (req, res) => {
    const passage = await QuestionService.updatePassage(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, passage, "تم تحديث الفقرة"));
});

export const deletePassage = asyncHandler(async (req, res) => {
    await QuestionService.deletePassage(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "تم حذف الفقرة"));
});

// ============ QUESTIONS ============
export const getAllQuestions = asyncHandler(async (req, res) => {
    const filters = {
        type_id: req.query.type_id,
        internal_type_id: req.query.internal_type_id,
        passage_id: req.query.passage_id
    };
    const questions = await QuestionService.getAllQuestions(filters);
    res.status(200).json(new ApiResponse(200, questions, "تم جلب الأسئلة"));
});

export const getQuestionById = asyncHandler(async (req, res) => {
    const question = await QuestionService.getQuestionById(req.params.id);
    res.status(200).json(new ApiResponse(200, question, "تم جلب السؤال"));
});

export const getQuestionsByPassageId = asyncHandler(async (req, res) => {
    const questions = await QuestionService.getQuestionsByPassageId(req.params.passageId);
    res.status(200).json(new ApiResponse(200, questions, "تم جلب أسئلة الفقرة"));
});

export const createQuestion = asyncHandler(async (req, res) => {
    const question = await QuestionService.createQuestion(req.body);
    res.status(201).json(new ApiResponse(201, question, "تم إنشاء السؤال"));
});

export const updateQuestion = asyncHandler(async (req, res) => {
    const question = await QuestionService.updateQuestion(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, question, "تم تحديث السؤال"));
});

export const deleteQuestion = asyncHandler(async (req, res) => {
    await QuestionService.deleteQuestion(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "تم حذف السؤال"));
});

// ============ RANDOM QUESTIONS ============
export const getRandomQuestions = asyncHandler(async (req, res) => {
    const { type_id, count } = req.query;
    
    if (!type_id) {
        return res.status(400).json(new ApiResponse(400, null, "نوع السؤال مطلوب"));
    }

    const questions = await QuestionService.getRandomQuestions(type_id, count || 10);
    res.status(200).json(new ApiResponse(200, questions, "تم جلب الأسئلة العشوائية"));
});