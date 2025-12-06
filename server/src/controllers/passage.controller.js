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
    
    if (!title || !passage_text) {
        return res.status(400).json(new ApiResponse(400, null, "العنوان والنص مطلوبان"));
    }

    const passage = await PassageService.createPassage(req.body);
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

