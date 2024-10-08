import { getAuthSession } from "@/lib/auth";
import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import { FC } from "react";
import PostVoteClient from "./PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initialVotesAmt?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const PostVoteServer: FC<PostVoteServerProps> = async ({
  postId,
  getData,
  initialVote,
  initialVotesAmt,
}) => {
  const session = await getAuthSession();

  let _votesAmt: number = 0;
  let _currentVote: VoteType | undefined | null = undefined;

  if (getData) {
    const post = await getData();
    if (!post) return notFound();

    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return (acc = acc + 1);
      if (vote.type === "DOWN") return (acc = acc - 1);
      return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id,
    )?.type;
  } else {
    _votesAmt = initialVotesAmt!;
    _currentVote = initialVote;
  }
  return (
    <PostVoteClient
      postId={postId}
      initialVoteAmt={_votesAmt}
      initialVote={_currentVote}
    />
  );
};

export default PostVoteServer;
