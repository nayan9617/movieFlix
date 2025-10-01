import { Client, Databases, ID, Query } from 'react-native-appwrite';
//track the searches made by user

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABSE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

const client = new Client()
    .setEndpoint("https://sfo.cloud.appwrite.io/v1") // Your API Endpoint
    .setProject(PROJECT_ID); // Your project ID


const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    //check if a record of that search has already been stored
    //if yes, update the searchCount field by 1
    //if no, create a new document with count 1
   try {
    
    const record = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('searchTerm', query),
    ])
    if(record.documents.length > 0){
        const existingMovie = record.documents[0];
        await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
            count: existingMovie.count + 1,
        });
    } else{
        await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
            searchTerm: query,
            movie_id: movie.id,
            count: 1,
            poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            title: movie.title,
        });
    }

   } catch (error) {
    console.log("Error updating search count", error);
    throw error;
   }
}

export const getTopSearches = async(): Promise<TrendingMovies[] | undefined> => {
    try{
       const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.limit(5), 
        Query.orderDesc('count'),
       ])

         return result.documents as unknown as TrendingMovies[];
    } catch(err){
        console.log("Error getting top searches", err);
        throw err;
    }
}