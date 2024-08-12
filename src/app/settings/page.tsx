export const metadata = {
  title: "Settings",
  description: "Manage account and website settings",
};

import UsernameForm from "@/components/UsernameForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/sign-in");
  }
  return (
    <div className="mx-auto max-w-4xl py-12">
      <div className="grid items-start gap-8">
        <h1 className="text-3xl font-bold md:text-4xl">Settings</h1>
      </div>
      <div className="grid gap-10">
        <UsernameForm
          user={{
            id: session.user.id,
            username: session.user.username || "",
          }}
        />
      </div>
    </div>
  );
};

export default page;
