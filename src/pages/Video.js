import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { doc, onSnapshot, query, collection, addDoc } from 'firebase/firestore';
import { auth, db, timestamp } from "../firebase";
import { AiFillLike } from "react-icons/ai";
import { RiShareForwardLine } from "react-icons/ri";
import { HiDotsHorizontal, HiDownload } from "react-icons/hi";
import { MdOutlineSort } from "react-icons/md";
import { BiDislike } from "react-icons/bi";
import { CategoryItems } from "../static/data";
import RecommendVideo from "../components/RecommendVideo";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "../slices/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import Comment from "../components/Comment";

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  useEffect(() => {
    if (id) {
      const q = query(doc(db, "videos", id));
      onSnapshot(q, (snapShot) => {
        setData(snapShot.data());
      });
      const commentsQuery = query(collection(db, "videos", id, "comments"));
      onSnapshot(commentsQuery, (snapShot) => {
        setComments(
          snapShot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
          }))
        );
      });
    }
  }, [id]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    });
  });

  useEffect(() => {
    const q = query(collection(db, 'videos'));
    onSnapshot(q, (snapShot) => {
      setVideos(
        snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  const addComment = async (e) => {
    e.preventDefault();
    let commentData = {
      image: user.photoURL,
      name: user.displayName,
      comment,
      uploaded: timestamp,
    };
    if (id) {
      await addDoc(collection(db, "videos", id, "comments"), commentData);
      console.log("Comment added successfully!");
      setComment(''); // Clear the comment input field
    }
  };

  return (
    <div className="py-20 px-9 bg-yt-black flex h-full flex-col sm:flex-row">
      <div className="left flex-1 flex flex-col">
        <div className="flex justify-center ">
          <iframe
            src={`https://www.youtube.com/embed/${data?.link}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-[350px] h-[200px] sm:w-[400px] sm:h-[300px] md:w-[500px] md:h-[350px] lg:w-[600px] lg:h-[400px] xl:w-[700px] xl:h-[450px]"
          ></iframe>
        </div>
        <h2 className="text-yt-white font-semibold mt-3 mb-1  sm:mb-3 pb-4 text-lg ">{data?.name}</h2>
        <div className="flex items-center flex-col sm:flex-row">
          <img src={data?.logo} alt={data?.channel} className="rounded-full w-10 h-10" />
          <div className="px-3">
            <h3 className="font-medium text-yt-white text-sm sm:text-base md:text-lg">
              {data?.channel && data?.channel.length <= 25
                ? data.channel
                : (typeof data?.channel === 'string' ? `${data.channel.substr(0, 20)}...` : '')
              }
            </h3>
            <p className="text-sm text-yt-gray">{data?.subscribers} subscribers</p>
            <button className="bg-yt-white px-3 py-2 rounded-lg text-sm font-medium ml-3">Subscribe</button>
          </div>

          <div className="flex pl-28 ">
            <div className="flex bg-yt-light-black items-center rounded-2xl h-18 mx-1 hover:bg-yt-light-1">
              <div className="flex px-3 items-center border-r-yt-light-1 cursor-pointer">
                <AiFillLike className="text-yt-white text-2xl" />
                <p className="text-yt-white pl-2 pr-3 text-sm font-semibold">300k</p>
              </div>
              <div className="pl-4 pr-5 cursor-pointer">
                <BiDislike className="text-[22px] font-extralight text-yt-white" />
              </div>
            </div>
            <div className="flex bg-yt-light-black items-center rounded-2xl h-10 mx-1 cursor-pointer">
              <div className="flex px-3 items-center cursor-pointer">
                <RiShareForwardLine className="text-2xl text-yt-white font-thin" />
                <p className="text-yt-white pl-2 pr-3 text-sm font-semibold">Share</p>
              </div>
            </div>
            <div className="flex bg-yt-light-black items-center rounded-2xl h-10 mx-1 cursor-pointer">
              <div className="flex px-3 items-center cursor-pointer">
                <HiDownload className="text-2xl text-yt-white font-thin" />
                <p className="text-yt-white pl-2 pr-3 text-sm font-semibold">Download</p>
              </div>
            </div>
            <div className="flex bg-yt-light-black hover:bg-yt-light-1 cursor-pointer items-center rounded-full justify-center w-10 h-10 text-yt-white">
              <HiDotsHorizontal />
            </div>
          </div>
        </div>
        <div className="max-w-4xl bg-yt-light-black mt-4 rounded-2xl p-3 text-sm text-yt-white">
          <div className="flex">
            <p className="font-medium pr-3">
              {data?.views}
              <span className="pl-1 text-xs">Views</span>
            </p>
            <p className="font-medium pr-3">{data?.uploadTime}</p>
          </div>
          <span className="hidden sm:block justify-center ">
            {data?.description && data?.description.length <= 200
              ? data.description
              : (typeof data?.description === 'string' ? `${data.description.substr(0, 200)}...` : '')
            }
          </span>
        </div>
        <div className="text-yt-white mt-5">
          <div className="flex items-center">
            <h1>{comments.length} Comments </h1>
            <div className="flex items-center mx-10">
              <MdOutlineSort size={30} className="mx-3" />
              <h5>Sort by</h5>
            </div>
          </div>
          {
            user && (
              <form onSubmit={addComment} className="flex w-[800px] pt-4 items-start">
                <img src={user?.photoURL} alt="profile" className="rounded-full mr-3 h-12 w-12" />
                <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment.." className="bg-[transparent] border-b border-b-yt-light-black outline-none text-sm p-1 w-full" />
              </form>
            )
          }
          <div className="mt-4">
            {comments.map((item, i) => (
              <Comment key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
      <div className="right px-3 flex-[0.4] flex flex-col ">
        <div>
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
        </div>
        <div className="pt-8 ">
          {
            videos.map((video, i) => {
              if (video.id !== id) {
                return (
                  <Link key={i} to={`/video/${video.id}`}>
                    <RecommendVideo {...video} />
                  </Link>
                );
              } else {
                return null;
              }
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Video;
