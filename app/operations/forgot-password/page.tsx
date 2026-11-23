import { redirect } from "next/navigation";

export default function OperationsForgotPasswordRedirectPage() {
  redirect("/account/forgot-password");
}
