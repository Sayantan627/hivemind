import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { CachedPost } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;

export const PATCH = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await prisma.vote.delete({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId,
            },
          },
        });
        return new Response("OK");
      }
      await prisma.vote.update({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId,
          },
        },
        data: {
          type: voteType,
        },
      });

      //   recount the votes
      const votesAmt = post.votes.reduce((acc, vote) => {
        if (voteType === "UP") return acc + 1;
        if (voteType === "DOWN") return acc - 1;
        return acc;
      }, 0);

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachedPayload: CachedPost = {
          id: post.id,
          authorUsername: post.author.id ?? "",
          content: JSON.stringify(post.content),
          title: post.title,
          currentVote: voteType,
          createdAt: post.createdAt,
        };

        await redis.hset(`post:${postId}`, cachedPayload);
      }
      return new Response("OK");
    }

    await prisma.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    });

    //   recount the votes
    const votesAmt = post.votes.reduce((acc, vote) => {
      if (voteType === "UP") return acc + 1;
      if (voteType === "DOWN") return acc - 1;
      return acc;
    }, 0);

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachedPayload: CachedPost = {
        id: post.id,
        authorUsername: post.author.id ?? "",
        content: JSON.stringify(post.content),
        title: post.title,
        currentVote: voteType,
        createdAt: post.createdAt,
      };
      await redis.hset(`post:${postId}`, cachedPayload);
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not register your vote, try again later", {
      status: 500,
    });
  }
};
