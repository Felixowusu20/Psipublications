import { PSILoader } from "@/components/nahda-loader";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a0f14]">
      <PSILoader variant="dark" label="Loading admin…" />
    </div>
  );
}
