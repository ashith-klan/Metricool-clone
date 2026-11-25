'use client';

import React from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaThreads,
  FaTwitter,
} from 'react-icons/fa6';
import { SocialPlatform } from '@/lib/analytics-data';
import { cn } from '@/lib/utils';

interface SocialPlatformLogoProps {
  platform: SocialPlatform;
  className?: string;
}

const BRAND_COLOR_CLASSES: Record<SocialPlatform, string> = {
  instagram: 'text-[#E4405F]',
  facebook: 'text-[#1877F2]',
  linkedin: 'text-[#0A66C2]',
  twitter: 'text-[#1DA1F2]',
  threads: 'text-slate-900',
};

export default function SocialPlatformLogo({
  platform,
  className,
}: SocialPlatformLogoProps) {
  const colorClass = BRAND_COLOR_CLASSES[platform];

  switch (platform) {
    case 'instagram':
      return (
        <FaInstagram
          className={cn(colorClass, 'shrink-0', className)}
          aria-hidden="true"
        />
      );
    case 'facebook':
      return (
        <FaFacebook
          className={cn(colorClass, 'shrink-0', className)}
          aria-hidden="true"
        />
      );
    case 'linkedin':
      return (
        <FaLinkedin
          className={cn(colorClass, 'shrink-0', className)}
          aria-hidden="true"
        />
      );
    case 'twitter':
      return (
        <FaTwitter
          className={cn(colorClass, 'shrink-0', className)}
          aria-hidden="true"
        />
      );
    case 'threads':
      return (
        <FaThreads
          className={cn(colorClass, 'shrink-0', className)}
          aria-hidden="true"
        />
      );
  }
}
