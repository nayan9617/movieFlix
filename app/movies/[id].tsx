import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";
import { icons } from "@/constants/icons";

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 text-sm font-normal">{label}</Text>
        <Text className="text-light-100 text-sm font-bold mt-2">{value ?? 'N/A'}</Text>
    </View>
)

const MovieDetails = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    //fetch movie details from tmdb using the id
    const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));

    return (
            <View className="bg-primary flex-1">
                <ScrollView 
                contentContainerStyle={{
                    paddingBottom: 80
                }}
                >
                   <View>
                     <Image 
                     className="w-full h-[550px]"
                     resizeMode="stretch"
                     source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}}
                     />
                   </View>
                   <View className="flex-col items-start px-5 mt-5 justify-center">
                    <Text className="text-white text-xl font-bold">{movie?.title}</Text>
                    <View className="flex-row items-center mt-2 gap-x-1">
                        <Text className="text-light-200 text-sm">{movie?.release_date?.split('-')[0]}</Text>
                        <Text className="text-light-200 text-sm">{Math.floor(movie?.runtime as number / 60)}h {movie?.runtime! % 60}m</Text>
                    </View>
                    <View className="flex-row bg-dark-100 px-2 py-1 rounded-md mt-2 gap-x-1">
                        <Image  
                        source={icons.star}
                        className="size-4"
                        />
                        <Text
                        className="text-white font-bold text-sm"
                        >
                           {Math.round(movie?.vote_average ?? 0)}/10
                        </Text>
                        <Text className="text-light-200 text-sm">
                            ({movie?.vote_count} votes)
                        </Text>
                    </View>
                    <MovieInfo label='Overview' value={movie?.overview} />
                    <MovieInfo label='Genres' value={movie?.genres?.map((g) => (g.name)).join(' - ' ) || 'N/A'} />
                        <View className="flex flex-row w-1/2 justify-between">
                            <MovieInfo label='Budget' value={movie?.budget ? `$${(movie?.budget / 1_000_000).toFixed(1)} million` : 'N/A'} />
                            <MovieInfo label='Revenue' value={`$${(Math.round(movie?.revenue) / 1_000_000).toFixed(1)} million`} />
                        </View>

                    <MovieInfo label='Production Companies' value={movie?.production_companies? movie.production_companies.map((c) => c.name).join(' - ') : 'N/A'} />
                   </View>
                </ScrollView>  

                <TouchableOpacity 
                onPress={router.back}
                className='absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row justify-center items-center z-50'>
                    <Image 
                    source={icons.arrow}
                    className="size-5 mr-1 mt-0.5 rotate-180"
                    style={{ tintColor: "#fff" }}
                    />    
                    <Text className="text-white text-base font-semibold">Go Back</Text>
                </TouchableOpacity>  
            </View>
    )
}

export default MovieDetails;