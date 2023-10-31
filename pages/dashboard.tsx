// Import necessary libraries and modules
import { useEffect, useState } from "react"; // Hooks for side effects and state management
import Image from "next/image"; // Next.js optimized image component
import Pagination from "@mui/material/Pagination"; // Pagination component from Material-UI
import Stack from "@mui/material/Stack"; // Stack layout component from Material-UI
import { CircularProgress, debounce } from "@mui/material"; // Circular progress for loading and debounce function
import { useRouter } from "next/router"; // useRouter for client-side routing in Next.js
import { UserProvider, useUser } from "../contexts/UserContext"; // Context for user management
import { AiFillHeart, AiOutlineLogout } from "react-icons/ai"; // Icons for heart and logout
import {
  collection,
  addDoc,
  doc,
  getDocs,
  where,
  query,
} from "firebase/firestore"; // Firestore methods for database operations
import { db } from "../lib/firebase"; // Firestore instance
import { BiSearch } from "react-icons/bi"; // Search icon

// Define the Gif and Pagination interfaces
interface Gif {
  id: string;
  title: string;
  images: {
    fixed_width: {
      url: string;
    };
  };
}

interface Pagination {
  total_count: number;
  count: number;
  offset: number;
}

// Define the Dashboard component
const Dashboard: React.FC = () => {
  // State variables for search term, gifs, pagination, and loading status
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total_count: 0,
    count: 0,
    offset: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, logout } = useUser(); // Extract user and logout function from context

  // Function to handle user logout
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Function to handle GIF search
  const handleSearch = async (page = 0) => {
    setIsLoading(true);
    const API_KEY = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65"; // Giphy API key
    const LIMIT = 10;
    const offset = page * LIMIT;

    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=${LIMIT}&offset=${offset}`
    );
    const data = await response.json();

    if (data.meta && data.meta.status !== 200) {
      console.error("GIPHY API Error:", data.meta.msg);
      return;
    }

    if (data && data.data && data.pagination) {
      setGifs(data.data);
      setPagination(data.pagination);
    } else {
      console.error("Unexpected API response structure:", data);
    }
    setIsLoading(false);
  };

  // Effect to handle search term changes
  useEffect(() => {
    if (searchTerm) {
      debouncedHandleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Effect to handle user authentication status
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  // Debounce the search function to limit the number of API calls
  const debouncedHandleSearch = debounce(handleSearch, 300);

  // Function to save a GIF to user's favorites
  const saveToFavorites = async (gifUrl: String) => {
    if (!user) {
      alert("You need to be logged in to save favorites.");
      return;
    }
    try {
      const favouriteCollectionRef = collection(db, "favourite");
      const userFavouriteDocRef = doc(favouriteCollectionRef, user.uid);
      const gifsCollectionRef = collection(userFavouriteDocRef, "gifs");

      const querySnapshot = await getDocs(
        query(gifsCollectionRef, where("url", "==", gifUrl))
      );

      if (!querySnapshot.empty) {
        alert("GIF already added to favorites!");
      } else {
        await addDoc(gifsCollectionRef, { url: gifUrl });
        alert("GIF added to favorites!");
      }
    } catch (error) {
      console.error("Error adding GIF to favorites:", error);
    }
  };

  // Function to copy GIF URL to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied!");
    });
  };

  // Render the dashboard UI
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-4">
        <div>
          <button
            onClick={() => router.push("/favorite")}
            className="bg-green-500 text-white p-3 rounded-full"
          >
            <AiFillHeart size={24} />
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
      <div className="flex justify-between items-center my-4 p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for GIFs..."
          className="p-2 border rounded-md flex-grow mr-2"
        />
        <button
          onClick={() => handleSearch()}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          <BiSearch size={24} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5  gap-4">
            {gifs.map((gif) => (
              <div
                key={gif.id}
                className="border rounded-md relative p-2"
                style={{ width: "250px", height: "250px" }}
              >
                <button
                  onClick={() => saveToFavorites(gif.images.fixed_width.url)}
                  className="bg-green-500 text-white p-2 rounded-md absolute top-0 right-0"
                >
                  <AiFillHeart />
                </button>
                <Image
                  src={gif.images.fixed_width.url}
                  width={250}
                  height={250}
                  alt={gif.title}
                  unoptimized={true}
                  onClick={() => copyToClipboard(gif.images.fixed_width.url)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {!isLoading && (
        <div className="p-4">
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Pagination
              count={Math.ceil(pagination.total_count / 10)}
              onChange={(event, page) => handleSearch(page - 1)}
              shape="rounded"
              variant="outlined"
            />
          </Stack>
        </div>
      )}
    </div>
  );
};

// Export the Dashboard component for use in other parts of the application
export default Dashboard;
