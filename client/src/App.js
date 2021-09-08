import "./App.css";
import { useState, useEffect } from "react";

import user from "./user.jpg";
import logo from "./logo.png";

const App = () => {
  const [group, setGroup] = useState([]);
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch("http://localhost:4000/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000")
      .then((res) => res.json())
      .then((data) => {
        setGroup(data.sort((a, b) => a.isOnline + b.isOnline));
        let currentUser = data.find((s) => s._id === user._id);
        if (currentUser !== undefined) {
          console.log(currentUser);
          let newArr = data.filter((s) => s._id !== user._id);
          newArr.unshift(currentUser);
          setGroup([...newArr]);

        }
        setLoading(true);
      }).catch((err) => {
        setError(err);
      }
      );
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/chat")
      .then((res) => res.json())
      .then((data) => {
        setChat(data);
        setLoading(true);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }, [refresh]);

 
  const ContactItem = ({ item, index }) => {
    let check = item._id === user._id ? true : false;
    return (
      <div className="contact-item">
        <div className="contact-item-image">
          <img src={item.picture} alt="avatar" />
        </div>
        <div className="contact-item-info">
          <div
            style={{
              color: check ? "#1174C1" : item.isOnline ? "#70FFCA" : "#21242B",
            }}
            className="contact-item-name"
          >
            {item.name.first} {item.name.last}
          </div>
        </div>
      </div>
    );
  };

  const nowMinuts = (data) => {
    // date string to hours and minuts
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // add paddstart
    const hoursString = hours < 10 ? `0${hours}` : hours;
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    const time = `${hoursString}:${minutesString}`;
    return time;
  };

  const ChatItem = ({ item }) => {
    // return data
    let userData = group.find((user) => user._id === item.user_id);
    let check = user._id === item.user_id;
    return (
      <div
        style={{ justifyContent: check ? "flex-end" : "flex-start" }}
        className="message"
      >
        {!check ? (
          <div className="user">
            <img className="img" src={userData.picture} alt="avatar" />
          </div>
        ) : null}

        <div
          className="body"
          style={{ backgroundColor: check ? "#111418" : "#111419" }}
        >
          <div className="card">
            <h5
              className="title"
              style={{ color: check ? "#1174C1" : "#70FFCA" }}
            >
              {item.alias}
            </h5>
            <hr className="hr"></hr>
            <p
              className="content"
              style={{ color: "white", textAlign: check ? "right" : "" }}
            >
              {item.message}
            </p>
          </div>
          <div className="date">
            <p className="date-text">{nowMinuts(item.date)}</p>
          </div>
        </div>
        {check ? (
          <div className="user">
            <img className="img" src={userData.picture} alt="avatar" />
          </div>
        ) : null}
      </div>
    );
  };


  return (
    <div className="App">
      <div className="App-contact">
        <div className="search">
          <input type="text" placeholder="Name" />
        </div>
        <div className="contact">
          <div className="contact-list">
            {group.map((item, index) => (
              <ContactItem key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
      <div className="App-chat">
        <div className="chat">
          <div className="header">
            <div className="logo">
              <img width="72px" src={logo} alt="logo" />
            </div>
            <div className="title">Group Chat</div>
          </div>
          <div id="content" className="content">
            {chat.map((item, index) => (
              <ChatItem key={index} item={item} />
            ))}
          </div>
        </div>
        <div className="send">
          <input
            onKeyDown={(e) => {
              if (e.target.value === "") return;
              if (e.key === "Enter") {
                e.preventDefault();
                const content = document.getElementById("content");
                fetch("http://localhost:4000/chat", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    message: e.target.value,
                    alias: user.name.first,
                    date: new Date(),
                    user_id: user._id,
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    // move the scroll to the bottom
                    content.scrollTop = content.scrollHeight;
                    setRefresh(!refresh);
                  });
                e.target.value = "";
              }
            }}
            className="input"
            type="text"
            placeholder="Type your message here"
          />
        </div>
      </div>
    </div>
  );
};
export default App;
