// Import necessary libraries and modules
import { useState, FormEvent } from "react"; // useState for state management, FormEvent for form event types
import { useRouter } from "next/router"; // useRouter for client-side routing in Next.js
import { auth } from "../lib/firebase"; // Import the authentication instance from Firebase configuration
import { signInWithEmailAndPassword } from "firebase/auth"; // Method to sign in users using email and password
import { FirebaseError } from "firebase/app"; // Type for Firebase-specific errors
import Link from "next/link"; // Component for client-side navigation in Next.js

// Define the Login component
const Login: React.FC = () => {
  // State variables for email, password, and error messages
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter(); // Initialize the router for navigation

  // Regular expression pattern to validate email addresses
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Function to handle the login process
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Validate email format
    if (!email.match(emailPattern)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    try {
      // Try to sign in with the provided email and password
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Navigate to the dashboard upon successful login
    } catch (error) {
      // Handle potential errors during the login process
      if (error instanceof FirebaseError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  // Render the login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              className="w-full p-2 border rounded-lg"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              className="w-full p-2 border rounded-lg"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white font-semibold p-2 rounded-lg"
            type="submit"
          >
            Login
          </button>
        </form>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        <nav className="mt-4">
          Not a Member ?{" "}
          <Link href="/signup">
            <span className="text-blue-500 underline">Sign Up</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

// Export the Login component for use in other parts of the application
export default Login;
