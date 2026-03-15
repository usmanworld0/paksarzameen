import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-sm bg-[linear-gradient(90deg,#efe4da_25%,#f7efe8_50%,#efe4da_75%)] bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
