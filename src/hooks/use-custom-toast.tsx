import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export const useCustomToast = () => {
  const loginToast = (message: string) => {
    const { dismiss } = toast({
      title: "Login required",
      description: message,
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          className={buttonVariants({
            variant: "secondary",
          })}
          onClick={() => dismiss()}
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
};
