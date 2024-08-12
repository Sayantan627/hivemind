"use client";

import { UsernameRequest, UsernameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { FC } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface UsernameFormProps {
  user: Pick<User, "id" | "username">;
}

const UsernameForm: FC<UsernameFormProps> = ({ user }) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || "",
    },
  });

  const { mutate: changeUsername, isPending } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = { name };
      const { data } = await axios.patch(`/api/username`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Username already exists",
            description: "Please choose a different username name",
            variant: "destructive",
          });
        }
      }
      toast({
        variant: "destructive",
        title: "There was an error",
        description: "Could not change username",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your username changed successfully",
      });
      router.refresh();
    },
  });
  return (
    <form onSubmit={handleSubmit((e) => changeUsername(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Your Username</CardTitle>
          <CardDescription>
            Please enter a display name of your choice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute left-0 top-0 grid h-10 w-8 place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>

            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input className="w-[400px] pl-6" id="name" {...register("name")} />

            {errors.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isPending}>Change name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UsernameForm;
