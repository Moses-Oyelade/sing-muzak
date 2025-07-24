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
exports.RehearsalService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const rehearsal_schema_1 = require("./schema/rehearsal.schema");
const json2csv_1 = require("json2csv");
const users_schema_1 = require("../users/schema/users.schema");
let RehearsalService = class RehearsalService {
    constructor(userModel, rehearsalModel) {
        this.userModel = userModel;
        this.rehearsalModel = rehearsalModel;
    }
    async scheduleRehearsal(dto, adminId) {
        const created = await this.rehearsalModel.create({
            ...dto,
            createdBy: adminId,
        });
        return created.populate('createdBy');
    }
    async getRehearsals() {
        return await this.rehearsalModel.find().populate('attendees', 'name phone').sort({ createdAt: -1 }).exec();
    }
    async markAttendance(rehearsalId, userId) {
        const rehearsal = await this.rehearsalModel.findById(rehearsalId);
        if (!rehearsal)
            throw new common_1.NotFoundException('Rehearsal not found');
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const alreadyMarked = rehearsal.attendees.some((att) => att.toString() === userObjectId.toString());
        if (alreadyMarked) {
            throw new common_1.ForbiddenException('Attendance already marked by you or an admin');
        }
        rehearsal.attendees.push(userObjectId);
        await rehearsal.save();
        const updatedRehearsal = await this.rehearsalModel.findById(rehearsalId).populate({
            path: 'attendees',
            select: '_id name voicePart email',
        });
        if (!updatedRehearsal) {
            throw new common_1.InternalServerErrorException('Failed to retrieve updated rehearsal');
        }
        return {
            message: 'Attendance marked successfully',
            rehearsalId: updatedRehearsal._id,
            attendees: updatedRehearsal.attendees,
        };
    }
    async markAttendanceForMembers(rehearsalId, attendees, adminId) {
        const rehearsal = await this.rehearsalModel.findById(rehearsalId);
        if (!rehearsal) {
            throw new common_1.NotFoundException('Rehearsal not found');
        }
        const newAttendees = attendees
            .map(id => new mongoose_2.Types.ObjectId(id))
            .filter(objId => !rehearsal.attendees.some(existing => existing.equals(objId)));
        if (newAttendees.length > 0) {
            rehearsal.attendees.push(...newAttendees);
        }
        if (!rehearsal.createdBy) {
            rehearsal.createdBy = new mongoose_2.Types.ObjectId(adminId);
        }
        await rehearsal.save();
        await rehearsal.populate([
            {
                path: 'attendees',
                select: '_id name voicePart email',
            },
            {
                path: 'createdBy',
                select: '_id name email',
            },
        ]);
        return {
            message: 'Members marked present successfully',
            rehearsalId: rehearsal._id,
            attendees: rehearsal.attendees,
            createdBy: rehearsal.createdBy,
        };
    }
    async removeAttendanceForMembers(rehearsalId, memberIds) {
        const rehearsal = await this.rehearsalModel.findById(rehearsalId);
        if (!rehearsal) {
            throw new common_1.NotFoundException('Rehearsal not found');
        }
        const memberObjectIds = memberIds.map((id) => new mongoose_2.Types.ObjectId(id));
        rehearsal.attendees = rehearsal.attendees.filter((att) => !memberObjectIds.some((id) => id.equals(att)));
        await rehearsal.save();
        await rehearsal.populate({
            path: 'attendees',
            select: '_id name voicePart email',
        });
        return {
            message: 'Selected member(s) removed from attendance',
            rehearsalId: rehearsal._id,
            attendees: rehearsal.attendees,
        };
    }
    async getAttendance(rehearsalId) {
        const rehearsal = await this.rehearsalModel.findById(new mongoose_2.Types.ObjectId(rehearsalId)).populate({
            path: 'attendees',
            select: '_id name email voicePart',
        }).exec();
        if (!rehearsal)
            throw new common_1.NotFoundException('Rehearsal not found');
        return rehearsal.attendees;
    }
    async getAttendanceReport(rehearsalId) {
        const rehearsal = await this.rehearsalModel
            .findById(rehearsalId)
            .populate({ path: 'attendees', select: 'name voicePart', model: 'User' })
            .exec();
        if (!rehearsal)
            throw new common_1.NotFoundException('Rehearsal not found');
        const missingUsers = await this.userModel.find({
            _id: { $in: rehearsal.attendees },
        });
        if (missingUsers.length === 0) {
            console.warn('No matching users found for attendees!');
        }
        return {
            rehearsalId: rehearsal._id,
            date: rehearsal.date,
            attendees: rehearsal.attendees.map((member) => ({
                id: member._id,
                name: member.name || 'Unknown',
                voicePart: member.voicePart || 'Not Specified',
            }))
        };
    }
    async getAttendanceReportByDateRange(startDate, endDate) {
        const rehearsals = await this.rehearsalModel
            .find({
            createdBy: { $gte: new Date(startDate), $lte: new Date(endDate) }
        })
            .populate('attendees', 'name voicePart').exec();
        return rehearsals.map(rehearsal => ({
            rehearsalId: rehearsal._id,
            date: rehearsal.date,
            attendees: rehearsal.attendees.map((member) => ({
                id: member._id,
                name: member.name,
                voicePart: member.voicePart
            }))
        }));
    }
    async exportAttendanceReportToCSV(startDate, endDate) {
        const data = await this.getAttendanceReportByDateRange(startDate, endDate);
        const fields = ['rehearsalId', 'date', 'attendees.id', 'attendees.name', 'attendees.voicePart'];
        const json2csvParser = new json2csv_1.Parser({ fields });
        const csv = json2csvParser.parse(data);
        return csv;
    }
    async getAttendanceTrends(startDate, endDate) {
        const rehearsals = await this.rehearsalModel.find({
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });
        const trends = rehearsals.map(rehearsal => ({
            date: rehearsal.date,
            totalAttendees: rehearsal.attendees.length
        }));
        return trends;
    }
    async getRehearsalById(id) {
        const rehearsal = await this.rehearsalModel.findById(id).populate({
            path: 'attendees',
            select: '_id name email voicePart',
        });
        if (!rehearsal) {
            throw new common_1.NotFoundException('Rehearsal not found');
        }
        return rehearsal;
    }
    async getAttendanceStats(rehearsalId) {
        if (!mongoose_2.Types.ObjectId.isValid(rehearsalId)) {
            throw new common_1.BadRequestException("Invalid rehearsal ID");
        }
        const rehearsalObjectId = new mongoose_2.Types.ObjectId(rehearsalId);
        const rehearsal = await this.rehearsalModel.findById(rehearsalObjectId).lean();
        if (!rehearsal) {
            throw new common_1.NotFoundException('Rehearsal not found');
        }
        const totalMembers = await this.userModel.countDocuments({ role: 'member' });
        const present = rehearsal.attendees?.length ?? 0;
        const absent = totalMembers - present;
        return {
            rehearsalId,
            totalMembers,
            present,
            absent,
        };
    }
    async deleteRehearsal(id) {
        const res = await this.rehearsalModel.deleteOne({ _id: id });
        return { deleted: res.deletedCount > 0 };
    }
    async updateRehearsal(id, updateRehearsalDto) {
        const updatedRehearsal = await this.rehearsalModel.findByIdAndUpdate(id, updateRehearsalDto, { new: true });
        if (!updatedRehearsal) {
            throw new common_1.NotFoundException('Rehearsal not found');
        }
        return updatedRehearsal;
    }
    async deleteAllRehearsals() {
        const result = await this.rehearsalModel.deleteMany({});
        return { message: `All ${result.deletedCount} rehearsals deleted` };
    }
    async findByIdWithAttendees(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid rehearsal ID format');
        }
        const rehearsal = await this.rehearsalModel.findById(id).populate({
            path: 'attendees',
            select: '_id name voicePart email',
        });
        if (!rehearsal) {
            throw new common_1.NotFoundException('Rehearsal not found');
        }
        return rehearsal;
    }
};
exports.RehearsalService = RehearsalService;
exports.RehearsalService = RehearsalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(rehearsal_schema_1.Rehearsal.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], RehearsalService);
//# sourceMappingURL=rehearsals.service.js.map