import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";

export default function App() {
  const auth = useAuth();

  if (!auth) return null;

  const { user, loading } = auth;

  if (loading) {
    return <div className="min-h-screen bg-reference" />;
  }

  // Not logged in
  if (!user) {
    return <Landing />;
  }

  // Logged in → keep same background/layout styling
  return (
    <div className="min-h-screen bg-reference flex items-center justify-center">
      <h2 className="text-white text-2xl">User Logged In ✅</h2>
    </div>
  );
}
