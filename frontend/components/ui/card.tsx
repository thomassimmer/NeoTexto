import { MouseEventHandler } from "react";
import Balancer from "react-wrap-balancer";

export default function Card({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: MouseEventHandler;
}) {
  return (
    <div
      className="flex flex-col items-center rounded-xl border border-gray-200 bg-gradient-to-b from-amber-100 to-amber-50 px-5 py-10 shadow-md hover:cursor-pointer hover:shadow-xl sm:pt-20"
      onClick={onClick}
    >
      <div className="max-w-md text-center">
        <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
          <Balancer>{title}</Balancer>
        </h2>
        <div className="mt-3 leading-normal text-gray-500">{description}</div>
      </div>
    </div>
  );
}
