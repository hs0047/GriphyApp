import { useEffect, useState } from "react";
import Image from "next/image";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { CircularProgress, debounce } from "@mui/material";

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

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total_count: 0,
    count: 0,
    offset: 0,
  });
  const [isLoading, setIsLoading] = useState(false); // State for loading status

  const handleSearch = async (page = 0) => {
    setIsLoading(true); // Set loading to true when starting the fetch

    const API_KEY = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65"; // Replace with your Giphy API key
    const LIMIT = 10;
    const offset = page * LIMIT;

    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=${LIMIT}&offset=${offset}`
    );
    const data = await response.json();
    console.log(data);

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
    setIsLoading(false); // Set loading to false after fetching data
  };

  useEffect(() => {
    if (searchTerm) {
      debouncedHandleSearch();
    }
  }, [searchTerm]);

  const debouncedHandleSearch = debounce(handleSearch, 300); // Debounce the search function

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center items-center my-4">
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
          Search
        </button>
      </div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gifs.map((gif) => (
              <div key={gif.id} className="border rounded-md p-2">
                <Image
                  src={gif.images.fixed_width.url}
                  width={200}
                  height={200}
                  alt={gif.title}
                  unoptimized={true}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center my-4">
            <Stack spacing={2} justifyContent="center" alignItems="center">
              <Pagination
                className="mt-4 mb-4"
                count={Math.ceil(pagination.total_count / 10)}
                onChange={(event, page) => handleSearch(page - 1)}
                shape="rounded"
                variant="outlined"
              />
            </Stack>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
