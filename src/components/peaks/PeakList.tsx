import { PencilIcon, XIcon } from "@heroicons/react/outline";
import { Dispatch, SetStateAction } from "react";
import { IPeak } from "../../interfaces/PeakInterface";

interface IProps {
    peaks: IPeak[],
    setPeaks: Dispatch<SetStateAction<IPeak[]>>;
}


const PeakList = ({ peaks, setPeaks }: IProps) => {

    // DELETE PEAK OBJECT
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        var peakId: string | number = e.currentTarget.value;
        console.log(process.env.REACT_APP_BASE_URL)
        const url = `${process.env.REACT_APP_BASE_URL}/peaks/user/peak/${peakId}`
        console.log(url)
        fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem("token")}`,
            },
        }).then( () =>
            setPeaks(peaks.filter(peak => peak.id != peakId))
        ).catch((err) => console.log(err))
    }
    return (
        <div>
            {peaks.length ? (
                <div>
                    {peaks.map((peak, idx) => (
                        <div key={`peak-${idx}`}>
                            <div className="w-full bg-gray-900 rounded-lg shadow-lg text-gray-300 my-5 py-2">
                                <div className=" text-center font-light text-2xl pt-2">
                                    {peak.name}
                                </div>
                                <div className="flex w-full justify-center font-sans text-lg py-5">
                                    {peak.location_descr}
                                </div>
                                <div className="flex w-full justify-center font-sans text-md">
                                    <div className="px-3">Latitude: {peak.latitude}</div>
                                    <div className="px-3">Longitude: {peak.longitude}</div>
                                    <div className="px-3">Summit Date: {peak.summit_date}</div>
                                </div>
                            </div>
                            <div className="flex justify-evenly">
                                <button>
                                    <PencilIcon
                                        className="block h-6 w-6 text-purple-700"
                                        aria-hidden="true"
                                    />
                                </button>
                                <button onClick={handleDelete} value={peak.id}>
                                    <XIcon
                                        className="block h-6 w-6 text-red-700"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            ) : <div>Add a Peak!</div>}
        </div>
    )
}

export default PeakList;