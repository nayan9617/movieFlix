import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

interface Props {
  onPress: () => void;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({ onPress, placeholder, value, onChangeText }: Props) => {
  return (
    <View className="flex-row bg-dark-200 items-center rounded-full px-5 py-4">
      <Image 
      source={icons.search}
      className="size-5"
      resizeMode="contain"
      tintColor="#ab8bff"
      />
      <TextInput 
      onPress={onPress}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      className="flex-1 ml-2 text-white font-bold"
      placeholderTextColor="#ab8bff"
      />
    </View>
  );
};

export default SearchBar;