"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformancesModule = void 0;
const common_1 = require("@nestjs/common");
const performances_service_1 = require("./performances.service");
const performances_controller_1 = require("./performances.controller");
let PerformancesModule = class PerformancesModule {
};
exports.PerformancesModule = PerformancesModule;
exports.PerformancesModule = PerformancesModule = __decorate([
    (0, common_1.Module)({
        providers: [performances_service_1.PerformancesService],
        controllers: [performances_controller_1.PerformancesController]
    })
], PerformancesModule);
//# sourceMappingURL=performances.module.js.map