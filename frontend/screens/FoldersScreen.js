import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Platform } from "react-native";
import { api } from "../api";

export default function FoldersScreen({ navigation }) {
  const [folders, setFolders] = useState([]);
  const [name, setName] = useState("");

  async function loadFolders() {
    const res = await api.get("/folders");
    setFolders(res.data);
  }

  useEffect(() => {
    const unsub = navigation.addListener("focus", loadFolders);
    loadFolders();
    return unsub;
  }, [navigation]);

  async function addFolder() {
    const folderName = name.trim();
    if (!folderName) return;

    await api.post("/folders", { name: folderName });
    setName("");
    loadFolders();
  }

  async function deleteFolder(id) {
  const confirmed =
    Platform.OS === "web"
      ? window.confirm("Delete folder? All notes inside will be deleted.")
      : await new Promise((resolve) =>
          Alert.alert(
            "Delete folder?",
            "All notes inside will be deleted.",
            [
              { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
              { text: "Delete", onPress: () => resolve(true), style: "destructive" },
            ]
          )
        );

  if (!confirmed) return;

  await api.delete(`/folders/${id}`);
  loadFolders();
}

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "800" }}>Folders</Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          placeholder="New folder name"
          value={name}
          onChangeText={setName}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 8,
          }}
        />
        <TouchableOpacity
          onPress={addFolder}
          style={{
            backgroundColor: "black",
            paddingHorizontal: 14,
            justifyContent: "center",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "800" }}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={folders}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 14,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Notes", {
                  folderId: item.id,
                  folderName: item.name,
                })
              }
              style={{ flex: 1 }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700" }}>
                {item.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteFolder(item.id)}>
              <Text style={{ color: "red", fontWeight: "800" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}