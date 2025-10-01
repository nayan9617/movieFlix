import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { use, useEffect } from "react";
import { images } from "@/constants/images";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
// import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { updateSearchCount } from "@/services/appwrite";

const Search = () => {
    // const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: movies, loading: moviesLoading, error: moviesError, refetch: loadMovies,  reset } = useFetch(() => fetchMovies({query: searchQuery}), false);

    //this is called debouncing, ie delaying the api call until user stops typing for a while
    useEffect(()=>{
       const func = setTimeout(async () => {
        if(searchQuery.trim()){
            await loadMovies();
        } else {
            reset();
        }
       }, 500); 

        return () => clearTimeout(func);
    }, [searchQuery]);

    useEffect(() => {
        if(movies?.results.length > 0 && movies?.results[0]){
                //update the search count in appwrite
                updateSearchCount(searchQuery, movies.results[0]);
            }
    }, [movies]);

    return(
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover"/>

            <FlatList
              data = {movies?.results}
              renderItem={({item}) => (
                <MovieCard 
                  {... item}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{ justifyContent: 'center', gap: 16, marginVertical: 16 }}
              className="px-5"
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
              ListHeaderComponent={
                <>
                <View className="w-full flex-row justify-center items-center mt-20">
                    <Image source={icons.logo} className="w-12 h-10" />
                </View>

                <View className="my-5">
                    <SearchBar 
                    placeholder="Search movies... " 
                    value={searchQuery}
                    onChangeText={(text: string) => setSearchQuery(text)} />
                </View>

                {moviesLoading && (
                    <ActivityIndicator size="large" color="#0000ff" className="my-3" />
                )}

                {moviesError && (
                    <Text className="text-red-500 text-center my-3 px-5">Error: {moviesError.message}</Text>
                )}

                {!moviesLoading && !moviesError && searchQuery.trim() && movies?.results.length > 0 && (
                    <Text className="text-xl text-white font-bold mb-3">
                        Search Results for {' '}
                        <Text className="text-accent font-bold">{ searchQuery }</Text>
                    </Text>
                )}
                </>
              }
                ListEmptyComponent = {
                    !moviesLoading && !moviesError && searchQuery.trim() ? (
                        <Text className="text-white text-center mt-20">No results found for{' '}
                        <Text className="text-accent font-bold">{ searchQuery }</Text>
                        </Text>
                    ) : null
                }
              />
        </View>
    )
}

export default Search;
