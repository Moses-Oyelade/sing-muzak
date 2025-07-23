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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RehearsalSchema = exports.Rehearsal = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Rehearsal = class Rehearsal {
};
exports.Rehearsal = Rehearsal;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Rehearsal.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Rehearsal.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Rehearsal.prototype, "time", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Rehearsal.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'User' }], default: [] }),
    __metadata("design:type", Array)
], Rehearsal.prototype, "attendees", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Rehearsal.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Rehearsal.prototype, "description", void 0);
exports.Rehearsal = Rehearsal = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Rehearsal);
exports.RehearsalSchema = mongoose_1.SchemaFactory.createForClass(Rehearsal);
exports.RehearsalSchema.virtual('attendeeDetails', {
    ref: 'User',
    localField: 'attendees',
    foreignField: '_id',
    justOne: false,
});
exports.RehearsalSchema.virtual('createdByDetails', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true,
});
//# sourceMappingURL=rehearsal.schema.js.map