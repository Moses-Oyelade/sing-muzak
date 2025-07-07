"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RehearsalModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const rehearsals_service_1 = require("./rehearsals.service");
const rehearsals_controller_1 = require("./rehearsals.controller");
const rehearsal_schema_1 = require("./schema/rehearsal.schema");
const auth_module_1 = require("../auth/auth.module");
const users_schema_1 = require("../users/schema/users.schema");
let RehearsalModule = class RehearsalModule {
};
exports.RehearsalModule = RehearsalModule;
exports.RehearsalModule = RehearsalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: rehearsal_schema_1.Rehearsal.name, schema: rehearsal_schema_1.RehearsalSchema },
                { name: users_schema_1.User.name, schema: users_schema_1.UserSchema }
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [rehearsals_controller_1.RehearsalController],
        providers: [rehearsals_service_1.RehearsalService],
        exports: [rehearsals_service_1.RehearsalService],
    })
], RehearsalModule);
//# sourceMappingURL=rehearsals.module.js.map