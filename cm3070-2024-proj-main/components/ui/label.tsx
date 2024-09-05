import * as LabelPrimitive from '@rn-primitives/label'; // Import label primitives for cross-platform support
import * as React from 'react';
import { cn } from '~/lib/utils'; // Utility function for handling class names

// Label component using forwardRef for better ref management and props forwarding
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Text>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Text>
>(({ className, onPress, onLongPress, onPressIn, onPressOut, ...props }, ref) => (
  <LabelPrimitive.Root
    className='web:cursor-default' // Default cursor style for web
    onPress={onPress} // Handling touch interactions
    onLongPress={onLongPress}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
  >
    {/* Text element inside the label with forwarded ref */}
    <LabelPrimitive.Text
      ref={ref}
      className={cn(
        'text-sm text-foreground native:text-base font-medium leading-none', // Default label styling
        'web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70', // Disabled state styling for web
        className // Additional className if passed
      )}
      {...props} // Spread additional props
    />
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName; // Set display name for debugging

export { Label };
