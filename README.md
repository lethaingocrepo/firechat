# FireChat

FireChat is a real-time chat application built with React and Firebase.

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/firechat.git
    cd firechat
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `firebaseConfig.js` file in the `src` directory with your Firebase configuration:
    ```javascript
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
    import { getAuth } from "firebase/auth";
    import { getStorage } from "firebase/storage";

    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        databaseURL: "YOUR_DATABASE_URL",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);

    export { db, auth, storage };
    ```

4. Start the development server:
    ```bash
    npm start
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Features

- Real-time messaging
- Google authentication
- File upload and sharing

## License

This project is licensed under the MIT License.
