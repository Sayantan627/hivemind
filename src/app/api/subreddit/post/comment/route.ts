import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export const PATCH = async (req: Request) => {
  try {
    const body = await req.json();
    const { postId, text, replyToId } = CommentValidator.parse(body);
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    await prisma.comment.create({
      data: {
        postId,
        text,
        replyToId,
        authorId: session.user.id,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not post your comment, please try again later", {
      status: 500,
    });
  }
};
