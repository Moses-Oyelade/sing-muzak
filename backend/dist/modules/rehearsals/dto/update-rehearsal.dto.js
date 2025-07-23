"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRehearsalDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_rehearsal_dto_1 = require("./create-rehearsal.dto");
class UpdateRehearsalDto extends (0, mapped_types_1.PartialType)(create_rehearsal_dto_1.CreateRehearsalDto) {
}
exports.UpdateRehearsalDto = UpdateRehearsalDto;
//# sourceMappingURL=update-rehearsal.dto.js.map