import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request } from "express";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/profile")
  profile(@Req() req: Request) {
    return this.usersService.profile(req["userId"]);
  }

  @Delete("/profile")
  deleteProfile(@Req() req: Request) {
    return this.usersService.deleteProfile(req["userId"]);
  }

  @Get("/:id")
  getUser(@Param("id") id: string) {
    return this.usersService.getUser(id);
  }
}
