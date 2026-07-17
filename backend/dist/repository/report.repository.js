"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyReportRepository = void 0;
const report_model_1 = __importDefault(require("../model/report.model"));
class DailyReportRepository {
    async create(payload) {
        return report_model_1.default.create(payload);
    }
    async getByDate(reportDate) {
        return report_model_1.default.findOne({
            reportDate,
        });
    }
    async getAll(page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            report_model_1.default.find().sort({ reportDate: -1 }).skip(skip).limit(limit),
            report_model_1.default.countDocuments(),
        ]);
        return {
            data,
            total,
        };
    }
}
exports.dailyReportRepository = new DailyReportRepository();
