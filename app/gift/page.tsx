import GiftButtons from "@/components/gift/GiftButtons";

const Gift = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="bg-white shadow-md rounded-lg p-4 opacity-80 whitespace-nowrap items-center justify-center ">
        <h1 className="text-center pb-3 m-3 text-xl">Choose your power up</h1>
        <GiftButtons />
      </div>
    </div>
  );
};

export default Gift;
