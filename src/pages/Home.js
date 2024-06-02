import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { CategoryItems } from "../static/data";
import { collection, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import "../../src/components/Video"
import Video from "../../src/components/Video";
import { onAuthStateChanged } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { setUser } from '../slices/userSlice'

const Home = () => {
  const [videos, setVideos] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const q = query(collection(db, 'videos'));
    onSnapshot(q, (snapShot) => {
      setVideos(
        snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
      // console.log('Fetched videos:', videoData); // Check the structure of the video data
    });
  }, []);

  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        dispatch(setUser(user))
      }else{
        dispatch(setUser(null))
      }
    })
  }, [dispatch])

  return (
    <>
      <Sidebar />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-[calc(100%-240px)] h-[calc(100vh-53px)] pt-16 bg-yt-black md:ml-60">
          <div className="flex flex-row px-3 overflow-x-scroll relative scrollbar-hide">
            {CategoryItems.map((item, i) => (
              <h2
                className="text-yt-white font-normal text-sm py-2 px-4 break-keep whitespace-nowrap bg-yt-light mr-3 cursor-pointer rounded-lg hover:bg-yt-light-1"
                key={i}
              >
                {item}
              </h2>
            ))}
          </div>

          <div className="pt-12 px-5 mx-auto w-full max-w-screen-lg grid grid-cols-yt gap-x-3 gap-y-8 sm:ml-0">
            {videos.length === 0 ? (
              <div className="h-[86vh]"></div>
            ) : (
              videos.map((video) => (
                <Link to={`/video/${video.id}`} key={video.id}>
                  <Video {...video} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
