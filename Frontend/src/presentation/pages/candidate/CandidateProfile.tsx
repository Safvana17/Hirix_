import React, { useState } from "react";
import CandidateProfileInfo from "../../components/candidate/CandidateProfileInfo";
import ChangePassword from "../../components/candidate/CandidateChangePassword";
import CandidateTestHistory from "../../components/candidate/CandidateTestHistory";
import CandidateInterviewHistory from "../../components/candidate/CandidateInterviewHistory";
import CandidateHeader from "../../components/layout/CandidateHeader";

type MenuType =
  | "profile"
  | "changePassword"
  | "testHistory"
  | "interviewHistory";

const CandidateProfile: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuType>("profile");

  const renderContent = () => {
    switch (activeMenu) {
      case "profile":
        return <CandidateProfileInfo />;

      case "changePassword":
        return <ChangePassword />;

      case "testHistory":
        return <CandidateTestHistory />;

      case "interviewHistory":
        return <CandidateInterviewHistory />;

      default:
        return <CandidateProfileInfo />;
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-[#021A30] to-[#0B0707]">
    <CandidateHeader />

    <div className="flex">
      {/* Sidebar */}
<aside className="w-72 bg-gradient-to-b from-[#021A30] to-[#052B52] border-r border-blue-900 min-h-[calc(100vh-100px)] shadow-xl">
  <nav className="p-4">
    <ul className="space-y-3">
      {[
        { key: "profile", label: "Profile" },
        { key: "changePassword", label: "Change Password" },
        { key: "testHistory", label: "Test History" },
        { key: "interviewHistory", label: "Interview History" },
      ].map((item) => (
        <li key={item.key}>
          <button
            onClick={() => setActiveMenu(item.key as MenuType)}
            className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 font-medium ${
              activeMenu === item.key
                ? "bg-blue-600 text-white shadow-lg"
                : "text-blue-100 hover:bg-[#0A3C73]"
            }`}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  </nav>
</aside>

      {/* Content */}
<main className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-[#021A30] to-[#041F3B]">
  <div className="w-full max-w-6xl">
    {renderContent()}
  </div>
</main>
    </div>
  </div>
)
}
export default CandidateProfile