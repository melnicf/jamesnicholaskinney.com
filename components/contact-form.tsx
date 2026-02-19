"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setStatus("idle");
    try {
      // TODO: Wire to Formspree, Resend, or custom API
      console.log("Contact form submitted:", values);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 text-neutral-300">
        Thank you. Your message has been received. We&apos;ll get back to you
        soon.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-300">Name</FormLabel>
              <FormControl>
                <Input
                  className="border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-500"
                  placeholder="Your name"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-300">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-500"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-300">Subject</FormLabel>
              <FormControl>
                <Input
                  className="border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-500"
                  placeholder="What is this regarding?"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-300">Message</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[120px] border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-500"
                  placeholder="Your message..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        {status === "error" && (
          <p className="text-sm text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send message"}
        </Button>
      </form>
    </Form>
  );
}
