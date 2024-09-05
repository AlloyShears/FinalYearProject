import { useCallback, useContext, useEffect, useState } from "react"; // Import hooks for state, effects, and callback
import { GiftedChat } from "react-native-gifted-chat"; // Import GiftedChat component for chat UI
import { AuthContext } from "~/lib/auth-context"; // Import AuthContext to access user authentication state
import "react-native-get-random-values"; // Import for generating UUIDs in React Native
import { v4 as uuidv4 } from "uuid"; // UUID generator
import { onSnapshot, doc, collection, setDoc } from "firebase/firestore"; // Firebase Firestore methods for real-time data
import { db } from "~/firebase-config"; // Firebase configuration

export default function () {
  const { user } = useContext(AuthContext); // Get the current user from the authentication context
  const [messages, setMessages] = useState<any>([]); // State to store chat messages

  // If the user is not authenticated, render nothing
  if (user == null) return <></>;

  // Fetch messages from Firestore when the component is first mounted
  useEffect(() => {
    const subscriber = onSnapshot(
      doc(collection(db, "messages"), user?.uid), // Get messages for the current user
      onMessageSnapshot // Callback to handle the Firestore snapshot
    );

    return subscriber; // Clean up the listener when the component unmounts
  }, []);

  // Handle incoming Firestore snapshot data
  function onMessageSnapshot(snapshot: any) {
    let data = snapshot.data();

    // Convert Firestore timestamps to JavaScript Date objects
    data?.messages?.forEach(
      (e: any) => (e.createdAt = e.createdAt.toDate())
    );

    // Sort messages by creation date in descending order
    let sortedMessages = data?.messages?.sort(
      (a: any, b: any) => b.createdAt - a.createdAt
    );

    // If no messages exist, initialize with a welcome message
    setMessages(
      sortedMessages ?? [
        {
          _id: 1,
          text:
            "Hey there " +
            user?.email +
            "! 💪 Ready to do stuff? I'm your virtual todo buddy, here to help with all your queries. Ask away! 😅",
          createdAt: new Date(),
          user: {
            _id: 1,
          },
        },
      ]
    );
  }

  // Function to handle sending messages and storing them in Firestore
  const onSend = useCallback((messages: any = []) => {
    setMessages((previousMessages: any) => {
      let allMessages = [...previousMessages, ...messages]; // Combine new messages with previous ones

      // Update Firestore with the new message list
      setDoc(doc(collection(db, "messages"), user?.uid), {
        messages: allMessages,
      });

      // Append new messages to the chat
      return GiftedChat.append(previousMessages, messages);
    });

    const query = messages[0].text; // Extract the text from the newly sent message

    // Send the message text to a local server (e.g., an AI chatbot) for a response
    fetch("http://localhost:5137?q=" + query).then(async (response) => {
      const reply = await response.text(); // Get the reply text from the server
      const replyMessage: any = {
        _id: uuidv4(), // Generate a unique ID for the reply message
        text: reply,
        createdAt: new Date(),
        user: {
          _id: 1, // System-generated response user ID
        },
      };

      // Add the bot's reply message to the chat and Firestore
      setMessages((previousMessages: any) => {
        let allMessages = [...previousMessages, replyMessage];

        // Update Firestore with the new message list including the bot's reply
        setDoc(doc(collection(db, "messages"), user?.uid), {
          messages: allMessages,
        });

        return GiftedChat.append(previousMessages, replyMessage);
      });
    });
  }, []);

  // Render the chat UI using GiftedChat, handling sending messages and displaying the current user's messages
  return (
    <GiftedChat
      messages={messages} // Pass the messages to GiftedChat
      onSend={(messages) => onSend(messages)} // Handle sending messages
      user={{
        _id: user?.uid, // Set the current user ID in the chat
      }}
    />
  );
}
