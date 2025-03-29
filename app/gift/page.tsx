import GiftButtons from "@/components/gift/GiftButtons";

const Gift = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="bg-white shadow-md rounded-lg p-4 opacity-80 w-[28rem] items-center justify-center ">
        <h1 className="text-center pb-3 m-3 text-lg">Choose Your Power Up</h1>
        <GiftButtons />
      </div>
    </div>
  );
};

export default Gift;
