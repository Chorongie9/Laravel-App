import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../api";
import { router } from "expo-router";
import "../../global.css";
import { verifyInstallation } from "nativewind";

interface Ad {
  id: number;
  title: string;
  description: string;
  image: string;
}

const Index: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await api.get<Ad[]>("/ads");
      const sortedAds = res.data.sort((a, b) => b.id - a.id);
      setAds((prevAds) =>
        JSON.stringify(prevAds) === JSON.stringify(sortedAds)
          ? prevAds
          : sortedAds
      );
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
      verifyInstallation();
    }
  };

  const deleteAd = async (id: number) => {
    console.log("Deleting ad with ID:", id);
    try {
      setLoading(true);
      const response = await api.delete(`/ads/${id}`);
      if (response.status === 200) {
        Alert.alert("Success", "Ad deleted successfully.");
        fetchAds();
      } else {
        Alert.alert("Error", "Failed to delete the ad.");
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
      Alert.alert("Error", "Failed to delete the ad.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePress = (id: number, title: string) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete \"${title}\"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteAd(id) },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchAds();
    }, [])
  );

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <View className="py-5 items-center">
        <Text className="text-2xl font-bold">Ad Listings</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={ads}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="p-4 mb-4 bg-white rounded-lg shadow-lg">
              {item.image ? (
                <Image
                  source={{
                    uri: `http://10.0.2.2:8000/storage/${item.image}`,
                  }}
                  className="w-full h-60 rounded-lg mb-3"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-60 bg-gray-300 rounded-lg mb-3 items-center justify-center">
                  <Text className="text-gray-500">No Image Available</Text>
                </View>
              )}
              <Text className="text-lg font-bold mb-2">{item.title}</Text>
              <Text className="text-sm text-gray-600 mb-3">
                {item.description}
              </Text>
              <View className="flex-row justify-between">
                <Button
                  title="Edit"
                  color="#FF0000"
                  onPress={() => router.push(`/${item.id}`)}
                />
                <Button
                  title="Delete"
                  color="#FF4500"
                  onPress={() => handleDeletePress(item.id, item.title)}
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Index;
