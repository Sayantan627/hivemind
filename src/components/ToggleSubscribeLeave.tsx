"use client";

import { FC, startTransition } from "react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface ToggleSubscribeLeaveProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

const ToggleSubscribeLeave: FC<ToggleSubscribeLeaveProps> = ({
  subredditId,
  subredditName,
  isSubscribed,
}) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isPending: isSubscribePending } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast("You need to be logged in to join a community");
        }
      }
      toast({
        variant: "destructive",
        title: "There was an error",
        description: "Something went wrong, please try again later",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast({
        title: "Subscribed",
        description: `You are now to subscribed to ${subredditName}`,
      });
    },
  });

  const { mutate: unsubscribe, isPending: isUnsubscribePending } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast("You need to be logged in to join a community");
        }
      }
      toast({
        variant: "destructive",
        title: "There was an error",
        description: "Something went wrong, please try again later",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast({
        title: "Unsubscribed",
        description: `You are now unsubscribed from ${subredditName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      className="mb-4 mt-1 w-full"
      isLoading={isUnsubscribePending}
      onClick={() => unsubscribe()}
    >
      Leave Community
    </Button>
  ) : (
    <Button
      className="mb-4 mt-1 w-full"
      isLoading={isSubscribePending}
      onClick={() => subscribe()}
    >
      Join Community
    </Button>
  );
};

export default ToggleSubscribeLeave;
