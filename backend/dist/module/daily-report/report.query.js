"use strict";
// queries/getDailyReports.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportQueryHandler = exports.getDailyReports = void 0;
const report_repository_1 = require("../../repository/report.repository");
const getDailyReports = async ({ query }) => {
    const { page, limit } = query;
    const result = await report_repository_1.dailyReportRepository.getAll(page, limit);
    return {
        status: 200,
        body: {
            success: true,
            data: result.data.map((report) => ({
                id: report._id.toString(),
                reportDate: report.reportDate.toISOString(),
                totalRevenue: report.totalRevenue,
                totalOrders: report.totalOrders,
                cashSales: report.cashSales,
                onlineSales: report.onlineSales,
                totalDiscount: report.totalDiscount,
                totalTax: report.totalTax,
                generatedAt: report.generatedAt.toISOString(),
            })),
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        },
    };
};
exports.getDailyReports = getDailyReports;
exports.reportQueryHandler = {
    getDailyReports: exports.getDailyReports,
};
