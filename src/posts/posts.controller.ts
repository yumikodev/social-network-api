import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get("/")
  getAll(@Query("page") page: number, @Query() take: number) {}

  @Get("/:id")
  getOne(@Param("id") id: string) {}

  @Get("/")
  create(@Body() data) {}

  @Patch("/:id")
  update(@Body() data) {}

  @Delete("/:id")
  delete() {}
}
