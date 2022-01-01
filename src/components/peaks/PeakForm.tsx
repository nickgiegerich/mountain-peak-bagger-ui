import React, { Dispatch, SetStateAction, useState } from "react";

import moment from "moment";
import { IPeak } from "../../interfaces/PeakInterface";
import { useAuth } from "../../context/Auth";
import { PeakInterface } from "../../interface/PeakInterface";
import { peakService } from "../../service/peakService";

interface IProps {
  peaks: IPeak[],
  setPeaks: Dispatch<SetStateAction<IPeak[]>>;
}

const PeakForm = ({ peaks, setPeaks }: IProps) => {
  const [inputs, setInputs] = useState({
    name: "",
    date: "",
    latitude: "",
    longitude: "",
    description: "",
  });
  const auth = useAuth();

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    auth.setCurrentPeak((prevState: PeakInterface | undefined) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const reset = () => {
    // auth.setCurrentPeak({ peak_name: '', peak_description: '', latitude: undefined, longitude: undefined, summit_date: '' })
    auth.setCurrentPeak(undefined)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(auth.currentPeak)
    if (auth.currentPeak?.peak_name && auth.authedUser?.user.id) {
      const _status = await peakService.postPeak(auth.currentPeak, auth.authedUser.user.id);

      if (_status === 201) {
        console.log(_status)
        reset();
      }
    }

    // format date
    // let date = new Date(inputs.date);
    // let formattedDate = moment(date).format("YYYY-MM-DD");

    // SET UP A NEW PEAK OBJECT
    // const newPeak = {
    //   name: inputs.name,
    //   latitude: inputs.latitude === "" ? 0.0 : inputs.latitude,
    //   longitude: inputs.longitude === "" ? 0.0 : inputs.longitude,
    //   summit_date: formattedDate,
    //   location_descr: inputs.description,
    // };

  };
  return (
    <div className="transform transition scale-1">
      {/* <div className="text-center font-light text-xl">Bag a New Peak!</div> */}
      {
        auth.currentPeak ? (
          <form
            onSubmit={onSubmit}
            onReset={reset}
            className="shadow-xl bg-gray-900 rounded-lg px-8 pt-6 pb-8 mb-4"
          >
            <div className="flex flex-wrap">

              {/* NAME */}
              <div className="w-full lg:w-1/2 mb-2">
                <label
                  className="block text-gray-200 text-sm font-light mb-2"
                  htmlFor="name"
                >
                  Peak Name
                </label>
                <input
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full lg:w-10/12"
                  id="name"
                  name="peak_name"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Peak Name"
                  value={auth.currentPeak?.peak_name}
                  onChange={onChange}
                />
              </div>
              {/* SUMMIT DATE */}
              <div className="w-full lg:w-1/2 mb-2">
                <label
                  className="block text-gray-200 text-sm font-light mb-2"
                  htmlFor="date"
                >
                  Summit Date
                </label>
                <input
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full lg:w-10/12"
                  id="date"
                  name="summit_date"
                  type="date"
                  placeholder="Summit Date"
                  value={auth.currentPeak?.summit_date}
                  onChange={onChange}
                />
              </div>
              {/* LAT */}
              <div className="w-full lg:w-1/2 mb-2">
                <label
                  className="block text-gray-200 text-sm font-light mb-2"
                  htmlFor="latitude"
                >
                  Peak Latitude
                </label>
                <input
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full lg:w-10/12"
                  id="latitude"
                  name="latitude"
                  type="number"
                  maxLength={100}
                  step={0.1}
                  placeholder="Latitude"
                  value={auth.currentPeak?.latitude}
                  onChange={onChange}
                />
              </div>
              {/* LON */}
              <div className="w-full lg:w-1/2 mb-2">
                <label
                  className="block text-gray-200 text-sm font-light mb-2"
                  htmlFor="longitude"
                >
                  Peak Longitude
                </label>
                <input
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full lg:w-10/12"
                  id="longitude"
                  name="longitude"
                  type="number"
                  maxLength={100}
                  step={0.1}
                  placeholder="Longitude"
                  value={auth.currentPeak?.longitude}
                  onChange={onChange}
                />
              </div>
              {/* DESCRIPTION */}
              <div className="w-full lg:w-1/2 mb-2">
                <label
                  className="block text-gray-200 text-sm font-light mb-2"
                  htmlFor="description"
                >
                  Peak Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full lg:w-10/12"
                  id="description"
                  name="peak_description"
                  maxLength={300}
                  placeholder="Peak Description"
                  value={auth.currentPeak?.peak_description}
                  onChange={onChange}
                />
              </div>
              {/* SUBMIT */}
              <div className="w-1/2 self-center mb-2">
                {/* <button
              className="bg-green-500 items-center hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full lg:w-10/12"
              type="submit"
            //   on={onSubmit}
            >
              Submit!
            </button> */}

              </div>
              <div className="flex justify-evenly w-full space-x-1">
                <button
                  type="reset"
                  value={"Reset"}
                  className="relative block my-10 w-1/2 mx-auto cursor-pointer"
                >
                  {/* BG Shadow */}
                  <div className="absolute inset-x-0 inset-y-0 bottom-0 bg-yellow-300 border border-gray-500 rounded-lg" />

                  {/* Text */}
                  <div className="relative bottom-2 text-xl font-thin leading-none tracking-wider py-4 px-10 bg-yellow-100 border border-gray-500 rounded-lg transform hover:translate-y-1 transition duration-200 ease-in-out">
                    clear
                  </div>
                </button>
                <button
                  type="submit"
                  value={"Submit"}
                  className="relative block my-10 w-1/2 mx-auto cursor-pointer"
                >
                  {/* BG Shadow */}
                  <div className="absolute inset-x-0 inset-y-0 bottom-0 bg-green-300 border border-gray-500 rounded-lg" />

                  {/* Text */}
                  <div className="relative bottom-2 text-xl font-thin leading-none tracking-wider py-4 px-10 bg-green-100 border border-gray-500 rounded-lg transform hover:translate-y-1 transition duration-200 ease-in-out">
                    save
                  </div>
                </button>

              </div>
            </div>
          </form>
        ) : (
          <div
            className="shadow-xl bg-gray-900 rounded-lg px-8 pt-6 pb-8 mb-4 text-gray-200 font-light uppercase">
            Select a point on the map to get started
            <ul>
              <li className="italic lowercase"> * double click</li>
              <li className="italic lowercase">* use the search bar</li>
            </ul>
          </div>
        )
      }

    </div>
  );
};

export default PeakForm;
