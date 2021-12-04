import { PencilIcon, XIcon } from "@heroicons/react/outline";
import { IPeak } from "../../interfaces/PeakInterface";

interface IProps {
    peaks: IPeak[]
}

const PeakList = ({ peaks }: IProps) => {
    return (
        <div>
            {peaks !== [] && (
                <div>
                    {
                        peaks.map((peak, idx) => (
                            <div key={`peak-${idx}`}>{peak.name}</div>
                        ))}
                </div>

            )}
        </div>
    )
}

export default PeakList;