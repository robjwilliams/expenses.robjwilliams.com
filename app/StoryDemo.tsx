"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const content = [
  {
    title: "Chapter 1: Attemp to track finances",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    image: "",
  },
  {
    title: "Chapter 2: Enemy arrival",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    image: "",
  },
  {
    title: "Chapter 3: Receipt stolen for personal purposes",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    image: "",
  },
  {
    title: "Chapter 4: Solution",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    image: "",
  },
];

export const StoryDemo = () => {
  return (
    <>
      <div className="flex flex-col gap-16 mb-32 mt-16 w-full ">
        <div className="flex flex-row gap-12 w-full items-start">
          <h2 className="text-5xl font-extrabold">Once upon a time...</h2>
        </div>
        {content &&
          content.map((c, i) => (
            <div key={i} className="flex flex-row gap-24 w-full items-center">
              <motion.div
                className="max-w-2xl justify-start p-32"
                initial={{ opacity: 0, x: -30 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 2, delay: 1 }}
              >
                <h4 className="text-xl font-semibold">{c.title}</h4>
                <p>{c.description}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 2, delay: 1 }}
                className="flex-1 max-w-sm p-10"
              >
                <Image
                  src="/cat.avif"
                  width={0}
                  height={0}
                  layout="responsive"
                  alt="cat"
                  className="shadow-[5px_5px_0px_0px_rgba(109,40,217)] rounded-full"
                />
              </motion.div>
            </div>
          ))}
      </div>
    </>
  );
};
