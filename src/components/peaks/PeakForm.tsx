import React, { Dispatch, SetStateAction, useState } from "react";
import useAuth from "../../customHooks/AuthHook";
import moment from "moment";
import { IPeak } from "../../interfaces/PeakInterface";

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
  const [user, setUser] = useState();
  const auth = useAuth();

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // format date
    let date = new Date(inputs.date);
    let formattedDate = moment(date).format("YYYY-MM-DD");

    // SET UP A NEW PEAK OBJECT
    const newPeak = {
      name: inputs.name,
      latitude: inputs.latitude === "" ? 0.0 : inputs.latitude,
      longitude: inputs.longitude === "" ? 0.0 : inputs.longitude,
      summit_date: formattedDate,
      location_descr: inputs.description,
    };
    // NEED TO VERIFY THE USER BEFORE POST
    auth!.verify().then((value) => {
      if (value[0]) {
        const primary_key = value[1];
        // SEND DATA TO BACKEND
        fetch(`http://127.0.0.1:8000/peaks/user/${primary_key}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newPeak),
        }).then(async (res) => {
          const data = await res.json();
          return setPeaks(prev => ([...prev, data]));
        })
      }
    });
    setInputs({
      name: "",
      date: "",
      latitude: "",
      longitude: "",
      description: ""
    })
  };
  return (
    <div>
      <div className="text-center font-light text-xl">Bag a New Peak!</div>
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="flex flex-wrap">
          {/* NAME */}
          <div className="w-full lg:w-1/2 mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Peak Name
            </label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full lg:w-10/12"
              id="name"
              name="name"
              type="text"
              required
              maxLength={100}
              placeholder="Peak Name"
              value={inputs.name}
              onChange={onChange}
            />
          </div>
          {/* SUMMIT DATE */}
          <div className="w-full lg:w-1/2 mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="date"
            >
              Summit Date
            </label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full lg:w-10/12"
              id="date"
              name="date"
              type="date"
              required
              placeholder="Summit Date"
              value={inputs.date}
              onChange={onChange}
            />
          </div>
          {/* LAT */}
          <div className="w-full lg:w-1/2 mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
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
              value={inputs.latitude}
              onChange={onChange}
            />
          </div>
          {/* LON */}
          <div className="w-full lg:w-1/2 mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
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
              value={inputs.longitude}
              onChange={onChange}
            />
          </div>
          {/* DESCRIPTION */}
          <div className="w-full lg:w-1/2 mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Peak Description
            </label>
            <textarea
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full lg:w-10/12"
              id="description"
              name="description"
              required
              maxLength={300}
              placeholder="Peak Description"
              value={inputs.description}
              onChange={onChange}
            />
          </div>
          {/* SUBMIT */}
          <div className="w-1/2 self-center mb-2">
            <button
              className="bg-green-500 items-center hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full lg:w-10/12"
              type="submit"
            //   on={onSubmit}
            >
              Submit!
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PeakForm;
