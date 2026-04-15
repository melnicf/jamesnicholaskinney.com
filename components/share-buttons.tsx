"use client";

import { useState } from "react";
import { Linkedin, Twitter, Facebook, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const SHARE_CHANNELS = [
  {
    label: "LinkedIn",
    icon: Linkedin,
    getUrl: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    label: "X",
    icon: Twitter,
    getUrl: (url: string, title: string) =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    label: "Facebook",
    icon: Facebook,
    getUrl: (url: string, title: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
] as const;

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div className="flex items-center gap-1">
      <span className="mr-1 text-xs font-medium uppercase tracking-wider text-neutral-500">
        Share
      </span>
      {SHARE_CHANNELS.map((channel) => (
        <Tooltip key={channel.label}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              asChild
            >
              <a
                href={channel.getUrl(url, title)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${channel.label}`}
              >
                <channel.icon className="size-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="border-neutral-700 bg-neutral-800 text-neutral-200">
            {channel.label}
          </TooltipContent>
        </Tooltip>
      ))}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            onClick={copyLink}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="size-4 text-green-400" />
            ) : (
              <Link2 className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="border-neutral-700 bg-neutral-800 text-neutral-200">
          {copied ? "Copied!" : "Copy link"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
