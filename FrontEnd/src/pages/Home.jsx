import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Category from "../components/Category";

const Home = ({ setGameId, gameId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/products`);
        setData(response.data.games);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <div className="flex justify-center mt-6">
        <Slider className="w-[40rem] cursor-pointer" {...settings}>
          {data.map((game) => (
            <div
              key={game.ProductId}
              className="relative flex flex-col items-center"
            >
              <Link
                onClick={() => setGameId(game.ProductId)}
                to={`/product/${game.ProductId}`}
                className="relative"
              >
                <img
                  src={game.Images[0]}
                  alt={game.Name}
                  className="object-cover w-[640px] h-[360px] rounded-lg"
                />
                <div className="absolute bottom-0 w-full text-center bg-black bg-opacity-50 text-white py-2">
                  {game.Name}
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
      <div className="mt-6">
        <Category setGameId={setGameId} gameId={gameId} sort="Price" title="Under 500 EGP" />
      </div>
      <div className="mt-6">
        <Category setGameId={setGameId} gameId={gameId} sort="CategoryId" title="Action" />
      </div>
      <div className="mt-6">
        <Category setGameId={setGameId} gameId={gameId} sort="CategoryId" title="Adventure" />
      </div>
    </>
  );
};

export default Home;
