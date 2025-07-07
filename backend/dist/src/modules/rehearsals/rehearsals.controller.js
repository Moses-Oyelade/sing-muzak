"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RehearsalController = void 0;
const common_1 = require("@nestjs/common");
const rehearsals_service_1 = require("./rehearsals.service");
const jwt_guard_1 = require("../auth/jwt/jwt.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
let RehearsalController = class RehearsalController {
    constructor(rehearsalService) {
        this.rehearsalService = rehearsalService;
    }
    async scheduleRehearsal(body, req) {
        return this.rehearsalService.scheduleRehearsal(body.date, body.time, body.location, body.agenda, req.user.userId);
    }
    async getRehearsals() {
        return this.rehearsalService.getRehearsals();
    }
    async markAttendance(rehearsalId, userId) {
        return this.rehearsalService.markAttendance(rehearsalId, userId);
    }
    async markAttendanceForMember(rehearsalId, adminId, memberId) {
        return this.rehearsalService.markAttendanceForMember(rehearsalId, memberId, adminId);
    }
    async removeAttendanceForMember(rehearsalId, memberId, req) {
        return this.rehearsalService.removeAttendanceForMember(rehearsalId, memberId, req.user.userId);
    }
    async getAttendance(rehearsalId) {
        return this.rehearsalService.getAttendance(rehearsalId);
    }
    async getAttendanceReport(rehearsalId) {
        return this.rehearsalService.getAttendanceReport(rehearsalId);
    }
    async getAttendanceReportByDateRange(startDate, endDate) {
        return this.rehearsalService.getAttendanceReportByDateRange(startDate, endDate);
    }
    async exportAttendanceReportToCSV(startDate, endDate) {
        return this.rehearsalService.exportAttendanceReportToCSV(startDate, endDate);
    }
    async getAttendanceTrends(startDate, endDate) {
        return this.rehearsalService.getAttendanceTrends(startDate, endDate);
    }
};
exports.RehearsalController = RehearsalController;
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "scheduleRehearsal", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'member'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "getRehearsals", null);
__decorate([
    (0, roles_decorator_1.Roles)('member'),
    (0, common_1.Patch)(':rehearsalId/attendance'),
    __param(0, (0, common_1.Param)('rehearsalId')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "markAttendance", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Patch)(':rehearsalId/attendance/admin'),
    __param(0, (0, common_1.Param)('rehearsalId')),
    __param(1, (0, common_1.Body)('adminId')),
    __param(2, (0, common_1.Body)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "markAttendanceForMember", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Patch)(':id/attendance/admin/remove'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('memberId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "removeAttendanceForMember", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)(':id/attendance'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "getAttendance", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)(':id/attendance/report'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "getAttendanceReport", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)('attendance/report'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "getAttendanceReportByDateRange", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)('attendance/export'),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename=attendance_report.csv'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "exportAttendanceReportToCSV", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)('attendance/trends'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "getAttendanceTrends", null);
exports.RehearsalController = RehearsalController = __decorate([
    (0, common_1.Controller)('rehearsals'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [rehearsals_service_1.RehearsalService])
], RehearsalController);
//# sourceMappingURL=rehearsals.controller.js.map