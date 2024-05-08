import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserForm from './pages/forms';
import UserInfo from './pages/userInfo';

import './css/globals.css';

function App() {
  return (
    <main className="App container py-4 mx-auto">
        <Router>
          <Routes>
            <Route path="/" element={<UserForm />} />
            <Route path="/user-info" element={<UserInfo />} />
          </Routes>
        </Router>
    </main>
  );
}

export default App;
