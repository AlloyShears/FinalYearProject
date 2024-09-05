import * as React from 'react';
import { Text, View } from 'react-native'; // Text and View components for layout and text rendering
import { TextClassContext } from '~/components/ui/text'; // Context to handle text class styles
import type { TextRef, ViewRef } from '@rn-primitives/types'; // Type references for Text and View components
import { cn } from '~/lib/utils'; // Utility function for conditional class names

// Card component with forwardRef to allow external ref handling, using View as the base component
const Card = React.forwardRef<ViewRef, React.ComponentPropsWithoutRef<typeof View>>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        'rounded-lg border border-border bg-card shadow-sm shadow-foreground/10', // Default styling for the card
        className // Allows additional className to be passed in
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card'; // Set display name for debugging

// CardHeader component for the header section of the card
const CardHeader = React.forwardRef<ViewRef, React.ComponentPropsWithoutRef<typeof View>>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

// CardTitle component for the card's title, using Text for text rendering
const CardTitle = React.forwardRef<TextRef, React.ComponentPropsWithoutRef<typeof Text>>(
  ({ className, ...props }, ref) => (
    <Text
      role='heading' // ARIA role for accessibility
      aria-level={3} // Specifies the heading level for screen readers
      ref={ref}
      className={cn(
        'text-2xl text-card-foreground font-semibold leading-none tracking-tight', // Default styling for the title
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

// CardDescription component for providing additional descriptive text
const CardDescription = React.forwardRef<TextRef, React.ComponentPropsWithoutRef<typeof Text>>(
  ({ className, ...props }, ref) => (
    <Text ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

// CardContent component for the main content area of the card
const CardContent = React.forwardRef<ViewRef, React.ComponentPropsWithoutRef<typeof View>>(
  ({ className, ...props }, ref) => (
    <TextClassContext.Provider value='text-card-foreground'>
      <View ref={ref} className={cn('p-6 pt-0', className)} {...props} />
    </TextClassContext.Provider>
  )
);
CardContent.displayName = 'CardContent';

// CardFooter component for the footer section of the card
const CardFooter = React.forwardRef<ViewRef, React.ComponentPropsWithoutRef<typeof View>>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn('flex flex-row items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

// Exporting all the card-related components
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
