import { RiNextjsFill } from "react-icons/ri";
import { SiAstro } from "react-icons/si";
import { SiReact } from "react-icons/si";
import { SiShadcnui } from "react-icons/si";
import { SiTrpc } from "react-icons/si";
import { SiPostgresql } from "react-icons/si";
import { SiSupabase } from "react-icons/si";
import { SiDrizzle } from "react-icons/si";
import { SiTypescript } from "react-icons/si";

const stack = [
  {
    name: "Next.js",
    icon: RiNextjsFill,
  },
  {
    name: "Astro",
    icon: SiAstro,
  },
  {
    name: "React",
    icon: SiReact,
  },
  {
    name: "Shadcn UI",
    icon: SiShadcnui,
  },
  {
    name: "tRPC",
    icon: SiTrpc,
  },
  {
    name: "PostgreSQL",
    icon: SiPostgresql,
  },
  {
    name: "Supabase",
    icon: SiSupabase,
  },
  {
    name: "Drizzle",
    icon: SiDrizzle,
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
  },
];

export default function Stack() {
  return (
    <div className="flex flex-col gap-4">
      <div className="font-serif font-semibold text-2xl sm:text-3xl">
        My Stack
      </div>
      <div className="flex flex-wrap gap-2">
        {stack.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2 py-1 px-2 rounded-lg bg-card border border-border fg-foreground"
          >
            <item.icon />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
