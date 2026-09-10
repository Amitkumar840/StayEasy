import React from "react";

import Footer from "../component/footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero Section */}

      <section className="relative h-screen flex items-center">

        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
          className="absolute inset-0 w-full h-full object-cover"
        />


        <div className="absolute inset-0 bg-black/50"></div>


        <div className="relative max-w-7xl mx-auto px-8 text-white grid md:grid-cols-2 gap-10">


          <div>

            <p className="uppercase tracking-widest text-blue-300">
              Luxury Hotel Experience
            </p>


            <h1 className="text-6xl font-bold leading-tight mt-4">
              Stay Smart.
              <br />
              Live Better.
            </h1>


            <p className="mt-6 text-xl text-gray-200">
              AI powered hotel booking assistant that helps
              you find rooms, make reservations and enjoy
              personalized services.
            </p>


            <div className="mt-8 flex gap-5">

              <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:scale-105 transition">
                Book Room
              </button>


              <button className="border border-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition">
                Explore
              </button>

            </div>


          </div>


        </div>


        {/* Booking Card */}

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 
        bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-5xl">


          <div className="grid md:grid-cols-4 gap-5">


            <div>
              <label className="text-gray-500">
                Check In
              </label>
              <input
                type="date"
                className="w-full border p-3 rounded-lg mt-2"
              />
            </div>


            <div>
              <label className="text-gray-500">
                Check Out
              </label>
              <input
                type="date"
                className="w-full border p-3 rounded-lg mt-2"
              />
            </div>


            <div>
              <label className="text-gray-500">
                Guests
              </label>

              <select className="w-full border p-3 rounded-lg mt-2">
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>Family</option>
              </select>

            </div>


            <button className="bg-blue-900 text-white rounded-lg mt-7 hover:bg-blue-700">
              Search Room
            </button>


          </div>


        </div>


      </section>




      {/* Features */}

      <section className="py-20 max-w-7xl mx-auto px-8">


        <h2 className="text-4xl font-bold text-center">
          Why Choose SmartStay?
        </h2>


        <div className="grid md:grid-cols-3 gap-8 mt-12">


          {
            [
              {
                title:"AI Assistant",
                icon:"🤖",
                desc:"24/7 AI chatbot for booking and customer support."
              },

              {
                title:"Smart Booking",
                icon:"🏨",
                desc:"Find rooms instantly with intelligent recommendations."
              },

              {
                title:"Premium Service",
                icon:"⭐",
                desc:"Personalized hotel experience for every guest."
              }

            ].map((item,index)=>(

              <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg
              hover:-translate-y-3 transition"
              >

                <div className="text-5xl">
                  {item.icon}
                </div>


                <h3 className="text-2xl font-bold mt-5">
                  {item.title}
                </h3>


                <p className="text-gray-600 mt-3">
                  {item.desc}
                </p>


              </div>


            ))
          }


        </div>


      </section>




      {/* Rooms Section */}

      <section className="bg-white py-20">


      <h2 className="text-4xl font-bold text-center">
        Our Luxury Rooms
      </h2>


      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-8 mt-12">


      {
        [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427",
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
        ].map((img,i)=>(

          <div className="rounded-2xl overflow-hidden shadow-xl">

            <img
            src={img}
            className="h-72 w-full object-cover hover:scale-110 transition duration-500"
            />


            <div className="p-5">

              <h3 className="text-xl font-bold">
                Deluxe Room
              </h3>

              <p className="text-gray-600">
                Luxury room with modern facilities.
              </p>


            </div>


          </div>


        ))
      }


      </div>


      </section>



      {/* AI Chat Floating Button */}

      <button
      className="
      fixed bottom-8 right-8
      bg-blue-900 text-white
      w-16 h-16 rounded-full
      shadow-xl text-3xl
      hover:scale-110 transition
      "
      >
        🤖
      </button>

       <Footer />

    </div>
  );
};


export default Home;