import { useCallback, useContext, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { AuthContext } from "~/lib/auth-context";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { onSnapshot, doc, collection, setDoc } from "firebase/firestore";
import { db } from "~/firebase-config";

export default function () {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<any>([]);

  if (user == null) return <></>;

  useEffect(() => {
    const subscriber = onSnapshot(
      doc(collection(db, "messages"), user?.uid),
      onMessageSnapshot
    );

    return subscriber;
  }, []);

  function onMessageSnapshot(snapshot: any) {
    // i hate this
    let data = snapshot.data();

    data?.messages?.forEach(
      (e: any, i: any): any => (e.createdAt = e.createdAt.toDate())
    );

    let cancer = data?.messages?.sort(
      (a: any, b: any) => b.createdAt - a.createdAt
    );

    setMessages(
      cancer ?? [
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

  const onSend = useCallback((messages: any = []) => {
    setMessages((previousMessages: any) => {
      let allMessages: any = [];

      allMessages.push(...previousMessages);
      allMessages.push(...messages);

      setDoc(doc(collection(db, "messages"), user?.uid), {
        messages: allMessages,
      });

      return GiftedChat.append(previousMessages, messages);
    });

    const query = messages[0].text;
    fetch("http://localhost:5137?q=" + query).then(async (response) => {
      const reply = await response.text();
      const idk: any = {
        _id: uuidv4(),
        text: reply,
        createdAt: new Date(),
        user: {
          _id: 1,
        },
      };

      setMessages((previousMessages: any) => {
        let allMessages: any = [];

        allMessages.push(...previousMessages);
        allMessages.push(idk);

        setDoc(doc(collection(db, "messages"), user?.uid), {
          messages: allMessages,
        });

        return GiftedChat.append(previousMessages, idk);
      });
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user?.uid,
      }}
    />
  );
}
