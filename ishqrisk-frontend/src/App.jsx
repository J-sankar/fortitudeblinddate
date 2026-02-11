import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";


import Landing from "./pages/Landing";
import BasicInfo from "./pages/BasicInfo";
import Preferences from "./pages/Preferences";
import Questionnaire from "./pages/Questionaire";
import Waiting from "./pages/Waiting";
import TestChatPage from "./pages/TestChatPage";


export default function App() {
  const getOnboardingRoute = (profile) => {
    if (!profile) return "/basic";

    switch (profile.onboarding_step) {
      case "basic":
        return "/basic";
      case "preferences":
        return "/preferences";
      case "qna":
        return "/qna";
      case "waiting":
        return "/waiting";
      case "matched":
        return "/test-chat";
      default:
        return "/basic";
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  const { user, profile, loading } = useAuth();


  useEffect(() => {
    if (loading) return;
    if (!user) return; // ⭐ IMPORTANT

    const route = getOnboardingRoute(profile);

    if (location.pathname !== route) {
      navigate(route, { replace: true });
    }
  }, [loading, user, profile?.onboarding_step]);

  // ⬇️ NOW CONDITIONAL RENDERING IS SAFE
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }



  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Chat />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getOnboardingRoute(profile)} replace />} />
      <Route path="/basic" element={<BasicInfo />} />
      <Route path="/preferences" element={<Preferences />} />
      <Route path="/qna" element={<Questionnaire />} />
      <Route path="/waiting" element={<Waiting />} />
      <Route
        path="/test-chat"
        element={
          profile?.onboarding_step === "matched"
            ? <TestChatPage />
            : <Navigate to={getOnboardingRoute(profile)} replace />
        }
      />

      <Route path="*" element={<Navigate to={getOnboardingRoute(profile)} replace />} />
    </Routes>
  );
}

