import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from './firebaseConfig';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribeMessages = onSnapshot(query(collection(db, "messages"), orderBy("timestamp")), (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeMessages();
      unsubscribeUsers();
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
    await addDoc(collection(db, "users"), {
      uid: result.user.uid,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    });
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() || file) {
      let fileURL = null;
      if (file) {
        const fileRef = ref(storage, `files/${file.name}`);
        await uploadBytes(fileRef, file);
        fileURL = await getDownloadURL(fileRef);
      }
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        fileURL: fileURL,
        timestamp: new Date(),
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      setNewMessage("");
      setFile(null);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <div className="chat-layout">
            <div className="sidebar">
              <button className="logout-button" onClick={handleLogout}>Logout</button>
              <h3>Users</h3>
              <ul>
                {users.map(u => (
                  <li key={u.id}>
                    <img src={u.photoURL} alt={u.displayName} className="avatar" />
                    {u.displayName}
                  </li>
                ))}
              </ul>
            </div>
            <div className="chat-container">
              <div className="messages">
                {messages.length > 0 ? (
                  messages.map(message => (
                    <div key={message.id} className="message">
                      <img src={message.photoURL} alt={message.displayName} className="avatar" />
                      <p><strong>{message.displayName}:</strong> {message.text}</p>
                      {message.fileURL && <a href={message.fileURL} target="_blank" rel="noopener noreferrer">View File</a>}
                    </div>
                  ))
                ) : (
                  <p>No messages yet</p>
                )}
              </div>
              <div className="message-input">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                />
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="login-container">
            <h2>Welcome to FireChat</h2>
            <button className="login-button" onClick={handleLogin}>Login with Google</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
