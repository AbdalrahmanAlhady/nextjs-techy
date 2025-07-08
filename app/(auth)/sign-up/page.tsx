"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout";
import TechyButton from "@/components/TechyButton";
import {
  Form,
  FormControl,
  FormField as RawFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Link from "next/link";
import { signUpAction } from "@/app/actions/auth/sign-up";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/AuthLayout";

const signUpSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/(?=.*\d)/, "Password must include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);
    const fd = new FormData();
    fd.append("name", data.fullName);
    fd.append("email", data.email);
    fd.append("password", data.password);
    const result = await signUpAction(fd);
    if (result && !result.success) {
      setError(result.error || "Sign up failed");
    } else {
      // Optionally redirect or show success
    
    }
  };

  // TypeScript workaround for lovable-techy-ui FormField
  type ControllerPropsAny = import("react-hook-form").ControllerProps<any, any>;
  const TypedFormField = RawFormField as React.FC<ControllerPropsAny>;

  return (
    <AuthLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-border shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-neutral mb-2">
                Create Your Techy Account
              </h1>
              <p className="text-neutral-muted">
                Join our community of tech enthusiasts
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <TypedFormField
                  control={form.control}
                  name="fullName"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <TypedFormField
                  control={form.control}
                  name="email"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
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
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <TypedFormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <div className="text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}
                <TechyButton type="submit" className="w-full">
                  Sign Up
                </TechyButton>
              </form>
            </Form>
            <div className="text-center mt-6">
              <span className="text-neutral-muted">
                Already have an account?{" "}
              </span>
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
