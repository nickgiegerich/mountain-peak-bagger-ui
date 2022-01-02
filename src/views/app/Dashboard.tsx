import { useState, useEffect } from "react";
import Map from "../../components/map/Map";
import PeakForm from "../../components/peaks/PeakForm";
import { usePeak } from "../../context/Peak";


const Dashboard = () => {
  const [showForm, setShowForm] = useState(false)
  const { loading, currentPeak, allPeaks } = usePeak();

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-2 h-screen">
        <div className="w-10 h-10 bg-blue-400 rounded-full animate-bounce animation-delay-75"></div>
        <div className="w-10 h-10 bg-blue-400 rounded-full animate-bounce animation-delay-100"></div>
        <div className="w-10 h-10 bg-blue-400 rounded-full animate-bounce animation-delay-150"></div>
      </div >
    );
  }

  return (
    <div className="relative h-screen bg-gray-800 border-white border-0 p-0">
        <div className="flex flex-wrap">
          <h1 className="w-full text-gray-500 text-4xl font-thin uppercase p-4">
            add a peak
          </h1>

          <div className="sticky top-0 w-full self-start">
            <Map peakList={allPeaks ? allPeaks : []}/>
          </div>

          <div className="absolute top-10 right-0 w-1/3 z-auto">
            <span className="flex h-3 w-3 -mb-2">
              <span className={`${currentPeak ? "animate-ping bg-green-500" : "bg-transparent"} absolute inline-flex h-6 w-6 rounded-full opacity-75`}></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            <button className="text-white px-5 py-2 bg-gray-800 border-4 rounded-md" onClick={() => setShowForm(!showForm)}>
              {showForm ? "X" : "save?"}
            </button>

            <div className={`transform transition scale-y-${showForm ? 1 : 0} duration-75 ${showForm ? "block" : "hidden"}`}>
              <PeakForm />
            </div>

          </div>
          {/* <PeakList peaks={peaks} setPeaks={setPeaks} /> */}
        </div>
    </div>
  );
};

export default Dashboard;
