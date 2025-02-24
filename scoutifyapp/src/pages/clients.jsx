import Navbar from "../components/navbar";
import React from 'react'; 
const labels = [
  {
    name: "Atlantic Records",
    image: "/src/images/Atlantic_Records.png",
    funFact: "Atlantic Records was founded in 1947 and played a major role in the development of rock, R&B, and hip-hop.",
    artists: ["Ed Sheeran", "Bruno Mars", "Cardi B", "Missy Elliott"],
  },
  {
    name: "Columbia Records",
    image: "/src/images/columbia.png",
    funFact: "Columbia Records is the oldest brand name in recorded sound, founded in 1887.",
    artists: ["Adele", "Beyoncé", "Bob Dylan", "Harry Styles"],
  },
  {
    name: "Death Row Records",
    image: "/src/images/death row.jpeg",
    funFact: "Founded by Dr. Dre and Suge Knight, Death Row defined West Coast rap in the 90s.",
    artists: ["2Pac", "Dr. Dre", "Snoop Dogg", "Nate Dogg"],
  },
  {
    name: "Epic Records",
    image: "/src/images/epic.png",
    funFact: "Epic Records helped shape the music industry by signing artists across all genres, from pop to hip-hop.",
    artists: ["Michael Jackson", "Travis Scott", "Future", "Camila Cabello"],
  },
  {
    name: "Republic Records",
    image: "/src/images/republic.png",
    funFact: "Republic Records has been named the #1 label in the industry multiple times.",
    artists: ["Drake", "Ariana Grande", "The Weeknd", "Nicki Minaj"],
  },
  {
    name: "Sony Music",
    image: "/src/images/Sony.png",
    funFact: "Sony Music Entertainment is one of the 'Big Three' record companies globally.",
    artists: ["Doja Cat", "Khalid", "John Legend", "P!nk"],
  },
  {
    name: "Universal Music Group",
    image: "/src/images/universal.jpg",
    funFact: "Universal Music Group is the largest music corporation in the world.",
    artists: ["Billie Eilish", "Taylor Swift", "Post Malone", "Lady Gaga"],
  },
  {
    name: "Warner Music Group",
    image: "/src/images/Warner_Music_Group.png",
    funFact: "Warner Music Group was the first major music company to fully embrace digital music distribution.",
    artists: ["Dua Lipa", "Coldplay", "Bruno Mars", "Ed Sheeran"],
  },
  {
    name: "Def Jam Recordings",
    image: "/src/images/def-jam-recordings.png",
    funFact: "Def Jam is a pioneer of hip-hop music, helping to bring rap to mainstream audiences.",
    artists: ["Jay-Z", "Kanye West", "Rihanna", "Logic"],
  },
];

function Clients() {
  return (
    <section className="min-h-screen bg-gray-900 py-20 px-6">
      <h2 className="text-5xl font-extrabold text-white text-center mb-12">
        The Most Iconic Record Labels 🎶
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {labels.map((label, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform transform hover:scale-105"
          >
            <img
              src={label.image}
              alt={label.name}
              className="w-40 h-40 object-contain mb-4"
            />
            <h3 className="text-2xl font-bold text-white mb-2">{label.name}</h3>
            <p className="text-gray-300 text-center italic">{label.funFact}</p>
            <h4 className="text-xl text-yellow-400 mt-4 font-semibold">Famous Artists:</h4>
            <ul className="text-gray-200 text-center">
              {label.artists.map((artist, i) => (
                <li key={i} className="text-lg">{artist}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Clients;
