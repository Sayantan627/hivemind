import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { z } from "zod";

export const PATCH = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { name } = UsernameValidator.parse(body);
    const username = await prisma.user.findFirst({
      where: {
        username: name,
      },
    });

    if (username) {
      return new Response("Username is taken", { status: 409 });
    }
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });
    return new Response("Ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not unsubscribe, please try again later", {
      status: 500,
    });
  }
};
