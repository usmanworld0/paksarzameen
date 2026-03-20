import { permanentRedirect } from "next/navigation";

export default function VolunteerRedirectPage() {
  permanentRedirect("/get-involved");
}
