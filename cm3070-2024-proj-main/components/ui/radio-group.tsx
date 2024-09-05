import * as React from 'react';
import { View } from 'react-native'; // Import View for layout
import * as RadioGroupPrimitive from '@rn-primitives/radio-group'; // Import radio group primitives for cross-platform support
import { cn } from '~/lib/utils'; // Utility function for conditional class names

// RadioGroup component using forwardRef for ref forwarding and class name handling
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('web:grid gap-2', className)} // Apply default and conditional styles
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName; // Set display name for easier debugging

// RadioGroupItem component for individual radio items, also uses forwardRef
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 native:h-5 native:w-5 rounded-full justify-center items-center', // Default size and shape
        'border border-primary text-primary', // Styling for the radio button's border and color
        'web:ring-offset-background web:focus:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring', // Focus and ring styles for web
        props.disabled && 'web:cursor-not-allowed opacity-50', // Disabled state styling
        className
      )}
      {...props}
    >
      {/* Indicator inside the radio button */}
      <RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
        <View className='aspect-square h-[9px] w-[9px] native:h-[10] native:w-[10] bg-primary rounded-full' /> {/* Inner dot */}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName; // Set display name for debugging

export { RadioGroup, RadioGroupItem }; // Export components for external use
