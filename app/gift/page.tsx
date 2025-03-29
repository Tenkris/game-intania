import GiftButtons from "@/components/gift/GiftButtons";

const Gift = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="card gap-4 whitespace-nowrap items-center justify-center">
        <h1 className="text-center pb-3 m-3 text-lg">Choose your power up</h1>
        <GiftButtons />
      </div>
    </div>
  );
};

export default Gift;
