import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);
    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });
    if (!subscriptionExists) {
      return new Response("You are not subscribed", { status: 400 });
    }

    const subreddit = await prisma.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });

    if (subreddit) {
      return new Response("You can't unsubscribe from your own subreddit", {
        status: 400,
      });
    }

    await prisma.subscription.delete({
      where: {
        userId_subredditId: {
          userId: session.user.id,
          subredditId,
        },
      },
    });

    return new Response(subredditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not unsubscribe, please try again later", {
      status: 500,
    });
  }
};
