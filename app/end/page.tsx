import RedirectButton from "@/components/gift/RedirectButtons";
const End = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="card gap-4 w-80 items-center justify-center">
        <h1 className="button">Play again?</h1>
        <RedirectButton />
      </div>
    </div>
  );
};

export default End;
