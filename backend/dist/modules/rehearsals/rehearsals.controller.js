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
const update_rehearsal_dto_1 = require("./dto/update-rehearsal.dto");
const create_rehearsal_dto_1 = require("./dto/create-rehearsal.dto");
const confirm_delete_guard_1 = require("../common/guards/confirm-delete.guard");
let RehearsalController = class RehearsalController {
    constructor(rehearsalService) {
        this.rehearsalService = rehearsalService;
    }
    async scheduleRehearsal(createRehearsalDto, req) {
        const adminId = req.user.id;
        return this.rehearsalService.scheduleRehearsal(createRehearsalDto, adminId);
    }
    async getRehearsals() {
        return this.rehearsalService.getRehearsals();
    }
    async markAttendance(rehearsalId, req) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('User ID not found in request');
        }
        return this.rehearsalService.markAttendance(rehearsalId, userId);
    }
    async markAttendanceForMembers(rehearsalId, attendees, req) {
        const adminId = req.user.sub;
        if (!adminId)
            throw new common_1.UnauthorizedException('Admin ID is missing from request');
        const attendeesArray = Array.isArray(attendees) ? attendees : [attendees];
        return this.rehearsalService.markAttendanceForMembers(rehearsalId, attendeesArray, adminId);
    }
    async removeAttendanceForMembers(rehearsalId, attendees, req) {
        const adminId = req.user?.sub;
        if (!adminId) {
            throw new common_1.UnauthorizedException('Admin ID is missing from request');
        }
        const memberIds = Array.isArray(attendees) ? attendees : [attendees];
        if (memberIds.length === 0) {
            throw new common_1.BadRequestException('attendees must be a non-empty array');
        }
        return this.rehearsalService.removeAttendanceForMembers(rehearsalId, memberIds);
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
    async getRehearsalById(id) {
        return this.rehearsalService.findByIdWithAttendees(id);
    }
    async getAttendanceStats(id) {
        return this.rehearsalService.getAttendanceStats(id);
    }
    async deleteRehearsal(id) {
        return this.rehearsalService.deleteRehearsal(id);
    }
    async updateRehearsal(id, updateRehearsalDto) {
        return this.rehearsalService.updateRehearsal(id, updateRehearsalDto);
    }
    async deleteAllRehearsals() {
        return this.rehearsalService.deleteAllRehearsals();
    }
};
exports.RehearsalController = RehearsalController;
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rehearsal_dto_1.CreateRehearsalDto, Object]),
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
    (0, common_1.Patch)(':rehearsalId/attendance'),
    (0, roles_decorator_1.Roles)('member'),
    __param(0, (0, common_1.Param)('rehearsalId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "markAttendance", null);
__decorate([
    (0, common_1.Patch)(':id/attendance/admin'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('attendees')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "markAttendanceForMembers", null);
__decorate([
    (0, common_1.Patch)(':id/attendance/admin/remove'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('attendees')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "removeAttendanceForMembers", null);
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
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'member'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "getRehearsalById", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)(':id/attendance/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "getAttendanceStats", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "deleteRehearsal", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rehearsal_dto_1.UpdateRehearsalDto]),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "updateRehearsal", null);
__decorate([
    (0, common_1.Delete)("all"),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseGuards)(confirm_delete_guard_1.ConfirmDeleteGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RehearsalController.prototype, "deleteAllRehearsals", null);
exports.RehearsalController = RehearsalController = __decorate([
    (0, common_1.Controller)('rehearsals'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [rehearsals_service_1.RehearsalService])
], RehearsalController);
//# sourceMappingURL=rehearsals.controller.js.map