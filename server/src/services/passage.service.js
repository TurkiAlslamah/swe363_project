import Passage from "../models/Passage.model.js";
import ApiError from "../utils/ApiError.js";

class PassageService {
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
}

export default new PassageService();

