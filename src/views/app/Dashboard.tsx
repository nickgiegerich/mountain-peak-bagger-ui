import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import Map from "../../components/map/Map";
import PeakForm from "../../components/peaks/PeakForm";
import { PeakInterface } from "../../interface/PeakInterface";
import { peakService } from "../../service/peakService";
import { RootState } from "../../store";
import { fetcher } from "../../utils/axiosInterceptor";
import { PeakObject } from "../../utils/types/peakTypes";


const Dashboard = () => {
  const auth = useSelector((state: RootState) => state.auth)
  const [showForm, setShowForm] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('todo')
  const { peaks, isLoading, isError } = usePeak();
  const { user } = useUser();
  const [currentPeakSelection, setCurrentPeakSelection] = useState<PeakObject>()

  function handlePeakSelectionChange(value: any) {
    setCurrentPeakSelection(value)
  }

  function SubmitPeak() {
    // @ts-ignore: Unreachable code error
    if (auth.account?.user.id === user[0].id && currentPeakSelection && auth.account.user.id && auth.token) {
      peakService.postPeak(currentPeakSelection, Number(auth.account?.user.id), auth.token)
    }
  }

  function changeSelectedStatus(e: any) {
    setSelectedStatus(e.target.value)
    setCurrentPeakSelection((prev: any) => ({ ...prev, todo: e.target.value === 'todo', done: e.target.value === 'done' }))
  }


  if (isLoading) {
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
      <div className="flex flex-wrap md:flex-nowrap flex-row justify-center items-center">
        {currentPeakSelection ?
          <>
            <h1 className="w-full text-gray-200 text-4xl font-thin uppercase p-4">
              {currentPeakSelection.label}
            </h1>
            <div className="p-4 w-full text-center text-gray-200">
              <div>
                <input type={"radio"} id="todo" value="todo" name="completion" checked={selectedStatus === 'todo'} onChange={changeSelectedStatus} />
                <label className="pl-4 capitalize text-xl" htmlFor="todo">todo</label>
              </div>
              <div>
                <input type={"radio"} id="done" value="done" name="completion" checked={selectedStatus === 'done'} onChange={changeSelectedStatus} />
                <label className="pl-4 capitalize text-xl" htmlFor="done">done</label>
              </div>
            </div>

            <div className="w-full z-auto p-4">
              <div className="flex justify-center">
                <button className="text-gray-200 px-5 py-2 bg-gray-800 border-4 rounded-md" onClick={() => SubmitPeak()}>
                  {showForm ? "X" : "save?"}
                </button>
              </div>
              <div className={`transform transition scale-y-${showForm ? 1 : 0} duration-75 ${showForm ? "block" : "hidden"}`}>
                <PeakForm />
              </div>

            </div>

          </>
          :
          <>
            <h1 className="w-full text-gray-200 text-4xl font-thin uppercase p-4">
              select a peak to save
            </h1>
          </>
        }



        {/* <PeakList peaks={peaks} setPeaks={setPeaks} /> */}
      </div>
      <div className="sticky top-0 w-full self-start">
        <Map peakObject={currentPeakSelection} setPeakObject={handlePeakSelectionChange} />
      </div>
    </div>
  );
};

function usePeak() {
  const { data, error } = useSWR('/api/peaks/', fetcher)

  return {
    peaks: data,
    isLoading: !error && !data,
    isError: error
  }
}

function useUser() {
  const { data, error } = useSWR('/api/user/', fetcher)

  return {
    user: data,
    isLoading: !error && !data,
    isError: error
  }
}

export default Dashboard;
