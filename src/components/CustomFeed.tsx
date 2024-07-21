import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import PostFeed from "./PostFeed";

const CustomFeed = async () => {
  const session = await getAuthSession();

  const followedCommunities = await prisma.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map((community) => community.subreddit.name),
        },
      },
    },
    include: {
      author: true,
      subreddit: true,
      votes: true,
      comments: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    orderBy: {
      createdAt: "desc",
    },
  });
  return <PostFeed initialPosts={posts} />;
};
export default CustomFeed;
