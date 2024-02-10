import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePostDto } from "./dto/createPost.dto";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { CommentDto } from "./dto/comment.dto";

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getAll(page: number, take: number, userId: string | undefined) {
    const skip = (page - 1) * take;

    const query: Record<string, any> = {
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    };

    if (userId) {
      query.where = {
        authorId: userId,
      };
    }

    const posts = await this.prisma.post.findMany(query as any);

    return posts;
  }

  async getById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) throw new BadRequestException("Invalid post id");

    return post;
  }

  async toggleLike(userId: string, postId: string) {
    const isLiked = await this.prisma.likedPost.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (!isLiked) {
      await this.prisma.likedPost.create({
        data: {
          postId,
          userId,
        },
      });

      return {
        likes: +1,
      };
    }

    await this.prisma.likedPost.delete({
      where: {
        id: isLiked.id,
      },
    });

    return {
      likes: -1,
    };
  }

  async isLiked(userId: string, postId: string) {
    const isLiked = await this.prisma.likedPost.findFirst({
      where: {
        userId,
        postId,
      },
    });

    return {
      isLiked: !!isLiked,
    };
  }

  async getComments(postId: string) {
    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  }

  async createComment(postId: string, userId: string, { content }: CommentDto) {
    const newComment = await this.prisma.comment.create({
      data: {
        authorId: userId,
        postId,
        content,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return newComment;
  }

  async create(userId: string, data: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        ...data,
        authorId: userId,
      },
    });

    return post;
  }

  async update(postId: string, data: UpdatePostDto) {
    if (Object.keys(data).length === 0)
      throw new BadRequestException("Request body must be not empty");

    const updatedPost = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data,
    });

    return updatedPost;
  }

  async delete(postId: string) {
    const deletedPost = await this.prisma.post.delete({
      where: { id: postId },
    });

    return deletedPost;
  }
}
