import { useLocation, useNavigate } from "react-router-dom";
import authSlice from "../../store/slices/auth";
import { useDispatch } from "react-redux";


const Logout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authSlice.actions.logout())
    navigate(state?.path || "/")
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200 bg-auth-bg bg-no-repeat bg-cover bg-fixed">
      <div className="relative w-full sm:w-2/3 mx-10 bg-gray-100 rounded-lg bg-opacity-20 filter backdrop-filter backdrop-blur-lg">
        <div className="relative block mx-auto my-10 w-full text-center">
          <h1 className="text-3xl font-light">Are you sure you want to logout?</h1>
        </div>

        <button type="button" onClick={handleLogout} className="relative block my-10 w-1/2 mx-auto  cursor-pointer">
          {/* BG Shadow */}
          <div className="absolute inset-x-0 inset-y-0 bottom-0 bg-gray-300 border border-gray-500 rounded-lg" />

          {/* Text */}
          <div className="relative bottom-2 text-xl font-thin leading-none tracking-wider py-4 px-10 bg-gray-100 border border-gray-500 rounded-lg transform hover:translate-y-1 transition duration-200 ease-in-out">
            logout
          </div>
        </button>
      </div>

    </div>
  );
};

export default Logout;
