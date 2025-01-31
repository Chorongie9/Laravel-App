import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const TestPostAd: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setResponseMessage("");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !image) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    const uriParts = image.split(".");
    const fileType = uriParts[uriParts.length - 1];
    formData.append("image", {
      uri: image,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    try {
      const response = await axios.post(
        "http://10.0.2.2:8000/api/ads",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResponseMessage(response.data.message);
      Alert.alert("Success", response.data.message);

      // Reset the form after success
      resetForm();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unable to reach the server"
      );
    }
  };

  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => setResponseMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [responseMessage]);

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold mb-5 text-center">
        Create New Ad Listing
      </Text>
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
        <TouchableOpacity
          className="w-full py-2 bg-blue-500 rounded-md"
          onPress={pickImage}
        >
          <Text className="text-center text-white font-medium">
            Pick an Image
          </Text>
        </TouchableOpacity>
        {image && (
          <Image
            source={{ uri: image }}
            className="w-full h-60 mt-4 rounded-md"
          />
        )}
      </View>
      <TouchableOpacity
        className="w-full py-3 bg-blue-500 rounded-md"
        onPress={handleSubmit}
      >
        <Text className="text-center text-white font-medium">Submit</Text>
      </TouchableOpacity>
      {responseMessage ? (
        <Text className="mt-5 text-lg text-green-600">{responseMessage}</Text>
      ) : null}
    </View>
  );
};

export default TestPostAd;
