import Image from "next/image";

const Images: React.FC = () => {
  return (
    <Image
      src="https://media4.giphy.com/media/SWKyABQ08mbXW/200w.gif?cid=a5a58d706q3fkeanyenvs2mpnyrej7rrg3ixvjhi9vr8g09p&ep=v1_gifs_search&rid=200w.gif&ct=g"
      width={200}
      height={200}
      alt="Giphy Image"
    />
  );
};

export default Images;
