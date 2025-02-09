import { model, Schema } from "mongoose";

interface IMessage {
  _id: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  text: string;
  image: string;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

export default Message;
