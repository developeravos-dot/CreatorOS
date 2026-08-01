import { PrismaService } from '../../persistence/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import type { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class IdentityService {
  constructor(private readonly persistence: PrismaService) {}

  async createUser(input: CreateUserDto) {
    const exists = await this.persistence.creatorUser.findFirst({
      where: {
        OR: [
          { username: input.username },
          ...(input.email ? [{ email: input.email }] : []),
        ],
      },
    });

    if (exists) {
      throw new ConflictException('Username or email already exists.');
    }

    const passwordHash = await hash(input.password, 12);

    return this.persistence.creatorUser.create({
      data: {
        username: input.username,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });
  }

  listUsers() {
    return this.persistence.creatorUser.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        createdAt: true,
        roles: {
          select: {
            role: {
              select: {
                key: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignRole(userId: string, roleKey: string) {
    const user = await this.persistence.creatorUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const role = await this.persistence.creatorRole.findUnique({
      where: { key: roleKey },
    });

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    return this.persistence.creatorUserRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId,
        roleId: role.id,
      },
    });
  }
}