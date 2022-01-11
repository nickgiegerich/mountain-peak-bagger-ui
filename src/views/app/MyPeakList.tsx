import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { peakService } from "../../service/peakService";
import { RootState } from "../../store";
import { fetcher } from "../../utils/axiosInterceptor";
import { PeakObject } from "../../utils/types/peakTypes";


const MyPeakList = () => {
  const auth = useSelector((state: RootState) => state.auth)
  const { peaks, isLoading, isError } = usePeak();
  const { user } = useUser();
  const [currentPeakSelection, setCurrentPeakSelection] = useState<PeakObject>()
  const [donePeaks, setDonePeaks] = useState<PeakObject[]>([])
  const [todoPeaks, setTodoPeaks] = useState<PeakObject[]>([])

  useEffect(() => {
    if (peaks) {
      let _donePeaks: PeakObject[] = []
      let _todoPeaks: PeakObject[] = []
      peaks.map((peak) => {
        peak.done ? _donePeaks.push(peak) : _todoPeaks.push(peak)
      })
      setDonePeaks(_donePeaks)
      setTodoPeaks(_todoPeaks)
    }
  }, [peaks])

  /**
   * @todo needs to remove the specified item from its list and add it to the other list
   * @todo then we need to update that data on the backend with and update request 
   * 
   * 
   */
  async function handlePeakStatusChange(peakId?: number) {
    const clicked_peak = getPeakObject(peakId!)

    if (clicked_peak?.done) { // if peak is done switch to todo 
      clicked_peak.done = false
      clicked_peak.todo = true
      setDonePeaks(donePeaks.filter((peak) => peak !== clicked_peak))
      setTodoPeaks((prev) => [...prev, clicked_peak])
    } else if (clicked_peak?.todo) { // if peak is a todo switch to done
      clicked_peak.done = true
      clicked_peak.todo = false
      setTodoPeaks(todoPeaks.filter((peak) => peak !== clicked_peak))
      setDonePeaks((prev) => [...prev, clicked_peak])
    }

    // update the data on the backend 
    if (auth.token) {
      const _response = await peakService.updatePeak(clicked_peak!, Number(auth.account?.user.id), auth.token)
      console.log(_response)
    }

  }

  /**
   * 
   * @param peakId 
   * @returns peak object
   */
  function getPeakObject(peakId: number) {
    const peak = peaks.find((peak) => peak.id === peakId)
    return peak
  }

  function handlePeakSelectionChange(value: any) {
    setCurrentPeakSelection(value)
  }

  async function SubmitPeak() {
    // @ts-ignore: Unreachable code error
    if (auth.account?.user.id === user[0].id && currentPeakSelection && auth.account.user.id && auth.token) {
      const _response = await peakService.postPeak(currentPeakSelection, Number(auth.account?.user.id), auth.token)

      if (_response === 201) {

        setCurrentPeakSelection(undefined)
      }

    }
  }

  function changeSelectedStatus(e: any) {
    setCurrentPeakSelection((prev: any) => ({ ...prev, todo: e.target.value === 'todo', done: e.target.value === 'done' }))
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center space-x-2 h-screen">
        <div className="w-10 h-10 bg-blue-400 rounded-full animate-bounce animation-delay-75"></div>
        <div className="w-10 h-10 bg-blue-400 rounded-full animate-bounce animation-delay-100"></div>
        <div className="w-10 h-10 bg-blue-400 rounded-full animate-bounce animation-delay-150"></div>
      </div>
    );
  }

  return (
    <div className="relative h-screen border-white border-0 p-0">
      <div className="flex flex-row justify-evenly h-full py-3">
        {/* TODO LIST */}
        <div>
          <h1 className="text-2xl underline text-center text-gray-200">Peaks To Climb</h1>
          {todoPeaks.length > 0 ? (
            <div className="text-center text-white">
              {todoPeaks.map((peak, idx) => (
                <div key={idx} className="bg-gray-300 px-2 py-1 my-3 rounded-lg shadow-2xl">
                  <button className="text-gray-100 bg-gray-500 px-5 py-4 my-3 rounded-lg shadow-2xl" onClick={() => handlePeakStatusChange(peak.id)}>
                    {peak.label}
                  </button>
                </div>
              ))}
            </div>
          ) : (<div className="text-center text-white">* no peaks currently in your todo list</div>)}
        </div>
        {/* DONE LIST */}
        <div>
          <h1 className="text-2xl underline text-center text-gray-200">Completed Peaks</h1>
          {donePeaks.length > 0 ? (
            <div className="text-center text-white">
              {donePeaks.map((peak, idx) => (
                <div key={idx} className="bg-green-300 px-2 py-1 my-3 rounded-lg shadow-2xl">
                  <button className="text-gray-900 bg-green-500 px-5 py-4 my-3 rounded-lg shadow-2xl" onClick={() => handlePeakStatusChange(peak.id)}>
                    {peak.label}
                  </button>
                </div>
              ))}
            </div>
          ): (<div className="text-center text-white">* you haven't climbed any peaks yet!</div>)}
        </div>

      </div>
    </div>
  );
};

function usePeak() {
  const { data, error } = useSWR('/api/peaks/', fetcher)

  console.log(data)

  return {
    peaks: data as PeakObject[],
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

export default MyPeakList;
