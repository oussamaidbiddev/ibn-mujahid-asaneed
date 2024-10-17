import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
const DEFAULT_ROUTE = "/chains";

export default function Index() {
  redirect(DEFAULT_ROUTE);
}
