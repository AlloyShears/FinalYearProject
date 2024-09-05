import * as React from 'react';
import { Platform, StyleSheet } from 'react-native'; // Platform detection and StyleSheet for styling
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'; // Animated transitions for smooth tooltip appearance
import { TextClassContext } from '~/components/ui/text'; // Context to manage text styling across the app
import * as TooltipPrimitive from '@rn-primitives/tooltip'; // Tooltip primitives for cross-platform support
import { cn } from '~/lib/utils'; // Utility function for handling conditional class names

// Root Tooltip component, the base of the tooltip
const Tooltip = TooltipPrimitive.Root;

// Trigger component for displaying the tooltip on interaction
const TooltipTrigger = TooltipPrimitive.Trigger;

// Tooltip content that will be shown when the trigger is interacted with, using forwardRef for ref handling
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { portalHost?: string } // Extend props with optional portalHost for tooltip positioning
>(({ className, sideOffset = 4, portalHost, ...props }, ref) => (
  // Use portal to render the tooltip outside the usual DOM hierarchy
  <TooltipPrimitive.Portal hostName={portalHost}>
    <TooltipPrimitive.Overlay
      style={Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined} // Full-screen overlay for non-web platforms
    >
      <Animated.View
        entering={Platform.select({ web: undefined, default: FadeIn })} // Fade in animation for non-web platforms
        exiting={Platform.select({ web: undefined, default: FadeOut })} // Fade out animation for non-web platforms
      >
        {/* Provide a specific text class for styling the content within the tooltip */}
        <TextClassContext.Provider value='text-sm native:text-base text-popover-foreground'>
          <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset} // Space between the trigger and tooltip content
            className={cn(
              'z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5', // Tooltip container styling
              'shadow-md shadow-foreground/5 web:animate-in web:fade-in-0 web:zoom-in-95', // Shadow and animation for web
              'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2', // Animation based on tooltip position
              className // Allow additional classes to be passed in
            )}
            {...props} // Spread any additional props to the content
          />
        </TextClassContext.Provider>
      </Animated.View>
    </TooltipPrimitive.Overlay>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName; // Set display name for easier debugging

// Export Tooltip components for use in the rest of the app
export { Tooltip, TooltipContent, TooltipTrigger };
