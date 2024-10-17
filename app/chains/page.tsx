import { createClient } from "@/utils/supabase/server";
import ChainPage from "./components/chainPage";

export type Chain = {
  id: number;
  recitor_id: {
    id: number;
    name: string;
  };
  head_recitor_id: number;
  transmitter_id: number;
  isnad_group: string;
  chain_order: number;
};

export type NewChain = Omit<
  Chain,
  "id" | "recitor_id" | "head_recitor_id" | "transmitter_id"
> & {
  id: number | null;
  recitor_id: {
    id: number | null;
    name: string | null;
  } | null;
  head_recitor_id: number | null;
  transmitter_id: number | null;
};

export type Recitor = {
  id: number;
  name: string;
  head_recitor: boolean;
};

export type Transmitter = {
  id: number;
  name: string;
};

export default async function Page() {
  const supabase = createClient();
  const chainRes = await supabase
    .from("chain")
    .select(
      "id, transmitter_id, head_recitor_id, recitor_id (id, name), isnad_group, chain_order",
    );

  const recitorRes = await supabase.from("recitor").select();
  const transmitterRes = await supabase.from("transmitter").select();

  const recitorData: Recitor[] | null = recitorRes.data;
  const chainData: Chain[] | null = chainRes.data as Chain[] | null;
  const transmitterData: Transmitter[] | null = transmitterRes.data;

  if (recitorData === null || chainData === null || transmitterData === null)
    return null;

  return (
    <ChainPage
      chains={chainData}
      recitors={recitorData}
      transmitters={transmitterData}
    />
  );
}
