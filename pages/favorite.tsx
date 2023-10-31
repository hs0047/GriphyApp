// Import necessary libraries and modules
import { useEffect, useState } from "react"; // Hooks for side effects and state management
import Image from "next/image"; // Next.js optimized image component
import { useRouter } from "next/router"; // useRouter for client-side routing in Next.js
import { useUser } from "../contexts/UserContext"; // Context for user management
import { AiFillDelete, AiOutlineLogout } from "react-icons/ai"; // Icons for delete and logout
import { BiArrowBack } from "react-icons/bi"; // Icon for back arrow
import { db } from "../lib/firebase"; // Firestore instance

import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  query,
  limit,
} from "firebase/firestore"; // Firestore methods for database operations

// Define the Favorite component
const Favorite: React.FC = () => {
  // State variable for gifs
  const [gifs, setGifs] = useState<{ id: string; url: string }[]>([]);
  const router = useRouter();
  const { user, logout } = useUser(); // Extract user and logout function from context

  // Function to handle user logout
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Effect to fetch user's favorite GIFs
  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const userFavouriteDocRef = doc(collection(db, "favourite"), user.uid);
        const gifsCollectionRef = collection(userFavouriteDocRef, "gifs");
        const gifQuery = query(gifsCollectionRef, limit(10));

        const querySnapshot = await getDocs(gifQuery);
        const fetchedGifs = querySnapshot.docs.map((doc) => {
          return { id: doc.id, url: doc.data().url };
        });
        setGifs(fetchedGifs);
      } catch (error) {
        console.error("Error fetching favorite GIFs:", error);
      }
    };

    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Function to copy GIF URL to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied!");
    });
  };

  // Function to delete a GIF from user's favorites
  const handleDelete = async (gifId: string) => {
    if (!user) {
      alert("You need to be logged in to save favorites.");
      return;
    }

    try {
      const userFavouriteDocRef = doc(collection(db, "favourite"), user.uid);
      const gifToDeleteDocRef = doc(
        collection(userFavouriteDocRef, "gifs"),
        gifId
      );
      await deleteDoc(gifToDeleteDocRef);
      setGifs((prevGifs) => prevGifs.filter((gif) => gif.id !== gifId));
      alert("GIF removed from favorites.");
    } catch (error) {
      console.error("Error deleting favorite GIF:", error);
    }
  };

  // Render the favorite GIFs UI
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center">
        <div className="mb-5">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-green-500 text-white p-3 rounded-full"
          >
            <BiArrowBack size={24} />
          </button>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-3 rounded-full"
          >
            <AiOutlineLogout size={24} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5  gap-4">
        {gifs.map((gif) => (
          <div
            key={gif.id}
            className="border rounded-md relative p-2"
            style={{ width: "200px", height: "200px" }}
          >
            <Image
              src={gif.url}
              width={200}
              height={200}
              alt="Favorite GIF"
              unoptimized={true}
              onClick={() => copyToClipboard(gif.url)}
            />
            <button
              onClick={() => handleDelete(gif.id)}
              className="bg-red-500 text-white p-2 rounded-full absolute top-0 right-0"
              style={{ zIndex: 1 }} // Add zIndex to place it on top of the image
            >
              <AiFillDelete size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the Favorite component for use in other parts of the application
export default Favorite;
