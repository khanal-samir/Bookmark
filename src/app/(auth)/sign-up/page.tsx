"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import google from "../../../../public/icons8-google.svg";
import axios, { AxiosError } from "axios";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useDebounceCallback } from "usehooks-ts";
import { IApiResponse } from "@/types/apiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const SignUp = () => {
  const { toast } = useToast();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [debouncedLoading, setDebouncedLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailField, setEmailField] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const debounced = useDebounceCallback(setEmailField, 300);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "JohnDoe",
      email: "johnDoe@gmail.com",
      password: "123456",
    },
  });

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setSubmitLoading(true);
    try {
      const response = await axios.post<IApiResponse>(`api/sign-up`, data);
      if (response) {
        toast({
          title: "Success",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<IApiResponse>;

      // Default error message
      const errorMessage =
        axiosError.response?.data.message ||
        "There was a problem with your sign-up. Please try again.";

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    const uniqueEmail = async () => {
      setDebouncedLoading(true);
      setEmailMessage("");
      try {
        if (!emailField.trim()) return;
        const { data } = await axios.get(
          `api/checkunique-email?email=${emailField}`,
        );
        console.log(data);

        setEmailMessage(data.message);
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;
        setEmailMessage(
          axiosError.response?.data.message ?? "Error checking username",
        );
      } finally {
        setDebouncedLoading(false);
      }
    };

    uniqueEmail();
  }, [emailField]);

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg border-2 shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Bookmark
          </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input {...field} />

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...field}
                    name="email"
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {debouncedLoading && <Loader2 className="animate-spin" />}
                  {!debouncedLoading && emailMessage && (
                    <p
                      className={`text-sm ${
                        emailMessage === "Email is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {emailMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:bg-transparent hover:opacity-100 absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={submitLoading}>
              {submitLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 dark:bg-primary-foreground text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          className="w-full bg-green-500 flex gap-2 text-white"
          onClick={handleGoogleSignIn}
          disabled={submitLoading}
        >
          Sign In with Google
          <Image src={google} alt="google" className="w-6 h-6" />
        </Button>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
