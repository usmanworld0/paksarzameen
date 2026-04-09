import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-[linear-gradient(90deg,#f3f3f3_25%,#fbfbfb_50%,#f3f3f3_75%)] bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
