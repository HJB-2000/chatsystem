import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export function parseId(value: string | undefined, name = 'id'): bigint {
    if (!/^\d+$/.test(value ?? '')) throw new BadRequestException(`Invalid ${name}`);{
    return BigInt(value!);}
}

@Injectable()
export class UserCheckService {
    constructor(private readonly prisma: PrismaService) {}

    async requireUser(userTagId: string) {
        if (typeof userTagId !== 'string' || !/^[A-Za-z0-9_-]{16,128}$/.test(userTagId))
            throw new UnauthorizedException();
        const user = await this.prisma.user.findUnique({
            where: { userTagId },
            select: { userId: true, username: true },
        });
        if (!user) throw new UnauthorizedException();
        return user;
    }
}