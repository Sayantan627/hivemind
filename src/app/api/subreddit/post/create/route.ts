import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { title, subredditId, content } = PostValidator.parse(body);
    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("Subscribe to post", { status: 400 });
    }
    await prisma.post.create({
      data: {
        title,
        subredditId,
        content,
        authorId: session.user.id,
      },
    });

    return new Response("Ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not publish post, please try again later", {
      status: 500,
    });
  }
};
