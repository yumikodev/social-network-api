import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtConfig } from "src/config/configuration";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: async (config: ConfigService) => ({
        secret: config.get<JwtConfig>("JWT").ACCESS_SECRET,
        signOptions: {
          expiresIn: config.get<JwtConfig>("JWT").ACCESS_EXPIRE,
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
