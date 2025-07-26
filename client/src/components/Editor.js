// import React, { useEffect, useRef } from "react";
// import "codemirror/mode/javascript/javascript";
// import "codemirror/theme/dracula.css";
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";
// import "codemirror/lib/codemirror.css";
// import CodeMirror from "codemirror";
// import { ACTIONS } from "../Actions";

// function Editor({ socketRef, roomId, onCodeChange }) {
//   const editorRef = useRef(null);
//   useEffect(() => {
//     const init = async () => {
//       const editor = CodeMirror.fromTextArea(
//         document.getElementById("realtimeEditor"),
//         {
//           mode: { name: "javascript", json: true },
//           theme: "dracula",
//           autoCloseTags: true,
//           autoCloseBrackets: true,
//           lineNumbers: true,
//         }
//       );
//       // for sync the code
//       editorRef.current = editor;

//       editor.setSize(null, "100%");
//       editorRef.current.on("change", (instance, changes) => {
//         // console.log("changes", instance ,  changes );
//         const { origin } = changes;
//         const code = instance.getValue(); // code has value which we write
//         onCodeChange(code);
//         if (origin !== "setValue") {
//           socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//             roomId,
//             code,
//           });
//         }
//       });
//     };

//     init();
//   }, []);

//   // data receive from server
//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null) {
//           editorRef.current.setValue(code);
//         }
//       });
//     }
//     return () => {
//       socketRef.current.off(ACTIONS.CODE_CHANGE);
//     };
//   }, [socketRef.current]);

//   return (
//     <div style={{ height: "600px" }}>
//       <textarea id="realtimeEditor"></textarea>
//     </div>
//   );
// }

// export default Editor;
// import React, { useEffect, useRef } from "react";
// import "codemirror/mode/javascript/javascript";
// import "codemirror/theme/dracula.css";
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";
// import "codemirror/lib/codemirror.css";
// import CodeMirror from "codemirror";
// import { ACTIONS } from "../Actions";

// function Editor({ socketRef, roomId, onCodeChange }) {
//   const editorRef = useRef(null);
//   const fileInputRef = useRef(null); // Ref for file input

//   useEffect(() => {
//     const init = async () => {
//       const editor = CodeMirror.fromTextArea(
//         document.getElementById("realtimeEditor"),
//         {
//           mode: { name: "javascript", json: true },
//           theme: "dracula",
//           autoCloseTags: true,
//           autoCloseBrackets: true,
//           lineNumbers: true,
//         }
//       );

//       editorRef.current = editor;
//       editor.setSize(null, "100%");
//       editorRef.current.on("change", (instance, changes) => {
//         const { origin } = changes;
//         const code = instance.getValue();
//         onCodeChange(code);
//         if (origin !== "setValue") {
//           socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//             roomId,
//             code,
//           });
//         }
//       });
//     };

//     init();
//   }, []);

//   // Handle incoming code changes from the server
//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null) {
//           editorRef.current.setValue(code);
//         }
//       });
//     }
//     return () => {
//       socketRef.current.off(ACTIONS.CODE_CHANGE);
//     };
//   }, [socketRef.current]);

//   // Handle file input and set the file's content to the editor
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const fileContent = e.target.result;
//         editorRef.current.setValue(fileContent);
//         socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//           roomId,
//           code: fileContent,
//         });
//       };
//       reader.readAsText(file);
//     }
//   };

//   // Trigger file input on button click
//   const handleFileInputClick = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <div style={{ height: "600px" }}>
//       <textarea id="realtimeEditor"></textarea>

//       {/* Hidden file input */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         onChange={handleFileChange}
//         accept=".txt,.js,.py,.cpp,.java"
//       />

//       {/* Button to open file manager */}
//       <button onClick={handleFileInputClick} style={{ marginTop: "10px" }}>
//         Choose File
//       </button>
//     </div>
//   );
// }

// export default Editor;



// import React, { useEffect, useRef } from "react";
// import "codemirror/mode/javascript/javascript";
// import "codemirror/theme/dracula.css";
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";
// import "codemirror/lib/codemirror.css";
// import CodeMirror from "codemirror";
// import { ACTIONS } from "../Actions";

// function Editor({ socketRef, roomId, onCodeChange }) {
//   const editorRef = useRef(null);
//   const fileInputRef = useRef(null); // Ref for file input

//   useEffect(() => {
//     const init = async () => {
//       const editor = CodeMirror.fromTextArea(
//         document.getElementById("realtimeEditor"),
//         {
//           mode: { name: "javascript", json: true },
//           theme: "dracula",
//           autoCloseTags: true,
//           autoCloseBrackets: true,
//           lineNumbers: true,
//         }
//       );

//       editorRef.current = editor;
//       editor.setSize(null, "100%");
//       editorRef.current.on("change", (instance, changes) => {
//         const { origin } = changes;
//         const code = instance.getValue();
//         onCodeChange(code);
//         if (origin !== "setValue") {
//           socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//             roomId,
//             code,
//           });
//         }
//       });
//     };

//     init();
//   }, [onCodeChange, roomId, socketRef]); // Added dependencies

//   // Handle incoming code changes from the server
//   useEffect(() => {
//     const handleCodeChange = ({ code }) => {
//       if (code !== null) {
//         editorRef.current.setValue(code);
//       }
//     };

//     const socket = socketRef.current; // Copy the ref value to a local variable
//     if (socket) {
//       socket.on(ACTIONS.CODE_CHANGE, handleCodeChange);
//     }

//     // Cleanup function
//     return () => {
//       if (socket) {
//         socket.off(ACTIONS.CODE_CHANGE, handleCodeChange);
//       }
//     };
//   }, [socketRef]); // Included only socketRef as a dependency

//   // Handle file input and set the file's content to the editor
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const fileContent = e.target.result;
//         editorRef.current.setValue(fileContent);
//         socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//           roomId,
//           code: fileContent,
//         });
//       };
//       reader.readAsText(file);
//     }
//   };

//   // Trigger file input on button click
//   const handleFileInputClick = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <div style={{ height: "600px" }}>
//       <textarea id="realtimeEditor"></textarea>

//       {/* Hidden file input */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         onChange={handleFileChange}
//         accept=".txt,.js,.py,.cpp,.java"
//       />

//       {/* Button to open file manager */}
//       <button onClick={handleFileInputClick} style={{ marginTop: "10px" }}>
//         Choose File
//       </button>
//     </div>
//   );
// }

// export default Editor;


// import React, { useEffect, useRef } from "react";
// import "codemirror/mode/javascript/javascript"; // You can add more modes here if needed
// import "codemirror/theme/dracula.css"; // You can change the theme if needed
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";
// import "codemirror/lib/codemirror.css";
// import CodeMirror from "codemirror";
// import { ACTIONS } from "../Actions"; // Importing ACTIONS for socket events

// function Editor({ socketRef, roomId, onCodeChange }) {
//   const editorRef = useRef(null);

//   useEffect(() => {
//     // Initialize CodeMirror editor
//     const initEditor = () => {
//       const editor = CodeMirror.fromTextArea(
//         document.getElementById("realtimeEditor"),
//         {
//           mode: { name: "javascript", json: true }, // You can dynamically pass this mode if multiple languages are supported
//           theme: "dracula",
//           autoCloseTags: true,
//           autoCloseBrackets: true,
//           lineNumbers: true, // Display line numbers for better readability
//         }
//       );

//       editorRef.current = editor; // Store the editor instance

//       editor.setSize(null, "100%"); // Set the size of the editor
//       editor.on("change", (instance, changes) => {
//         const { origin } = changes;
//         const code = instance.getValue(); // Get the current code from the editor
//         onCodeChange(code); // Pass the new code to the parent component

//         if (origin !== "setValue") {
//           // Only emit the code change if it's not from "setValue" (to avoid looping)
//           socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//             roomId,
//             code,
//           });
//         }
//       });
//     };

//     initEditor();

//     return () => {
//       if (editorRef.current) {
//         editorRef.current.toTextArea(); // Clean up the editor instance on unmount
//       }
//     };
//   }, [onCodeChange, roomId, socketRef]);

//   // Listen for code changes from the socket server
//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null && editorRef.current) {
//           const currentCode = editorRef.current.getValue();
//           if (currentCode !== code) {
//             editorRef.current.setValue(code); // Sync the code with the received data
//           }
//         }
//       });
//     }

//     // Cleanup the socket listener when component unmounts
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off(ACTIONS.CODE_CHANGE);
//       }
//     };
//   }, [socketRef]);

//   return (
//     <div style={{ height: "100%", width: "100%" }}>
//       <textarea id="realtimeEditor" style={{ display: "none" }}></textarea>
//     </div>
//   );
// }

// export default Editor;
// import React, { useEffect, useRef } from "react";
// import CodeMirror from "codemirror";
// import "codemirror/lib/codemirror.css"; // Import CodeMirror styles
// import "codemirror/theme/dracula.css"; // Import a theme (e.g., Dracula)
// import "codemirror/mode/javascript/javascript"; // Import JavaScript mode
// import "codemirror/mode/python/python"; // Import Python mode
// import "codemirror/mode/clike/clike"; // Import C/C++ mode
// // Import other modes as necessary

// const Editor = ({ socketRef, roomId, onCodeChange, code, selectedLanguage }) => {
//   const editorRef = useRef(null);
//   const isMount = useRef(false);

//   useEffect(() => {
//     const initEditor = () => {
//       editorRef.current = CodeMirror.fromTextArea(document.getElementById("realtimeEditor"), {
//         mode: selectedLanguage, // Set mode based on selected language
//         theme: "dracula",
//         lineNumbers: true,
//         lineWrapping: true,
//         autoCloseBrackets: true,
//         autoCloseTags: true,
//       });

//       // Code change listener
//       editorRef.current.on("change", (editor) => {
//         const updatedCode = editor.getValue();
//         onCodeChange(updatedCode); // Sync code change with parent component
//         socketRef.current.emit("codeChange", { roomId, code: updatedCode }); // Emit change to server
//       });
//     };

//     initEditor();

//     return () => {
//       if (editorRef.current) {
//         editorRef.current.toTextArea(); // Clean up editor instance
//       }
//     };
//   }, [onCodeChange, socketRef, roomId, selectedLanguage]);

//   useEffect(() => {
//     if (isMount.current) {
//       editorRef.current.setValue(code); // Update editor with new code from props
//     } else {
//       isMount.current = true;
//     }
//   }, [code]);

//   useEffect(() => {
//     if (editorRef.current) {
//       editorRef.current.setOption("mode", selectedLanguage); // Update the mode based on selected language
//     }
//   }, [selectedLanguage]);

//   return (
//     <div>
//       <textarea id="realtimeEditor" style={{ display: "none" }}></textarea> {/* Hidden textarea for CodeMirror */}
//     </div>
//   );
// };

// export default Editor;
// import React, { useEffect, useRef } from "react";
// import "codemirror/mode/javascript/javascript"; // You can add more modes here if needed
// import "codemirror/theme/dracula.css"; // You can change the theme if needed
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";
// import "codemirror/lib/codemirror.css";
// import CodeMirror from "codemirror";
// import { ACTIONS } from "../Actions"; // Importing ACTIONS for socket events
// //import { ACTIONS } from '../Actions';


// function Editor({ socketRef, roomId, onCodeChange }) {
//   const editorRef = useRef(null);

//   useEffect(() => {
//     // Initialize CodeMirror editor
//     const initEditor = () => {
//       const editor = CodeMirror.fromTextArea(
//         document.getElementById("realtimeEditor"),
//         {
//           mode: { name: "javascript", json: true }, // You can dynamically pass this mode if multiple languages are supported
//           theme: "dracula",
//           autoCloseTags: true,
//           autoCloseBrackets: true,
//           lineNumbers: true, // Display line numbers for better readability
//         }
//       );

//       editorRef.current = editor; // Store the editor instance

//       editor.setSize(null, "100%"); // Set the size of the editor
//       editor.on("change", (instance, changes) => {
//         const { origin } = changes;
//         const code = instance.getValue(); // Get the current code from the editor
//         onCodeChange(code); // Pass the new code to the parent component

//         if (origin !== "setValue") {
//           // Only emit the code change if it's not from "setValue" (to avoid looping)
//           socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//             roomId,
//             code,
//           });
//         }
//       });
//     };

//     initEditor();

//     return () => {
//       if (editorRef.current) {
//         editorRef.current.toTextArea(); // Clean up the editor instance on unmount
//       }
//     };
//   }, [onCodeChange, roomId, socketRef]);

//   // Listen for code changes from the socket server
//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null && editorRef.current) {
//           const currentCode = editorRef.current.getValue();
//           if (currentCode !== code) {
//             editorRef.current.setValue(code); // Sync the code with the received data
//           }
//         }
//       });
//     }

//     // Cleanup the socket listener when component unmounts
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off(ACTIONS.CODE_CHANGE);
//       }
//     };
//   }, [socketRef]);

//   // Function to handle file upload and read the content
//   const handleFileChange = (event) => {
//     const file = event.target.files[0]; // Get the first file
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const content = e.target.result; // Get file content
//         if (editorRef.current) {
//           editorRef.current.setValue(content); // Set the content in the editor
//         }
//       };
//       reader.readAsText(file); // Read the file as text
//     }
//   };

//   return (
//     <div style={{ height: "100%", width: "100%" }}>
//       <input
//         type="file"
//         accept=".js,.py,.cpp" // Accept specific file types; you can modify this as needed
//         onChange={handleFileChange}
//         style={{ marginBottom: "10px" }}
//       />
//       <textarea id="realtimeEditor" style={{ display: "none" }}></textarea>
//     </div>
//   );
// }

// export default Editor;
// import React, { useEffect, useRef } from "react";
// import Codemirror from "codemirror";
// import "codemirror/lib/codemirror.css";
// import "codemirror/theme/dracula.css";
// import "codemirror/mode/python/python";
// import "codemirror/mode/javascript/javascript";
// import "codemirror/mode/clike/clike"; // for C, C++, Java
// import "codemirror/mode/ruby/ruby";
// import "codemirror/mode/php/php";
// import "codemirror/mode/sql/sql";
// import "codemirror/mode/swift/swift";
// import "codemirror/mode/rust/rust";
// import "codemirror/mode/go/go";
// import "codemirror/mode/r/r";
// import "codemirror/mode/pascal/pascal";
// import "codemirror/addon/edit/closebrackets";
// import "codemirror/addon/edit/matchbrackets";
// import { ACTIONS } from "../Actions";

// const Editor = ({ socketRef, roomId, onCodeChange, code }) => {
//   const editorRef = useRef(null);

//   useEffect(() => {
//     // Initialize CodeMirror editor
//     editorRef.current = Codemirror.fromTextArea(document.getElementById("realtimeEditor"), {
//       mode: "javascript", // Set a default mode; can be updated based on selected language
//       theme: "dracula",
//       lineNumbers: true,
//       autoCloseBrackets: true,
//       matchBrackets: true,
//       indentUnit: 2,
//       tabSize: 2,
//       viewportMargin: Infinity, // Makes the editor full height
//     });

//     // Set initial code in the editor
//     editorRef.current.setValue(code || "");

//     // Handle real-time code change in the editor
//     editorRef.current.on("change", (instance) => {
//       const updatedCode = instance.getValue();
//       onCodeChange(updatedCode); // Emit code change via prop

//       // Emit code change to other clients via socket
//       socketRef.current.emit(ACTIONS.CODE_CHANGE, { code: updatedCode, roomId });
//     });

//     return () => {
//       editorRef.current.toTextArea(); // Cleanup when component unmounts
//     };
//   }, [code, onCodeChange, socketRef, roomId]);

//   useEffect(() => {
//     if (socketRef.current) {
//       // Listen for code sync updates from the server
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== editorRef.current.getValue()) {
//           editorRef.current.setValue(code); // Set the code in the editor
//         }
//       });
//     }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off(ACTIONS.CODE_CHANGE);
//       }
//     };
//   }, [socketRef]);

//   return (
//     <div className="editor-container" style={{ flex: 1, height: '100%', width: '100%' }}>
//       <textarea id="realtimeEditor" style={{ display: 'none' }} /> {/* Hidden textarea for CodeMirror */}
//     </div>
//   );
// };

// export default Editor;
// import React, { useEffect, useRef } from "react";
// import "codemirror/mode/javascript/javascript";
// import "codemirror/theme/dracula.css";
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";
// import "codemirror/lib/codemirror.css";
// import CodeMirror from "codemirror";
// import { ACTIONS } from "../Actions";

// function Editor({ socketRef, roomId, onCodeChange }) {
//   const editorRef = useRef(null);

//   useEffect(() => {
//     const initEditor = () => {
//       const editor = CodeMirror.fromTextArea(
//         document.getElementById("realtimeEditor"),
//         {
//           mode: { name: "javascript", json: true },
//           theme: "dracula",
//           autoCloseTags: true,
//           autoCloseBrackets: true,
//           lineNumbers: true,
//         }
//       );

//       editorRef.current = editor;

//       editor.setSize(null, "100%");
//       editor.on("change", (instance, changes) => {
//         const { origin } = changes;
//         const code = instance.getValue();
//         onCodeChange(code);

//         if (origin !== "setValue") {
//           socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
//         }
//       });
//     };

//     initEditor();

//     return () => {
//       if (editorRef.current) {
//         editorRef.current.toTextArea();
//       }
//     };
//   }, [onCodeChange, roomId, socketRef]);

//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null && editorRef.current) {
//           const currentCode = editorRef.current.getValue();
//           if (currentCode !== code) {
//             editorRef.current.setValue(code);
//           }
//         }
//       });
//     }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off(ACTIONS.CODE_CHANGE);
//       }
//     };
//   }, [socketRef]);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const content = e.target.result;
//         if (editorRef.current) {
//           editorRef.current.setValue(content);
//         }
//       };
//       reader.readAsText(file);
//     }
//   };

//   return (
//     <div style={{ height: "100%", width: "100%" }}>
//       <input
//         type="file"
//         accept=".js,.py,.cpp"
//         onChange={handleFileChange}
//         style={{ marginBottom: "10px" }}
//       />
//       <textarea id="realtimeEditor" style={{ display: "none" }}></textarea>
//     </div>
//   );
// }

// export default Editor;




//final

import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import { ACTIONS } from "../Actions";

function Editor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null); // Ref for file input

  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current = editor;
      editor.setSize(null, "100%");
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    };

    init();
  }, []);

  // Handle incoming code changes from the server
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  // Handle file input and set the file's content to the editor
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        editorRef.current.setValue(fileContent);
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code: fileContent,
        });
      };
      reader.readAsText(file);
    }
  };

  // Trigger file input on button click
  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ height: "600px" }}>
      <textarea id="realtimeEditor"></textarea>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".txt,.js,.py,.cpp,.java"
      />

      {/* Button to open file manager */}
      <button onClick={handleFileInputClick} style={{ marginTop: "10px" }}>
        Choose File
      </button>
    </div>
  );
}

export default Editor;