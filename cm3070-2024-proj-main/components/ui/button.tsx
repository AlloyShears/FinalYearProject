import { cva, type VariantProps } from 'class-variance-authority'; // Utility for defining variant-based classNames
import * as React from 'react';
import { Pressable } from 'react-native'; // Pressable component for handling touch interactions
import { TextClassContext } from '~/components/ui/text'; // Context for text styles
import { cn } from '~/lib/utils'; // Utility function for conditional class names

// Define button variants and sizes using `cva` for both web and native platforms
const buttonVariants = cva(
  'group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary web:hover:opacity-90 active:opacity-90',
        destructive: 'bg-destructive web:hover:opacity-90 active:opacity-90',
        outline: 'border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        secondary: 'bg-secondary web:hover:opacity-80 active:opacity-80',
        ghost: 'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        link: 'web:underline-offset-4 web:hover:underline web:focus:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 native:h-12 native:px-5 native:py-3',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8 native:h-14',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Define text variants for the button
const buttonTextVariants = cva(
  'web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'group-active:text-accent-foreground',
        secondary: 'text-secondary-foreground group-active:text-secondary-foreground',
        ghost: 'group-active:text-accent-foreground',
        link: 'text-primary group-active:underline',
      },
      size: {
        default: '',
        sm: '',
        lg: 'native:text-lg',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Define button props using `VariantProps` to handle variant and size
type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

// Button component with forwardRef for accessibility and better reference handling
const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <TextClassContext.Provider
        value={cn(
          props.disabled && 'web:pointer-events-none', // Handle disabled state
          buttonTextVariants({ variant, size }) // Apply text variants based on props
        )}
      >
        <Pressable
          className={cn(
            props.disabled && 'opacity-50 web:pointer-events-none', // Disable interaction and change opacity when disabled
            buttonVariants({ variant, size, className }) // Apply button variants based on props
          )}
          ref={ref}
          role='button'
          {...props}
        />
      </TextClassContext.Provider>
    );
  }
);
Button.displayName = 'Button'; // Display name for easier debugging

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
