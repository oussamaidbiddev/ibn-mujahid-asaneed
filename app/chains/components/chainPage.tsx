"use client";
import { createClient } from "@/utils/supabase/client";
import { Button, Container, Group, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { groupBy } from "lodash";
import { useCallback, useEffect } from "react";
import { Chain, Recitor, Transmitter } from "../page";
import ChainForms from "./chainForms";

type Props = {
  chains: Chain[];
  recitors: Recitor[];
  transmitters: Transmitter[];
};
export default function ChainPage(props: Props) {
  const { chains, recitors, transmitters } = props;
  return (
    <Container>
      <ChainForms
        chains={chains}
        transmitters={transmitters}
        recitors={recitors}
      />
    </Container>
  );
}
