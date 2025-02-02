import React from "react";
import './styles.css';
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { EventProvider } from "./contexts/EventContext";

// export const BASE_URL = 'http://localhost:5000';
export const BASE_URL = 'https://event-management-e3pr.onrender.com';
const App: React.FC = () => {
    return <div className="App">
       <EventProvider>
          <Toaster />
          <AppRoutes />
       </EventProvider>
    </div>
};

export default App;
