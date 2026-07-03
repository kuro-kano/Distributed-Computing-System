import ServerBanner from "@/components/ServerBanner";
import Board from "@/components/Board";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServerBanner />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Board />
      </div>
    </main>
  );
}
