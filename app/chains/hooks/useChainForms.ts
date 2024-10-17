import { groupBy } from "lodash";
import { Chain, NewChain, Recitor, Transmitter } from "../page";
import { createClient } from "@/utils/supabase/client";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback, useMemo, useState } from "react";
import z from "zod";

const chainFormSchema = z.object({
  transmitter_id: z.string().optional(),
  head_recitor_id: z.string().optional(),
  recitor_ids: z.object({
    recitor_id: z.union([z.string(), z.null()]),
    chain_id: z.union([z.number(), z.null()]),
  }),
  isnad_group: z.string(),
});

export function useChainForms(
  chains: Chain[] | NewChain[],
  transmitters: Transmitter[],
  recitors: Recitor[],
) {
  const supabase = createClient();

  const { transmitter_id, head_recitor_id, isnad_group } = chains[0];

  const form = useForm({
    initialValues: {
      transmitter_id: transmitter_id?.toString() ?? null,
      head_recitor_id: head_recitor_id?.toString() ?? null,
      recitor_ids:
        chains.map((chain) => ({
          recitor_id: chain.recitor_id?.id?.toString() as string | null,
          chain_id: chain.id as number | null,
        })) ?? [],
      isnad_group: isnad_group ?? "",
    },
    validate: zodResolver(chainFormSchema),
  });

  const saveChain = async () => {
    const chains = form.values.recitor_ids.map((recitorObj, index) => ({
      id: recitorObj.chain_id,
      transmitter_id: parseInt(form.values.transmitter_id ?? "", 10),
      head_recitor_id: parseInt(form.values.head_recitor_id ?? "", 10),
      chain_order: index + 1,
      recitor_id: parseInt(recitorObj.recitor_id ?? "", 10),
      isnad_group: form.values.isnad_group,
      ...(!!recitorObj.chain_id ? { id: recitorObj.chain_id } : undefined),
    }));

    for (const chain of chains) {
      if (chain.id !== undefined) {
        await supabase.from("chain").update(chain).eq("id", chain.id);
        continue;
      }
      await supabase.from("chain").insert(chain);
    }
  };

  const allTransmitters = useMemo(
    () =>
      transmitters.map((transmitter) => ({
        value: transmitter.id.toString(),
        label: transmitter.name,
      })),
    [],
  );

  const allHeadRecitors = useMemo(
    () =>
      recitors
        .filter((recitor) => recitor.head_recitor)
        .map((recitor) => ({
          value: recitor.id.toString(),
          label: recitor.name,
        })),
    [],
  );

  const allRecitors = useMemo(
    () =>
      recitors.map((recitor) => ({
        value: recitor.id.toString(),
        label: recitor.name,
      })),
    [],
  );

  return {
    form,
    saveChain,
    allHeadRecitors,
    allTransmitters,
    allRecitors,
  };
}

export function useChainForm(chains: NewChain[] | Chain[]) {
  const [groupedChains, setGroupedChains] = useState(
    groupBy(chains, "isnad_group"),
  );

  const addChain = useCallback(() => {
    setGroupedChains((prevState) => ({
      ...prevState,
      ["new_chain"]: [
        {
          id: null,
          transmitter_id: null,
          head_recitor_id: null,
          recitor_id: null,
          isnad_group: "New Chain",
          chain_order: 1,
        },
      ],
    }));
  }, []);

  return { groupedChains, addChain };
}
