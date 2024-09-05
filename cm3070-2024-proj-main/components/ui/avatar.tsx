import * as React from 'react';
import * as AvatarPrimitive from '@rn-primitives/avatar'; // Import avatar primitives
import { cn } from '~/lib/utils'; // Utility function for conditional class names

// Destructure avatar primitive components for ease of use
const AvatarPrimitiveRoot = AvatarPrimitive.Root;
const AvatarPrimitiveImage = AvatarPrimitive.Image;
const AvatarPrimitiveFallback = AvatarPrimitive.Fallback;

// Avatar component with forwardRef for easier access to ref and props spread
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitiveRoot>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitiveRoot>
>(({ className, ...props }, ref) => (
  <AvatarPrimitiveRoot
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} // Styling for the avatar container
    {...props}
  />
));
Avatar.displayName = AvatarPrimitiveRoot.displayName;

// AvatarImage component to display the avatar's image
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitiveImage>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitiveImage>
>(({ className, ...props }, ref) => (
  <AvatarPrimitiveImage
    ref={ref}
    className={cn('aspect-square h-full w-full', className)} // Ensures the image is square and fills the avatar space
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitiveImage.displayName;

// AvatarFallback component for when the image is unavailable
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitiveFallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitiveFallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitiveFallback
    ref={ref}
    className={cn(
      'flex h-full w-full
