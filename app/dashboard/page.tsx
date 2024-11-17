"use client";

import NewSession from "@/components/new-session";
// import StudyDashboard from "@/components/study-dashboard";

export default function Dashboard() {
  return (
    <main className="w-full min-h-screen">
      <div className=" mx-auto p-4">
          <div>
            <NewSession />
          </div>
          {/* <div>
            <h2 className="text-xl font-semibold mb-4">Study Dashboard</h2>
            <StudyDashboard />
          </div> */}
        
      </div>
    </main>
  );
}