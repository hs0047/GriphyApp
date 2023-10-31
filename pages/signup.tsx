import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import Link from "next/link";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [reconfirmPassword, setReconfirmPassword] = useState<string>(""); // New state
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  // Email regex pattern
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.match(emailPattern)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    if (password !== reconfirmPassword) {
      // New check
      setErrorMessage("Password and Confirm Password do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect to dashboard or another page after successful signup
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Reconfirm Password" // New input field
          value={reconfirmPassword}
          onChange={(e) => setReconfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      <nav>
        Already a user ?{"  "}
        <Link href="/">
          <u>Login</u>
        </Link>
      </nav>
    </div>
  );
};

export default Signup;
