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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        console.log('Request Headers:', request.headers);
        console.log('Authorization Header:', authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('JWT is missing or malformed!');
            throw new common_1.UnauthorizedException('Authorization token is missing or malformed');
        }
        const token = authHeader?.split(' ')[1];
        console.log('Decoded JWT:', this.jwtService.decode(token));
        if (!token) {
            console.log('JWT is missing!');
            return false;
        }
        else {
            console.log('Decoding JWT:', token);
        }
        try {
            const decoded = this.jwtService.verify(token);
            console.log('Verified JWT:', decoded);
            request.user = decoded;
            console.log('🔥 Incoming user from JWT:', request.user);
            return true;
        }
        catch (e) {
            console.error('JWT verification failed:', e.message);
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], JwtAuthGuard);
//# sourceMappingURL=jwt.guard.js.map