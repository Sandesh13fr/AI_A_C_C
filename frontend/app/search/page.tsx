import { redirect } from "next/navigation";

export default function SearchIndexRedirect() {
  redirect("/documents?tab=search");
}
