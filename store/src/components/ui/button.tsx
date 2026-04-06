import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full border text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7a47]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-[#0f7a47] bg-[#0f7a47] text-white hover:border-[#081c10] hover:bg-[#081c10] shadow-[0_8px_20px_rgba(15,122,71,0.14)]",
        primary:
          "border-[#0f7a47] bg-[#0f7a47] text-white hover:border-[#081c10] hover:bg-[#081c10] shadow-[0_8px_20px_rgba(15,122,71,0.14)]",
        gold: "border-[#d7c8bc] bg-[#e8ddd4] text-[#1f1f1f] hover:bg-[#dfd2c7] hover:border-[#dfd2c7] shadow-[0_8px_20px_rgba(15,122,71,0.08)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-[#e5d8cf] bg-white text-[#1f1f1f] hover:border-[#0f7a47] hover:bg-[#fffaf5]",
        secondary:
          "border-[#e5d8cf] bg-white text-[#1f1f1f] hover:border-[#0f7a47] hover:bg-[#fffaf5]",
        ghost: "border-transparent bg-transparent text-[#1f1f1f] hover:bg-[#faf6f1] hover:text-[#0f7a47]",
        link: "border-transparent text-[#0f7a47] underline-offset-4 hover:text-[#081c10] hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-full px-4",
        lg: "h-12 rounded-full px-8 text-base",
        xl: "h-14 rounded-full px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
