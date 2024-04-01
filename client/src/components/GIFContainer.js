import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { GiphyFetch } from "@giphy/js-fetch-api";
import useDebounce from "../hooks/useDebounce";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const giphyFetch = new GiphyFetch("CXF6IIaPBwHC4p3hBfz1HUpUTEZNFiHm");

function GIFContainer({ setGiphyToSend, showGifs }) {
  const [gifs, setGifs] = useState("");
  const [gifInput, setGifInput] = useState("");
  const [loadingGifs, setLoadingGifs] = useState(false);

  const debounceSearchTerm = useDebounce(gifInput, 500);

  useEffect(() => {
    const fetchGifs = async () => {
      setLoadingGifs(true);

      let result = [];
      if (debounceSearchTerm) {
        result = await giphyFetch.search(gifInput, {
          sort: "relevant",
          lang: "es",
          limit: 12,
        });
      } else {
        result = await giphyFetch.trending({ limit: 12 });
      }

      setLoadingGifs(false);
      setGifs(result.data);
    };

    fetchGifs();
  }, [debounceSearchTerm]);

  return (
    <AnimatePresence>
      {showGifs && (
        <motion.div
          initial={{ opacity: 0, height: 0, overflow: "hidden" }}
          animate={{ opacity: 1, height: "45vh", overflow: "auto" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          exit={{ opacity: 0, height: 0, overflow: "hidden" }}
          className="space-y-2 px-2 py-2 mx-2 rounded-sm bg-secondary flex flex-col h-[45vh] overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full"
        >
          <div className="flex items-center gap-2 bg-primary w-full rounded-sm px-2 py-2">
            <FiSearch color="#707e8b" />
            <input
              value={gifInput}
              onChange={(e) => setGifInput(e.target.value)}
              placeholder="Search GIFs"
              className="placeholder-[#A9A9A9] text-sm bg-transparent outline-none flex-1"
            />
          </div>
          {loadingGifs ? (
            <div className="flex flex-1 items-center justify-center">
              <ReactLoading
                type="spin"
                color="#1da1f2"
                height={24}
                width={24}
              />
            </div>
          ) : (
            <div className="grid items-center grid-cols-3 gap-y-2 gap-x-2 flex-1">
              {gifs.map((gif) => {
                const url = gif.images.fixed_width_small.webp;
                return (
                  <div
                    onClick={() => setGiphyToSend(url)}
                    key={gif.id}
                    className="cursor-pointer bg-primary flex-1 flex items-center justify-center p-1"
                  >
                    <img
                      src={url}
                      className="w-full h-[100px] rounded-sm object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GIFContainer;
