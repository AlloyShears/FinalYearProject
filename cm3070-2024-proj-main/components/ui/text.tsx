import * as Slot from '@rn-primitives/slot'; // Import slot primitives for cross-platform text slots
import type { SlottableTextProps, TextRef } from '@rn-primitives/types'; // Types for text and slots
import * as React from 'react';
import { Text as RNText } from 'react-native'; // Import native Text component
import { cn } from '~/lib/utils'; // Utility function for handling class names

// Create a context to allow text styling to be shared across components
const TextClassContext = React.createContext<string | undefined>(undefined);

// Text component that optionally uses Slot.Text or native Text based on `asChild` prop
const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext); // Use shared text class from context
    const Component = asChild ? Slot.Text : RNText; // Use Slot.Text when `asChild` is true, otherwise use RNText

    return (
      <Component
        className={cn('text-base text-foreground web:select-text', textClass, className)} // Apply default styles and className from context
        ref={ref}
        {...props} // Spread additional props to the component
      />
    );
  }
);

Text.displayName = 'Text'; // Set display name for easier debugging

export { Text, TextClassContext };
