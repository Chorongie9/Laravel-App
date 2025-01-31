import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../api";

const EditAd: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchAdDetails();
    }
  }, [id]);

  const fetchAdDetails = async () => {
    try {
      const res = await api.get(`/ads/${id}`);
      const { title, description, image } = res.data;
      setTitle(title || "");
      setDescription(description || "");
      setImage(image || null);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch ad details. Please try again.");
      console.error("Error fetching ad details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Title and description are required.");
      return;
    }

    try {
      setSaving(true);

      const res = await api.put(
        `/ads/${id}`,
        { title, description },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        Alert.alert("Success", "Ad updated successfully!");
        router.back();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update the ad. Please try again.");
      console.error("Error updating ad:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold mb-5">Edit Ad</Text>

      <View className="mb-4">
        <Text className="text-lg mb-2">Title:</Text>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2 text-lg bg-gray-100"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          placeholderTextColor="#888"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg mb-2">Description:</Text>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2 text-lg bg-gray-100 h-24"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          placeholderTextColor="#888"
          multiline
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg mb-2">Image:</Text>
        {image ? (
          <Image
            source={{ uri: `http://10.0.2.2:8000/storage/${image}` }}
            className="w-full h-60 mt-4 rounded-md"
          />
        ) : (
          <Text className="text-gray-500">No image available</Text>
        )}
      </View>

      <TouchableOpacity
        className={`w-full py-3 rounded-md ${
          saving ? "bg-blue-300" : "bg-blue-500"
        }`}
        onPress={handleSave}
        disabled={saving}
      >
        <Text className="text-center text-white font-medium">
          {saving ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full py-3 mt-3 rounded-md bg-red-500"
        onPress={() => router.back()}
      >
        <Text className="text-center text-white font-medium">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditAd;
