import * as React from 'react';
import { TextInput } from 'react-native'; // Import TextInput from React Native
import { cn } from '~/lib/utils'; // Utility for handling conditional class names

// Input component with forwardRef for handling ref and props forwarding
const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, placeholderClassName, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2', // Default styles for both web and native
        'text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground', // Text and font size variations for different platforms
        'placeholder:text-muted-foreground web:ring-offset-background web:focus-visible:outline-none', // Styling for placeholder and focus state
        props.editable === false && 'opacity-50 web:cursor-not-allowed', // Handle disabled input state
        className // Apply additional className if provided
      )}
      placeholderClassName={cn('text-muted-foreground', placeholderClassName)} // Conditional class for placeholder
      {...props} // Spread remaining props
    />
  );
});

Input.displayName = 'Input'; // Set display name for easier debugging

export { Input };
