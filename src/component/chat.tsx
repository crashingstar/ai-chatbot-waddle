import React, { useEffect, useState } from "react";
import { GeminiAIService } from "../services/gemini";
import { useAuthContext } from "@/context/AuthContext";
import getChatsByUserId from "@/firebase/firestore/getData";
import addData from "@/firebase/firestore/addData";
import { v4 as uuidv4 } from "uuid";

function Chat() {
  const { user } = useAuthContext() as { user: any };
  const [messages, setMessages] = useState<
    { sender: string; text: string }[] | []
  >([]);
  const [chatInstanceId, setChatInstanceId] = useState<string | null>(null); // State to hold the chatInstanceId
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pastChats, setPastChats] = useState<any[] | null>([]); // Store past chats

  useEffect(() => {
    // Generate chatInstanceId once when the component mounts (or when the user starts a new chat)
    const newChatInstanceId = uuidv4();
    setChatInstanceId(newChatInstanceId);
  }, []);
  useEffect(() => {
    if (user) {
      const fetchPastChats = async () => {
        const { result: chatList } = await getChatsByUserId(user.uid);

        // console.log(chatList);
        setPastChats(chatList);
      };

      fetchPastChats();
    }
  }, [user]);
  // Function to send the message to the server and get the AI response
  const sendMessage = async () => {
    if (!userInput.trim()) return; // Prevent empty input
    if (!chatInstanceId) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setIsLoading(true);
    setUserInput("");

    try {
      const geminiAIService = new GeminiAIService();
      const response = await geminiAIService.generateResponse(userInput);

      console.log(response);
      setMessages([...newMessages, { sender: "ai", text: response ?? "" }]);

      if (user) {
        const chatData = {
          userId: user.uid,
          messages: [...newMessages, { sender: "ai", text: response }],
          timestamp: new Date(),
          chatInstanceId: chatInstanceId,
        };
        await addData("chats", chatInstanceId, chatData);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { sender: "ai", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPastChat = (chat: any) => {
    setMessages(chat.messages); // Load the selected past chat
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="w-full max-w-[600px] p-5 rounded-lg mx-auto">
      <div className="w-[300px] max-w-[300px] mr-5 p-4 bg-gray-100 border-solid border-2 border-slate-400 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Past Chats</h2>
        <div className="overflow-y-auto max-h-[400px]">
          {pastChats?.length === 0 && <p>No past chats available.</p>}
          {pastChats?.map((chat, index) => (
            <div
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-200 rounded"
              onClick={() => loadPastChat(chat)}
            >
              <p>{chat.messages[0]?.text.substring(0, 40)}...</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto mb-5 p-2 bg-stone-50 border-solid border-2 border-slate-400">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2`}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <p
              className={`rounded-lg p-4 ${
                msg.sender === "user"
                  ? "bg-sky-600 text-white w-fit flex justify-self-end "
                  : "bg-slate-100 text-black w-fit"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <p>...</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          className="w-full p-2 border-solid border-2 rounded-lg"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
