// Import necessary hooks, components, and utilities for rich text editing and image uploading
import { createRef, useRef } from "react"; // Hooks for managing references
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor"; // Rich text editor and toolbar components
import * as ImagePicker from "expo-image-picker"; // Image picker utility from Expo
import "react-native-get-random-values"; // Ensures UUID generation works on React Native
import { v4 as uuidv4 } from "uuid"; // UUID library for generating unique identifiers
import { storage } from "~/firebase-config"; // Firebase storage configuration
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Firebase methods for handling file uploads
import { Text } from "react-native"; // Text component from React Native

// Define the component's props which include the editor's value and an onChange handler
type Props = {
  value: string;
  onChange: (text: string) => void;
};

// TodoFormEditor component for rich text editing, including image uploading functionality
export function TodoFormEditor(props: Props) {
  // Create a reference to the rich text editor
  const editor = createRef<RichEditor>() || useRef();

  // Function to handle image upload
  const onUploadImage = async () => {
    // Launch the image picker to select an image from the gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Limit selection to images
      allowsEditing: true, // Allow basic editing
      aspect: [4, 3], // Aspect ratio
      quality: 0.2, // Image quality
    });

    if (result?.assets == null) return; // Return if no image was selected

    // Convert the selected image to a blob for uploading
    const source = { uri: result.assets[0].uri };
    const response = await fetch(source.uri);
    const blob = await response.blob();
    
    // Generate a unique filename using UUID and create a reference to Firebase storage
    const filename = uuidv4();
    const storageRef = ref(storage, filename);
    
    // Upload the image to Firebase storage
    const storageRes = await uploadBytes(storageRef, blob);
    
    // Get the download URL of the uploaded image
    const url = await getDownloadURL(storageRef);
    
    // Insert the image into the rich text editor
    editor.current?.insertImage(url);
  };

  return (
    <>
      {/* RichEditor for rich text content input */}
      <RichEditor
        ref={editor} // Reference to the editor
        onChange={props.onChange} // Handle content changes
        initialHeight={500} // Set the editor height
        initialContentHTML={props.value} // Set the initial content of the editor
      />

      {/* RichToolbar provides editing actions for the rich text editor */}
      <RichToolbar
        editor={editor} // Connect the toolbar to the editor
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.removeFormat,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertImage, // Image insertion action
          actions.undo,
          actions.redo,
        ]}
        onPressAddImage={onUploadImage} // Handle image upload when the image button is pressed
      />
    </>
  );
}
