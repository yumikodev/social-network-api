import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { compare, genSalt, hash } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !(await compare(password, user.password)))
      throw new BadRequestException("Invalid credentials");

    const token = await this.jwtService.signAsync({ userId: user.id });

    return {
      token,
    };
  }

  async register({ username, email, password }: RegisterDto) {
    const existUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });

    if (existUser) throw new BadRequestException("Taken credentials");

    const salt = await genSalt(10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: await hash(password, salt),
      },
    });

    const token = await this.jwtService.signAsync({ userId: user.id });

    return {
      token,
    };
  }
}
