export default function WhoToFollow() {
  return (
    <div className="rounded-lg bg-gray-900 overflow-hidden shadow-lg my-4 w-full">
      <div className="flex">
        <div className="flex-1 m-2">
          <h2 className="px-4 py-2 text-xl w-48 font-semibold text-white">
            Who to follow
          </h2>
        </div>
      </div>

      <hr className="border-gray-800" />

      <div className="flex p-2 justify-around">
        <div className="flex items-center gap-2">
          <img
            className="h-10 w-10 rounded-full"
            src="https://pbs.twimg.com/profile_images/1121328878142853120/e-rpjoJi_bigger.png"
            alt=""
          />

          <div className="flex flex-col">
            <p className="text-base leading-6 font-medium text-white">
              Sonali Hirave
            </p>
            <p className="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150">
              @ShonaDesign
            </p>
          </div>
        </div>

        <a href="" className="p-2 float-right">
          <button className="bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-gray-700 hover:border-transparent rounded-full">
            Follow
          </button>
        </a>
      </div>

      <hr className="border-gray-800" />
    </div>
  );
}
