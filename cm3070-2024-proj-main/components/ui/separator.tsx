import * as React from 'react';
import * as SeparatorPrimitive from '@rn-primitives/separator'; // Import separator primitive for cross-platform use
import { cn } from '~/lib/utils'; // Utility for handling conditional class names

// Separator component using forwardRef for ref forwarding and props handling
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative} // Defines whether the separator is purely decorative
    orientation={orientation} // Sets orientation (horizontal/vertical)
    className={cn(
      'shrink-0 bg-border', // Base styling for the separator
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]', // Conditional styling based on orientation
      className // Additional className if passed
    )}
    {...props} // Spread additional props
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName; // Set display name for easier debugging

export { Separator };
