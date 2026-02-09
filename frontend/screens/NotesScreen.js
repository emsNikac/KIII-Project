import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, Platform } from "react-native";
import { api } from "../api";

export default function NotesScreen({ route, navigation }) {
  const { folderId, folderName } = route.params;

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    navigation.setOptions({ title: folderName });
  }, [folderName, navigation]);

  async function loadNotes() {
    const res = await api.get(`/folders/${folderId}/notes`);
    setNotes(res.data);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function addNote() {
    const t = title.trim();
    if (!t) return;

    await api.post(`/folders/${folderId}/notes`, {
      title: t,
      content: content.trim(),
    });

    setTitle("");
    setContent("");
    loadNotes();
  }

  async function deleteNote(id) {
    const confirmed =
      Platform.OS === "web"
        ? window.confirm("Delete this note?")
        : await new Promise((resolve) =>
          Alert.alert(
            "Delete note?",
            "",
            [
              { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
              { text: "Delete", onPress: () => resolve(true), style: "destructive" },
            ]
          )
        );

    if (!confirmed) return;

    await api.delete(`/notes/${id}`);
    loadNotes();
  }



    function openEdit(note) {
      setEditing(note);
      setEditTitle(note.title);
      setEditContent(note.content);
    }

    async function saveEdit() {
      if (!editing) return;
      await api.put(`/notes/${editing.id}`, {
        title: editTitle,
        content: editContent,
      });
      setEditing(null);
      loadNotes();
    }

    return (
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>Notes</Text>

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }}
        />

        <TextInput
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 8,
            minHeight: 80,
            textAlignVertical: "top",
          }}
        />

        <TouchableOpacity
          onPress={addNote}
          style={{
            backgroundColor: "black",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "800" }}>Add Note</Text>
        </TouchableOpacity>

        <FlatList
          data={notes}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <View style={{ padding: 14, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, backgroundColor: "white", gap: 6 }}>
              <Text style={{ fontSize: 16, fontWeight: "800" }}>{item.title}</Text>
              <Text>{item.content}</Text>

              <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                <TouchableOpacity onPress={() => openEdit(item)}>
                  <Text style={{ fontWeight: "800" }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteNote(item.id)}>
                  <Text style={{ color: "red", fontWeight: "800" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <Modal visible={!!editing} animationType="fade" transparent>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", padding: 16 }}>
            <View style={{ backgroundColor: "white", borderRadius: 12, padding: 16, gap: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "900" }}>Edit Note</Text>

              <TextInput
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Title"
                style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }}
              />

              <TextInput
                value={editContent}
                onChangeText={setEditContent}
                placeholder="Content"
                multiline
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 10,
                  borderRadius: 8,
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
              />

              <View style={{ flexDirection: "row", gap: 12, justifyContent: "flex-end" }}>
                <TouchableOpacity onPress={() => setEditing(null)}>
                  <Text style={{ fontWeight: "800" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveEdit}>
                  <Text style={{ fontWeight: "900" }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
