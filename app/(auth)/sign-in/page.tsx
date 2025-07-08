"use client";

import React from "react";
import { useForm, FormProvider, FieldValues, UseFormReturn, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Import from lovable-techy-ui or copy locally as needed
import AuthLayout from "@/components/AuthLayout";
import TechyButton from "@/components/TechyButton";
import {
  Form,
  FormControl,
  FormField as RawFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signInAction } from "@/app/actions/auth/sign-in";
import { getSessionFromCookie } from "@/app/actions/auth/get-session";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = React.useState<string | null>(null);
  const { useRouter } = require('next/navigation');
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  async function handleSetCookie(token: string) {
    const { setAuthCookie } = await import("@/app/actions/auth/set-cookie");
    await setAuthCookie(token);
  }

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    setError(null);
    const fd = new FormData();
    fd.append("email", data.email);
    fd.append("password", data.password);
    const result: any = await signInAction(fd);
    if (result && result.success && result.token) {
      await handleSetCookie(result.token);
      router.push("/");
      setLoading(false);
    } else {
      setError(result?.error || "Sign in failed");
      setLoading(false);
    }
  };


  return (
    <AuthLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-border shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-neutral mb-2">Welcome Back</h1>
              <p className="text-neutral-muted">Sign in to your Techy account</p>
            </div>
            <FormProvider {...form}>
              {/**
               * TypeScript workaround: cast FormField to correct type since lovable-techy-ui does not export types for consuming projects.
               */}
              {(() => {
                type ControllerPropsAny = import("react-hook-form").ControllerProps<any, any>;
                const TypedFormField = RawFormField as React.FC<ControllerPropsAny>;
                return (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <TypedFormField
                      control={form.control}
                      name="email"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <TypedFormField
                      control={form.control}
                      name="password"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {error && (
                      <div className="text-red-600 text-sm text-center">{error}</div>
                    )}
                    <TechyButton variant="primary" type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <ReloadIcon className="h-5 w-5 animate-spin text-white mx-auto" />
                      ) : (
                        'Sign In'
                      )}
                    </TechyButton>
                  </form>
                );
              })()}
            </FormProvider>
            <div className="text-center mt-6 space-y-2">
              <Link href="/forgot-password" className="block text-primary hover:text-primary/80 text-sm font-medium">
                Forgot your password?
              </Link>
              <div>
                <span className="text-neutral-muted">Don't have an account? </span>
                <Link href="/sign-up" className="text-primary hover:text-primary/80 font-medium">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
