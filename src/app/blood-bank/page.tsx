import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function BloodBankPage() {
  redirect("/healthcare/blood-bank");
}
