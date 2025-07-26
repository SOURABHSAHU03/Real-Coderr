// import React, { useEffect, useRef, useState } from "react";
// import Client from "./Client";
// import Editor from "./Editor";
// import { initSocket } from "../Socket";
// import { ACTIONS } from "../Actions";
// import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import { saveAs } from "file-saver";

// function EditorPage() {
//   const [clients, setClients] = useState([]);
//   const [output, setOutput] = useState("");
//   const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
//   const [isCompiling, setIsCompiling] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState("python3");
//   const codeRef = useRef("");
  
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const socketRef = useRef(null);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         socketRef.current = await initSocket();

//         const handleErrors = (err) => {
//           console.log("Error", err);
//           toast.error("Socket connection failed, Try again later");
//           navigate("/");
//         };

//         socketRef.current.on("connect_error", handleErrors);
//         socketRef.current.on("connect_failed", handleErrors);

//         socketRef.current.emit(ACTIONS.JOIN, {
//           roomId,
//           username: location.state?.username,
//         });

//         socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
//           if (username !== location.state?.username) {
//             toast.success(`${username} joined the room.`);
//           }
//           setClients(clients);
//           socketRef.current.emit(ACTIONS.SYNC_CODE, {
//             code: codeRef.current,
//             socketId,
//           });
//         });

//         socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//           toast.success(`${username} left the room.`);
//           setClients((prev) => prev.filter((client) => client.socketId !== socketId));
//         });
//       } catch (error) {
//         console.error("Failed to initialize socket", error);
//       }
//     };

//     init();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current.off(ACTIONS.JOINED);
//         socketRef.current.off(ACTIONS.DISCONNECTED);
//       }
//     };
//   }, [roomId, location.state?.username, navigate]);

//   if (!location.state) {
//     return <Navigate to="/" />;
//   }

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success("Room ID is copied");
//     } catch (error) {
//       console.log(error);
//       toast.error("Unable to copy the room ID");
//     }
//   };

//   const leaveRoom = async () => {
//     navigate("/");
//   };

//   const runCode = async () => {
//     setIsCompiling(true);
//     try {
//       const response = await axios.post("http://localhost:5000/compile", {
//         code: codeRef.current,
//         language: selectedLanguage,
//       });
//       setOutput(response.data.output || JSON.stringify(response.data));
//     } catch (error) {
//       console.error("Error compiling code:", error);
//       setOutput(error.response?.data?.error || "An error occurred");
//     } finally {
//       setIsCompiling(false);
//     }
//   };

//   const toggleCompileWindow = () => {
//     setIsCompileWindowOpen(!isCompileWindowOpen);
//   };

//   const saveCodeHandler = () => {
//     const blob = new Blob([codeRef.current || ""], { type: "text/plain;charset=utf-8" });
//     saveAs(blob, "code.txt");
//   };

//   const importCodeHandler = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       codeRef.current = e.target.result;
//     };
//     if (file) {
//       reader.readAsText(file);
//     }
//   };

//   return (
//     <div className="container-fluid vh-100 d-flex flex-column">
//       <div className="row flex-grow-1">
//         <div className="col-md-2 bg-dark text-light d-flex flex-column">
//           <img
//             src="/images/codecasti.png"
//             alt="Logo"
//             className="mx-auto"
//             style={{ maxWidth: "120px", marginTop: "1rem" }}
//           />
//           <hr style={{ marginTop: "1.5rem" }} />

//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>

//           <hr />
//           <div className="mt-auto mb-3">
//             <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
//               Copy Room ID
//             </button>
//             <button className="btn btn-danger w-100" onClick={leaveRoom}>
//               Leave Room
//             </button>
//           </div>
//         </div>

//         <div className="col-md-10 text-light d-flex flex-column">
//           <div className="bg-dark p-2 d-flex justify-content-end align-items-center">
//             <select
//               className="form-select w-auto me-3"
//               value={selectedLanguage}
//               onChange={(e) => setSelectedLanguage(e.target.value)}
//             >
//               {["python3", "java", "cpp", "nodejs"].map((lang) => (
//                 <option key={lang} value={lang}>
//                   {lang}
//                 </option>
//               ))}
//             </select>

//             <button
//               onClick={saveCodeHandler}
//               className="p-2"
//               style={{ backgroundColor: "white", padding: "4px", marginRight: "6px", color: "black", border: "1px solid black", borderRadius: "12px" }}
//             >
//               Save Code
//             </button>

//             <input
//               type="file"
//               id="fileInput"
//               style={{ display: "none" }}
//               accept=".txt,.js,.py,.cpp,.java"
//               onChange={importCodeHandler}
//             />

//             <button
//               className="btn btn-primary"
//               onClick={() => document.getElementById("fileInput").click()}
//             >
//               Import Code
//             </button>

//             <button
//               className="btn btn-success ms-3"
//               onClick={runCode}
//               disabled={isCompiling}
//             >
//               {isCompiling ? "Compiling..." : "Run Code"}
//             </button>

//             <button
//               className="btn btn-warning ms-3"
//               onClick={toggleCompileWindow}
//             >
//               {isCompileWindowOpen ? "Hide Output" : "Show Output"}
//             </button>
//           </div>

//           {isCompileWindowOpen && (
//             <div className="bg-light text-dark p-3 rounded mt-2">
//               <h5>Output:</h5>
//               <pre>{output}</pre>
//             </div>
//           )}

//           <Editor
//             socketRef={socketRef}
//             roomId={roomId}
//             onCodeChange={(code) => (codeRef.current = code)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditorPage;
// import React, { useEffect, useRef, useState } from "react";
// import Client from "./Client";
// import Editor from "./Editor";
// import { initSocket } from "../Socket";
// import { ACTIONS } from "../Actions";
// import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import { saveAs } from "file-saver";

// function EditorPage() {
//   const [clients, setClients] = useState([]);
//   const [output, setOutput] = useState("");
//   const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
//   const [isCompiling, setIsCompiling] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState("python3");
//   const codeRef = useRef("");

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const socketRef = useRef(null);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         socketRef.current = await initSocket();

//         const handleErrors = (err) => {
//           console.log("Error", err);
//           toast.error("Socket connection failed, Try again later");
//           navigate("/");
//         };

//         socketRef.current.on("connect_error", handleErrors);
//         socketRef.current.on("connect_failed", handleErrors);

//         socketRef.current.emit(ACTIONS.JOIN, {
//           roomId,
//           username: location.state?.username,
//         });

//         socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
//           if (username !== location.state?.username) {
//             toast.success(`${username} joined the room.`);
//           }
//           setClients(clients);
//           socketRef.current.emit(ACTIONS.SYNC_CODE, {
//             code: codeRef.current,
//             socketId,
//           });
//         });

//         socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//           toast.success(`${username} left the room.`);
//           setClients((prev) => prev.filter((client) => client.socketId !== socketId));
//         });
//       } catch (error) {
//         console.error("Failed to initialize socket", error);
//       }
//     };

//     init();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current.off(ACTIONS.JOINED);
//         socketRef.current.off(ACTIONS.DISCONNECTED);
//       }
//     };
//   }, [roomId, location.state?.username, navigate]);

//   if (!location.state) {
//     return <Navigate to="/" />;
//   }

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success("Room ID is copied");
//     } catch (error) {
//       console.log(error);
//       toast.error("Unable to copy the room ID");
//     }
//   };

//   const leaveRoom = async () => {
//     navigate("/");
//   };

//   const runCode = async () => {
//     setIsCompiling(true);
//     try {
//       const response = await axios.post("http://localhost:5000/compile", {
//         code: codeRef.current,
//         language: selectedLanguage,
//       });
//       setOutput(response.data.output || JSON.stringify(response.data));
//     } catch (error) {
//       console.error("Error compiling code:", error);
//       setOutput(error.response?.data?.error || "An error occurred");
//     } finally {
//       setIsCompiling(false);
//     }
//   };

//   const toggleCompileWindow = () => {
//     setIsCompileWindowOpen(!isCompileWindowOpen);
//   };

//   const saveCodeHandler = () => {
//     const blob = new Blob([codeRef.current || ""], { type: "text/plain;charset=utf-8" });
//     saveAs(blob, "code.txt");
//   };

//   const importCodeHandler = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       codeRef.current = e.target.result;
//     };
//     if (file) {
//       reader.readAsText(file);
//     }
//   };

//   return (
//     <div className="container-fluid vh-100 d-flex flex-column">
//       <div className="row flex-grow-1">
//         <div className="col-md-2 bg-dark text-light d-flex flex-column">
//           <img
//             src="/images/codecasti.png"
//             alt="Logo"
//             className="mx-auto"
//             style={{ maxWidth: "120px", marginTop: "1rem" }}
//           />
//           <hr style={{ marginTop: "1.5rem" }} />

//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>

//           <hr />
//           <div className="mt-auto mb-3">
//             <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
//               Copy Room ID
//             </button>
//             <button className="btn btn-danger w-100" onClick={leaveRoom}>
//               Leave Room
//             </button>
//           </div>
//         </div>

//         <div className="col-md-10 text-light d-flex flex-column">
//           <div className="bg-dark p-2 d-flex justify-content-end align-items-center">
//             <select
//               className="form-select w-auto me-3"
//               value={selectedLanguage}
//               onChange={(e) => setSelectedLanguage(e.target.value)}
//             >
//               {["python3", "java", "cpp", "nodejs"].map((lang) => (
//                 <option key={lang} value={lang}>
//                   {lang}
//                 </option>
//               ))}
//             </select>

//             <button
//               onClick={saveCodeHandler}
//               className="p-2"
//               style={{ backgroundColor: "white", padding: "4px", marginRight: "6px", color: "black", border: "1px solid black", borderRadius: "12px" }}
//             >
//               Save Code
//             </button>

//             <input
//               type="file"
//               id="fileInput"
//               style={{ display: "none" }}
//               accept=".txt,.js,.py,.cpp,.java"
//               onChange={importCodeHandler}
//             />

//             <button
//               className="btn btn-primary"
//               onClick={() => document.getElementById("fileInput").click()}
//             >
//               Import Code
//             </button>

//             <button
//               className="btn btn-success ms-3"
//               onClick={runCode}
//               disabled={isCompiling}
//             >
//               {isCompiling ? "Compiling..." : "Run Code"}
//             </button>

//             <button
//               className="btn btn-warning ms-3"
//               onClick={toggleCompileWindow}
//             >
//               {isCompileWindowOpen ? "Hide Output" : "Show Output"}
//             </button>
//           </div>

//           {isCompileWindowOpen && (
//             <div className="bg-light text-dark p-3 rounded mt-2">
//               <h5>Output:</h5>
//               <pre>{output}</pre>
//             </div>
//           )}

//           <Editor
//             socketRef={socketRef}
//             roomId={roomId}
//             onCodeChange={(code) => (codeRef.current = code)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditorPage;
// import React, { useEffect, useRef, useState } from "react";
// import Client from "./Client";
// import Editor from "./Editor";
// import { initSocket } from "../Socket";
// import { ACTIONS } from "../Actions";
// import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import { saveAs } from "file-saver";

// function EditorPage() {
//   const [clients, setClients] = useState([]);
//   const [output, setOutput] = useState("");
//   const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
//   const [isCompiling, setIsCompiling] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState("python3");
//   const codeRef = useRef("");

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const socketRef = useRef(null);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         socketRef.current = await initSocket();

//         const handleErrors = (err) => {
//           console.log("Error", err);
//           toast.error("Socket connection failed, Try again later");
//           navigate("/");
//         };

//         socketRef.current.on("connect_error", handleErrors);
//         socketRef.current.on("connect_failed", handleErrors);

//         socketRef.current.emit(ACTIONS.JOIN, {
//           roomId,
//           username: location.state?.username,
//         });

//         socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
//           if (username !== location.state?.username) {
//             toast.success(`${username} joined the room.`);
//           }
//           setClients(clients);
//           socketRef.current.emit(ACTIONS.SYNC_CODE, {
//             code: codeRef.current,
//             socketId,
//           });
//         });

//         socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//           toast.success(`${username} left the room.`);
//           setClients((prev) => prev.filter((client) => client.socketId !== socketId));
//         });
//       } catch (error) {
//         console.error("Failed to initialize socket", error);
//       }
//     };

//     init();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current.off(ACTIONS.JOINED);
//         socketRef.current.off(ACTIONS.DISCONNECTED);
//       }
//     };
//   }, [roomId, location.state?.username, navigate]);

//   if (!location.state) {
//     return <Navigate to="/" />;
//   }

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success("Room ID is copied");
//     } catch (error) {
//       console.log(error);
//       toast.error("Unable to copy the room ID");
//     }
//   };

//   const leaveRoom = async () => {
//     navigate("/");
//   };

//   const runCode = async () => {
//     setIsCompiling(true);
//     try {
//       const response = await axios.post("http://localhost:5000/compile", {
//         code: codeRef.current,
//         language: selectedLanguage,
//       });
//       setOutput(response.data.output || JSON.stringify(response.data));
//     } catch (error) {
//       console.error("Error compiling code:", error);
//       setOutput(error.response?.data?.error || "An error occurred");
//     } finally {
//       setIsCompiling(false);
//     }
//   };

//   const toggleCompileWindow = () => {
//     setIsCompileWindowOpen(!isCompileWindowOpen);
//   };

//   const saveCodeHandler = () => {
//     const blob = new Blob([codeRef.current || ""], { type: "text/plain;charset=utf-8" });
//     saveAs(blob, "code.txt");
//   };

//   const importCodeHandler = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       codeRef.current = e.target.result;
//     };
//     if (file) {
//       reader.readAsText(file);
//     }
//   };

//   return (
//     <div className="container-fluid vh-100 d-flex flex-column">
//       <div className="row flex-grow-1">
//         <div className="col-md-2 bg-dark text-light d-flex flex-column">
//           <img
//             src="/images/codecasti.png"
//             alt="Logo"
//             className="mx-auto"
//             style={{ maxWidth: "120px", marginTop: "1rem" }}
//           />
//           <hr style={{ marginTop: "1.5rem" }} />

//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>

//           <hr />
//           <div className="mt-auto mb-3">
//             <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
//               Copy Room ID
//             </button>
//             <button className="btn btn-danger w-100" onClick={leaveRoom}>
//               Leave Room
//             </button>
//           </div>
//         </div>

//         <div className="col-md-10 text-light d-flex flex-column">
//           <div className="bg-dark p-2 d-flex justify-content-end align-items-center">
//             <select
//               className="form-select w-auto me-3"
//               value={selectedLanguage}
//               onChange={(e) => setSelectedLanguage(e.target.value)}
//             >
//               <option value="python3">Python 3</option>
//               <option value="java">Java</option>
//               <option value="cpp">C++</option>
//               <option value="nodejs">Node.js</option>
//               <option value="c">C</option>
//             </select>

//             <button className="btn btn-primary me-2" onClick={runCode} disabled={isCompiling}>
//               {isCompiling ? "Compiling..." : "Run Code"}
//             </button>

//             <button className="btn btn-warning me-2" onClick={saveCodeHandler}>
//               Save Code
//             </button>

//             <label className="btn btn-info me-2">
//               Import Code
//               <input type="file" hidden onChange={importCodeHandler} />
//             </label>

//             <button className="btn btn-secondary" onClick={toggleCompileWindow}>
//               {isCompileWindowOpen ? "Close Output" : "Show Output"}
//             </button>
//           </div>

//           <Editor
//             socketRef={socketRef}
//             roomId={roomId}
//             onCodeChange={(code) => {
//               codeRef.current = code;
//             }}
//           />

//           {isCompileWindowOpen && (
//             <div className="bg-dark text-light mt-2 p-3" style={{ height: "200px", overflowY: "scroll" }}>
//               <h5>Output:</h5>
//               <pre>{output || "No output available"}</pre>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditorPage;



//final
// import React, { useEffect, useRef, useState } from "react";
// import Client from "./Client";
// import Editor from "./Editor";
// import { initSocket } from "../Socket";
// import { ACTIONS } from "../Actions";
// import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import { saveAs } from "file-saver";

// function EditorPage() {
//   const [clients, setClients] = useState([]);
//   const [output, setOutput] = useState("");
//   const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
//   const [isCompiling, setIsCompiling] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState("python3");
//   const codeRef = useRef("");
  
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const socketRef = useRef(null);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         socketRef.current = await initSocket();

//         const handleErrors = (err) => {
//           console.log("Error", err);
//           toast.error("Socket connection failed, Try again later");
//           navigate("/");
//         };

//         socketRef.current.on("connect_error", handleErrors);
//         socketRef.current.on("connect_failed", handleErrors);

//         socketRef.current.emit(ACTIONS.JOIN, {
//           roomId,
//           username: location.state?.username,
//         });

//         socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
//           if (username !== location.state?.username) {
//             toast.success(`${username} joined the room.`);
//           }
//           setClients(clients);
//           socketRef.current.emit(ACTIONS.SYNC_CODE, {
//             code: codeRef.current,
//             socketId,
//           });
//         });

//         socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//           toast.success(`${username} left the room.`);
//           setClients((prev) => prev.filter((client) => client.socketId !== socketId));
//         });
//       } catch (error) {
//         console.error("Failed to initialize socket", error);
//       }
//     };

//     init();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current.off(ACTIONS.JOINED);
//         socketRef.current.off(ACTIONS.DISCONNECTED);
//       }
//     };
//   }, [roomId, location.state?.username, navigate]);

//   if (!location.state) {
//     return <Navigate to="/" />;
//   }

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success("Room ID is copied");
//     } catch (error) {
//       console.log(error);
//       toast.error("Unable to copy the room ID");
//     }
//   };

//   const leaveRoom = async () => {
//     navigate("/");
//   };

//   const runCode = async () => {
//     setIsCompiling(true);
//     try {
//       const response = await axios.post("http://localhost:5000/compile", {
//         code: codeRef.current,
//         language: selectedLanguage,
//       });
//       setOutput(response.data.output || JSON.stringify(response.data));
//     } catch (error) {
//       console.error("Error compiling code:", error);
//       setOutput(error.response?.data?.error || "An error occurred");
//     } finally {
//       setIsCompiling(false);
//     }
//   };

//   const toggleCompileWindow = () => {
//     setIsCompileWindowOpen(!isCompileWindowOpen);
//   };

//   const saveCodeHandler = () => {
//     const blob = new Blob([codeRef.current || ""], { type: "text/plain;charset=utf-8" });
//     saveAs(blob, "code.txt");
//   };

//   const importCodeHandler = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       codeRef.current = e.target.result;
//     };
//     if (file) {
//       reader.readAsText(file);
//     }
//   };

//   return (
//     <div className="container-fluid vh-100 d-flex flex-column">
//       <div className="row flex-grow-1">
//         <div className="col-md-2 bg-dark text-light d-flex flex-column">
//           <img
//             src="/images/codecasti.png"
//             alt="Logo"
//             className="mx-auto"
//             style={{ maxWidth: "120px", marginTop: "1rem" }}
//           />
//           <hr style={{ marginTop: "1.5rem" }} />

//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>

//           <hr />
//           <div className="mt-auto mb-3">
//             <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
//               Copy Room ID
//             </button>
//             <button className="btn btn-danger w-100" onClick={leaveRoom}>
//               Leave Room
//             </button>
//           </div>
//         </div>

//         <div className="col-md-10 text-light d-flex flex-column">
//           <div className="bg-dark p-2 d-flex justify-content-end align-items-center">
//             <select
//               className="form-select w-auto me-3"
//               value={selectedLanguage}
//               onChange={(e) => setSelectedLanguage(e.target.value)}
//             >
//               {["python3", "java", "cpp", "nodejs"].map((lang) => (
//                 <option key={lang} value={lang}>
//                   {lang}
//                 </option>
//               ))}
//             </select>

//             <button
//               onClick={saveCodeHandler}
//               className="p-2"
//               style={{ backgroundColor: "white", padding: "4px", marginRight: "6px", color: "black", border: "1px solid black", borderRadius: "12px" }}
//             >
//               Save Code
//             </button>

//             <input
//               type="file"
//               id="fileInput"
//               style={{ display: "none" }}
//               accept=".txt,.js,.py,.cpp,.java"
//               onChange={importCodeHandler}
//             />

//             <button
//               className="btn btn-primary"
//               onClick={() => document.getElementById("fileInput").click()}
//             >
//               Import Code
//             </button>

//             <button
//               className="btn btn-success ms-3"
//               onClick={runCode}
//               disabled={isCompiling}
//             >
//               {isCompiling ? "Compiling..." : "Run Code"}
//             </button>

//             <button
//               className="btn btn-warning ms-3"
//               onClick={toggleCompileWindow}
//             >
//               {isCompileWindowOpen ? "Hide Output" : "Show Output"}
//             </button>
//           </div>

//           {isCompileWindowOpen && (
//             <div className="bg-light text-dark p-3 rounded mt-2">
//               <h5>Output:</h5>
//               <pre>{output}</pre>
//             </div>
//           )}

//           <Editor
//             socketRef={socketRef}
//             roomId={roomId}
//             onCodeChange={(code) => (codeRef.current = code)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditorPage;


import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { saveAs } from "file-saver";

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const codeRef = useRef("");

  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();

        const handleErrors = (err) => {
          console.log("Error", err);
          toast.error("Socket connection failed, Try again later");
          navigate("/");
        };

        socketRef.current.on("connect_error", handleErrors);
        socketRef.current.on("connect_failed", handleErrors);

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: location.state?.username,
        });

        socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        });

        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => prev.filter((client) => client.socketId !== socketId));
        });
      } catch (error) {
        console.error("Failed to initialize socket", error);
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, [roomId, location.state?.username, navigate]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID is copied");
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the room ID");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };

  const runCode = async () => {
    setIsCompiling(true);
    try {
      const response = await axios.post("http://localhost:5000/compile", {
        code: codeRef.current,
        language: selectedLanguage,
      });
      setOutput(response.data.output || JSON.stringify(response.data));
    } catch (error) {
      console.error("Error compiling code:", error);
      setOutput(error.response?.data?.error || "An error occurred");
    } finally {
      setIsCompiling(false);
    }
  };

  const toggleCompileWindow = () => {
    setIsCompileWindowOpen(!isCompileWindowOpen);
  };

  const saveCodeHandler = () => {
    const blob = new Blob([codeRef.current || ""], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "code.txt");
  };

  const importCodeHandler = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      codeRef.current = e.target.result;
    };
    if (file) {
      reader.readAsText(file);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <div className="row flex-grow-1">
        <div className="col-md-2 bg-dark text-light d-flex flex-column">
          <img
            src="/images/codecasti.png"
            alt="Logo"
            className="mx-auto"
            style={{ maxWidth: "120px", marginTop: "1rem" }}
          />
          <hr style={{ marginTop: "1.5rem" }} />

          <div className="d-flex flex-column flex-grow-1 overflow-auto">
            <span className="mb-2">Members</span>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>

          <hr />
          <div className="mt-auto mb-3">
            <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
              Copy Room ID
            </button>
            <button className="btn btn-danger w-100" onClick={leaveRoom}>
              Leave Room
            </button>
          </div>
        </div>

        <div className="col-md-10 d-flex flex-column position-relative">
          <div className="bg-dark p-2 d-flex justify-content-end align-items-center">
            <select
              className="form-select w-auto me-3"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {["python3", "java", "cpp", "nodejs"].map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <button
              onClick={saveCodeHandler}
              className="p-2"
              style={{
                backgroundColor: "white",
                padding: "4px",
                marginRight: "6px",
                color: "black",
                border: "1px solid black",
                borderRadius: "12px",
              }}
            >
              Save Code
            </button>

            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              accept=".txt,.js,.py,.cpp,.java"
              onChange={importCodeHandler}
            />

            <button
              className="btn btn-primary"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Import Code
            </button>

            <button
              className="btn btn-success ms-3"
              onClick={runCode}
              disabled={isCompiling}
            >
              {isCompiling ? "Compiling..." : "Run Code"}
            </button>

            <button
              className="btn btn-warning ms-3"
              onClick={toggleCompileWindow}
            >
              {isCompileWindowOpen ? "Hide Output" : "Show Output"}
            </button>
          </div>

          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => (codeRef.current = code)}
          />

          {/* Output window positioned at the bottom */}
          {isCompileWindowOpen && (
            <div
              className="bg-dark text-light p-3 rounded mt-2 position-absolute"
              style={{ bottom: "0", left: "0", right: "0", height: "200px", overflowY: "auto" }}
            >
              <h5>Output:</h5>
              <pre>{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
