import { createRef, useRef } from "react";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { storage } from "~/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Text } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
};

export function TodoFormEditor(props: Props) {
  const editor = createRef<RichEditor>() || useRef();
  const onUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (result?.assets == null) return;

    const source = { uri: result.assets[0].uri };
    const response = await fetch(source.uri);
    const blob = await response.blob();
    const filename = uuidv4();
    const storageRef = ref(storage, filename);
    const storageRes = await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    editor.current?.insertImage(url);
  };

  return (
    <>
      <RichEditor
        ref={editor}
        onChange={props.onChange}
        initialHeight={500}
        initialContentHTML={props.value}
      />
      <RichToolbar
        editor={editor}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.removeFormat,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertImage,
          actions.undo,
          actions.redo,
        ]}
        onPressAddImage={onUploadImage}
      />
    </>
  );
}
