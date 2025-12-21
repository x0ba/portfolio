import { Icon } from "@iconify/react";
import type { SanityStackItem } from "@/lib/sanity";

interface StackProps {
  items: SanityStackItem[];
}

export default function Stack({ items }: StackProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="font-serif font-semibold text-2xl sm:text-3xl">
        My Stack
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-2 py-1 px-2 rounded-lg bg-card border border-border text-foreground"
          >
            {item.iconName && (
              <Icon icon={item.iconName} width={20} height={20} />
            )}
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
