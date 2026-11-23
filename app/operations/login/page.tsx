import { redirect } from "next/navigation";

/** Shared login lives at /account (Account nav link). */
export default function OperationsLoginRedirectPage() {
  redirect("/account");
}
