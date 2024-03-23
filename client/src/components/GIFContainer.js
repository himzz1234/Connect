import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { GiphyFetch } from "@giphy/js-fetch-api";
import useDebounce from "../hooks/useDebounce";

const giphyFetch = new GiphyFetch("CXF6IIaPBwHC4p3hBfz1HUpUTEZNFiHm");
function GIFContainer({ sendGif, showGifs }) {
  const [gifs, setGifs] = useState("");
  const [gifInput, setGifInput] = useState("");
  const [loadingGifs, setLoadingGifs] = useState(false);

  const debounceSearchTerm = useDebounce(gifInput, 500);
  useEffect(() => {
    const fetchGifs = async () => {
      setLoadingGifs(true);
      if (debounceSearchTerm) {
        const res = await giphyFetch.search(gifInput, {
          sort: "relevant",
          lang: "es",
          limit: 12,
        });

        setLoadingGifs(false);
        setGifs(res.data);
      } else {
        const res = await giphyFetch.trending({ limit: 12, type: "videos" });
        setLoadingGifs(false);
        setGifs(res.data);
      }
    };

    fetchGifs();
  }, [debounceSearchTerm]);

  return (
    <>
      {showGifs && (
        <div
          initial={{ opacity: 1, y: 400 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, type: "tween" }}
          exit={{ opacity: 1, y: 400 }}
          className="border-l-[10px] border-r-[10px] border-primary bg-secondary flex flex-col h-[45vh] overflow-y-auto scrollbar scrollbar-0"
        >
          <input
            value={gifInput}
            onChange={(e) => setGifInput(e.target.value)}
            placeholder="Search GIFs"
            className="m-1 rounded-sm placeholder-[#A9A9A9] px-2 py-1  text-sm w-60 bg-primary outline-none"
          />
          {loadingGifs ? (
            <div className="flex flex-col space-y-2 items-center justify-center mt-5">
              <ReactLoading type="spin" color="white" height={24} width={24} />
              <p className="text-[14px]">GIF's are loading...</p>
            </div>
          ) : (
            <div className="flex items-center flex-wrap flex-1 px-1">
              {gifs.map((gif) => {
                const url = gif.images.downsized_medium.url;
                return (
                  <div
                    onClick={() => sendGif(url)}
                    key={gif.id}
                    className="cursor-pointer"
                  >
                    <img
                      src={url}
                      className="max-h-[80px] md:max-h-[100px] lg:max-h-[80px] lg:flex-1 md:w-[216px] sm:w-[128px] w-[90px] rounded-sm m-1 object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default GIFContainer;
