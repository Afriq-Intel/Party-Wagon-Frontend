"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

type WorkspaceShellProps = {
  workspaceLabel: string;
  title: string;
  description: string;
};

export function WorkspaceShell({
  workspaceLabel,
  title,
  description,
}: WorkspaceShellProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const displayName =
    user?.profile?.preferred_name ||
    [user?.profile?.first_name, user?.profile?.last_name]
      .filter(Boolean)
      .join(" ") ||
    user?.email ||
    "Signed in";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src="/assets/brand/logo-lilac.svg"
            alt="Party Wagon"
            width={140}
            height={40}
            className="h-9 w-auto"
          />
          <div>
            <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-radiant-rose">
              {workspaceLabel}
            </p>
            <h1 className="font-oswald text-2xl font-bold uppercase tracking-wide text-midnight-party sm:text-3xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-outfit text-sm font-medium text-midnight-party">
              {displayName}
            </p>
            <p className="font-outfit text-xs text-midnight-party/55">
              {user?.role}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              void logout().then(() => {
                router.replace("/account");
              });
            }}
            className="rounded-full border border-midnight-party/15 bg-white px-4 py-2 font-outfit text-xs font-semibold uppercase tracking-wide text-midnight-party transition hover:border-radiant-rose hover:text-radiant-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_32px_rgba(51,16,56,0.06)] sm:p-8">
        <h2 className="font-oswald text-xl font-semibold uppercase tracking-wide text-midnight-party">
          You&apos;re signed in
        </h2>
        <p className="mt-2 max-w-2xl font-outfit text-sm leading-relaxed text-midnight-party/70">
          {description}
        </p>
      </section>
    </main>
  );
}
