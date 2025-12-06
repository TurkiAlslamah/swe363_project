import PassageService from "../services/passage.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllPassages = asyncHandler(async (req, res) => {
    const passages = await PassageService.getAllPassages();
    res.status(200).json(new ApiResponse(200, passages, "تم جلب الفقرات"));
});

export const getPassageById = asyncHandler(async (req, res) => {
    const passage = await PassageService.getPassageById(req.params.id);
    res.status(200).json(new ApiResponse(200, passage, "تم جلب الفقرة"));
});

export const createPassage = asyncHandler(async (req, res) => {
    const { title, passage_text } = req.body;
    
    if (!passage_text || !passage_text.trim()) {
        return res.status(400).json(new ApiResponse(400, null, "نص الفقرة مطلوب"));
    }

    // Title is optional, use default if not provided
    const passageData = {
        title: title && title.trim() ? title.trim() : 'فقرة بدون عنوان',
        passage_text: passage_text.trim()
    };

    const passage = await PassageService.createPassage(passageData);
    res.status(201).json(new ApiResponse(201, passage, "تم إنشاء الفقرة"));
});

export const updatePassage = asyncHandler(async (req, res) => {
    const passage = await PassageService.updatePassage(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, passage, "تم تحديث الفقرة"));
});

export const deletePassage = asyncHandler(async (req, res) => {
    await PassageService.deletePassage(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "تم حذف الفقرة"));
});

