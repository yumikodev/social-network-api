import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async profile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async deleteProfile(userId: string) {
    const deletedAccount = await this.prisma.user.delete({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    return deletedAccount;
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            Post: true,
          },
        },
      },
    });

    if (!user) throw new BadRequestException("Invalid user id");

    return user;
  }
}
