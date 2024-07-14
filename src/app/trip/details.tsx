import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Modal } from "@/components/modal";
import { linksServer } from "@/server/links-server";
import { colors } from "@/styles/colors";
import { validateInput } from "@/utils/validateInput";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { Text, View } from "react-native";

import { TripLink, TripLinkProps } from "@/components/tripLink";

export function Details({ tripId }: { tripId: string }) {
  // MODAL
  const [showNewLinkModal, setShowNewLinkModal] = useState(false);

  // DATA
  const [linkName, setLinkName] = useState("");
  const [linkURL, setLinkURL] = useState("");

  // LISTS
  const [links, setLinks] = useState<TripLinkProps[]>([]);

  // LOADING
  const [isCreatingLinkTrip, setIsCreatingLinkTrip] = useState(false);

  function resetNewLinkFields() {
    setLinkName("");
    setLinkURL("");
    setShowNewLinkModal(false);
  }

  async function handleCreateNewTrip() {
    try {
      if (!linkName.trim()) {
        return Alert.alert("Link", "Informe o título do link");
      }

      if (!validateInput.url(linkURL.trim())) {
        return Alert.alert("Link", "Link inválido");
      }

      setIsCreatingLinkTrip(true);

      await linksServer.create({
        tripId,
        title: linkName,
        url: linkURL,
      });

      Alert.alert("Link", "Link criado com sucesso!");

      resetNewLinkFields();
      await getTripLinks();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingLinkTrip(false);
    }
  }

  async function getTripLinks() {
    try {
      const links = await linksServer.getLinksByTripId(tripId);
      setLinks(links);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getTripLinks();
  }, []);

  return (
    <View className="flex-1 mt-10">
      <Text className="text-zinc-50 text-2xl font-semibold mb-2">
        Links importantes
      </Text>

      <View className="flex-1 mt-10">
        {links.length > 0 ? (
          <FlatList
            data={links}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripLink data={item} />}
            contentContainerClassName="gap-4"
          />
        ) : (
          <Text className="text-zinc-400 font-regular text-base mt-2 mb-6">
            Nenhum link adicionado.
          </Text>
        )}

        <Button variant="secondary" onPress={() => setShowNewLinkModal(true)}>
          <Plus color={colors.zinc[200]} size={20} />
          <Button.Title>Cadastrar novo link</Button.Title>
        </Button>
      </View>

      <View className="flex-1 border-t border-zinc-800 mt-6">
        <Text className="text-zinc-50 text-2xl font-semibold my-6">
          Convidados
        </Text>
      </View>

      <Modal
        title="Cadastrar link"
        subtitle="Todos os convidados podem visualizar os links importantes"
        visible={showNewLinkModal}
        onClose={() => setShowNewLinkModal(false)}
      >
        <View className="gap-2 mb-3">
          <Input variant="secondary">
            <Input.Field
              placeholder="Título do link"
              onChangeText={setLinkName}
            ></Input.Field>
          </Input>

          <Input variant="secondary">
            <Input.Field
              placeholder="URL"
              onChangeText={setLinkURL}
            ></Input.Field>
          </Input>
        </View>

        <Button isLoading={isCreatingLinkTrip} onPress={handleCreateNewTrip}>
          <Button.Title>Salvar link</Button.Title>
        </Button>
      </Modal>
    </View>
  );
}
