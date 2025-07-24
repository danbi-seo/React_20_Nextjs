"use client";
import Image from "next/image";
import { useState } from "react";

export default function FlipCard({ front, back }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <>
      <div
        className="w-[200px] h-[200px] relative transform-style-3d transition-transform duration-500"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <Image
          src={front}
          alt="앞면"
          width={200}
          height={200}
          className="w-full h-full absolute backface-hidden object-cover"
        />
        <Image
          src={back}
          alt="뒷면"
          width={200}
          height={200}
          className="w-full h-full absolute backface-hidden rotate-y-180 object-cover"
        />
      </div>
      <button
        onClick={() => setFlipped((prev) => !prev)}
        className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
      >
        뒤집기
      </button>
    </>
  );
}