"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";

interface VerifyEmailProps {
  token: string;
}

export function VerifyEmail({ token }: VerifyEmailProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (response.ok) {
          setIsVerified(true);
          toast({
            title: "Email verified",
            description: "Your email has been successfully verified.",
          });
        } else {
          toast({
            title: "Verification failed",
            description:
              data.message || "An error occurred during email verification.",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Verification failed",
          description: "An error occurred during email verification.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  if (isLoading) {
    return <Loader size="lg" />;
  }

  return (
    <div className="text-center">
      {isVerified ? (
        <>
          <p className="mb-4 text-white">
            Your email has been successfully verified.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-700"
          >
            Go to Login
          </Button>
        </>
      ) : (
        <>
          <p className="mb-4 text-white">
            Email verification failed. Please try again or contact support.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-700"
          >
            Go to Home
          </Button>
        </>
      )}
    </div>
  );
}
