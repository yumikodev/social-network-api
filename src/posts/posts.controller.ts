import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { AuthGuard } from "src/auth/auth.guard";
import { CreatePostDto } from "./dto/createPost.dto";
import { Request } from "express";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { CommentDto } from "./dto/comment.dto";

@UseGuards(AuthGuard)
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get("/")
  getAll(
    @Query("page") page: string | undefined,
    @Query("take") take: string | undefined,
    @Query("userId") userId: string | undefined,
  ) {
    return this.postsService.getAll(
      parseInt(page) || 1,
      parseInt(take) || 30,
      userId,
    );
  }

  @Get("/:id")
  getOne(@Param("id") id: string) {
    return this.postsService.getById(id);
  }

  @Get("/:id/like")
  isLikedPost(@Param("id") id: string, @Req() req: Request) {
    return this.postsService.isLiked(req["userId"], id);
  }

  @Post("/:id/like")
  likedPost(@Param("id") id: string, @Req() req: Request) {
    return this.postsService.toggleLike(req["userId"], id);
  }

  @Get("/:id/comments")
  getComments(@Param("id") id: string) {
    return this.postsService.getComments(id);
  }

  @Post("/:id/comments")
  newComment(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: CommentDto,
  ) {
    return this.postsService.createComment(id, req["userId"], data);
  }

  @Post("/")
  create(@Req() req: Request, @Body() data: CreatePostDto) {
    return this.postsService.create(req["userId"], data);
  }

  @Patch("/:id")
  update(@Param("id") id: string, @Body() data: UpdatePostDto) {
    return this.postsService.update(id, data);
  }

  @Delete("/:id")
  delete(@Param("id") id: string) {
    return this.postsService.delete(id);
  }
}
