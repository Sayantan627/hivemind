import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { FC } from "react";
import PostComment from "./ui/PostComment";
import CreateComment from "./CreateComment";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: FC<CommentsSectionProps> = async ({ postId }) => {
  const session = await getAuthSession();
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      replyTo: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <hr className="my-6 h-px w-full" />

      <CreateComment postId={postId} />
      <div className="mt-4 flex flex-col gap-y-6">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc;
              },
              0,
            );
            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id,
            );
            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment comment={topLevelComment} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
