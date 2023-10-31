// Import necessary libraries and modules
import { useState, FormEvent } from "react"; // useState for state management, FormEvent for form event types
import { useRouter } from "next/router"; // useRouter for client-side routing in Next.js
import { auth } from "../lib/firebase"; // Import the authentication instance from Firebase configuration
import { createUserWithEmailAndPassword } from "firebase/auth"; // Method to create a new user using email and password
import { FirebaseError } from "firebase/app"; // Type for Firebase-specific errors
import Link from "next/link"; // Component for client-side navigation in Next.js

// Define the Signup component
const Signup: React.FC = () => {
  // State variables for email, password, reconfirm password, and error messages
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [reconfirmPassword, setReconfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter(); // Initialize the router for navigation

  // Regular expression pattern to validate email addresses
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Function to handle the signup process
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Validate email format
    if (!email.match(emailPattern)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    // Check if passwords match
    if (password !== reconfirmPassword) {
      setErrorMessage("Password and Confirm Password do not match.");
      return;
    }

    // Ensure password length is sufficient
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Try to create a new user with the provided email and password
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Navigate to the dashboard upon successful signup
    } catch (error) {
      // Handle potential errors during the signup process
      if (error instanceof FirebaseError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  // Render the signup form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
        <form onSubmit={handleSignup}>
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
          <div className="mb-4">
            <input
              className="w-full p-2 border rounded-lg"
              type="password"
              placeholder="Reconfirm Password"
              value={reconfirmPassword}
              onChange={(e) => setReconfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white font-semibold p-2 rounded-lg"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        <nav className="mt-4">
          Already a user?{" "}
          <Link href="/">
            <span className="text-blue-500 underline">Login</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

// Export the Signup component for use in other parts of the application
export default Signup;
