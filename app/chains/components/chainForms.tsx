import {
  Accordion,
  Button,
  Group,
  Paper,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { Chain, NewChain, Recitor, Transmitter } from "../page";
import { useChainForm, useChainForms } from "../hooks/useChainForms";

type Props = {
  chains: Chain[] | NewChain[];
  recitors: Recitor[];
  transmitters: Transmitter[];
};

function ChainForm(props: Props) {
  const { chains, transmitters, recitors } = props;
  const { saveChain, form, allHeadRecitors, allTransmitters, allRecitors } =
    useChainForms(chains, transmitters, recitors);

  return (
    <Stack>
      <Select
        data={allTransmitters}
        {...form.getInputProps("transmitter_id")}
      />
      <Select
        data={allHeadRecitors}
        {...form.getInputProps("head_recitor_id")}
      />
      <TextInput {...form.getInputProps("isnad_group")} />
      {form.values.recitor_ids.map((recitorObj, key) => (
        <Group key={`key-${key}`}>
          <Select
            label="recitor"
            placeholder="Pick recitor"
            data={allRecitors}
            searchable
            onChange={(value) => {
              form.setFieldValue(`recitor_ids.${key}`, {
                recitor_id: value,
                chain_id: recitorObj.chain_id ?? null,
              });
            }}
            value={form.values.recitor_ids[key].recitor_id}
          />
          {form.values.recitor_ids.length > 1 && (
            <Button
              onClick={() => {
                form.removeListItem("recitor_ids", key);
              }}
            >
              Delete
            </Button>
          )}
        </Group>
      ))}
      <Button
        onClick={() => {
          form.setFieldValue("recitor_ids", (prevValues) => [
            ...prevValues,
            {
              chain_id: null,
              recitor_id: null,
            },
          ]);
        }}
      >
        Add
      </Button>

      <Button onClick={saveChain}>Save</Button>
    </Stack>
  );
}
export default function ChainForms(props: Props) {
  const { chains, recitors, transmitters } = props;
  const { groupedChains, addChain } = useChainForm(chains);

  return (
    <>
      <Accordion>
        {Object.entries(groupedChains).map(([key, chainGroup]) => {
          const chainText = chainGroup.reduce(
            (prev, curr, index) =>
              `${prev} ${index !== 0 ? `=>` : ``} ${curr.recitor_id?.name ?? ""}`,
            "",
          );

          return (
            <Accordion.Item key={key} value={key}>
              <Accordion.Control>
                {chainText.trim().length ? chainText : "New Chain"}
              </Accordion.Control>
              <Accordion.Panel>
                <ChainForm
                  chains={chainGroup}
                  recitors={recitors}
                  transmitters={transmitters}
                />
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
      <Button onClick={addChain}>Add Chain</Button>
    </>
  );
}
