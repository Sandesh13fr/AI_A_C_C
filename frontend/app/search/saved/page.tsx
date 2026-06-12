import { redirect } from "next/navigation";

export default function SearchSavedRedirect() {
  redirect("/documents?tab=saved");
}
