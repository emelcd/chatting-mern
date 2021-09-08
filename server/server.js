import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

let count = 0

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    id: String,
    title: String,
    first: String,
    last: String,
  },
  picture: String,
  isOnline: Boolean,
});
const chatSchema = new Schema({
    alias: String,
    message: String,
    date: Date,
    user_id: String,
});

const User = mongoose.model("User", userSchema);
const Chat = mongoose.model("Chat", chatSchema);

const app = express();
app.use(cors());

app.use(bodyParser.json());

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/chat", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
}

connectToDatabase();

app.get("/", (req, res) => {
  User.find({}, (err, users) => {
      if (err) {
          res.status(500).send(err);
      } else {
        count++
        console.log(count, "/")
          res.send(users);
      }
  });
});

app.get("/chat", (req, res) => {
    Chat.find({}, (err, chats) => {
        if (err) {
            res.status(500).send(err);
        } else {
            count++
            console.log(count, "/chat get")
            res.send(chats.reverse());

        }
    });
});

app.post('/chat', (req, res) => {
    const chat = new Chat(req.body);
    chat.save((err, chat) => {
        if (err) {
            res.status(500).send(err);
        } else {
            count++
            console.log(count, "/chat post")
            res.send(chat);
        }
    });

})


app.get('/user', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).send(err);
        } else {
            count++
            console.log(count, "/user get")
            const randomUser = users[Math.floor(Math.random() * users.length)];
            res.send(randomUser);
        }
    });
    
})

app.get('/delete', (req, res) => {
    Chat.deleteMany({}, (err, chat) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(chat);
        }
    });
})
          


app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

// json.results.forEach((user) => {
//     console.log(user)
//     const newUser = new User({
//         id: user.login.uuid,
//         name : user.name,
//         picture : user.picture.large,
//         isOnline : Math.random() > 0.3 ? true : false
//     })
//     newUser.save()
// })
