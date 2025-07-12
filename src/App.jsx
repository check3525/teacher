import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  Link,
} from 'react-router-dom';

import chatIcon from './assets/chat.svg';
import historyIcon from './assets/history.svg';
import homeIcon from './assets/home.svg';
import profileIcon from './assets/profile.svg';
import helpIcon from './assets/help.svg';


function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const [keyboardOffset, setKeyboardOffset] = useState(140);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand(); // Раскрытие на весь экран
    }

    const viewport = window.visualViewport;
    const handleResize = () => {
      const offset = window.innerHeight - viewport.height;
      setIsKeyboardVisible(offset > 100);
      setKeyboardOffset(offset > 100 ? offset + 20 : 140);
    };

    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }, []);


  const currentPath = location.pathname;

  return (
    <div className="app">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage keyboardOffset={keyboardOffset} />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* Добавим обработку несуществующих маршрутов */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <div className={`bottom-menu ${isKeyboardVisible ? 'hidden' : ''}`}>
        <MenuItem icon={chatIcon} label="Запросы" path="/chat" currentPath={currentPath} />
        <MenuItem icon={historyIcon} label="История" path="/history" currentPath={currentPath}/>
        <MenuItem icon={homeIcon} label="Главная" path="/" currentPath={currentPath}  />
        <MenuItem icon={profileIcon} label="Профиль" path="/profile" currentPath={currentPath}  />
        <MenuItem icon={helpIcon} label="Помощь" path="/help" currentPath={currentPath}  />
      </div>
    </div>
  );
}


function MenuItem({ icon, label, path, currentPath }) {
  const active = currentPath === path;

  return (
    <Link to={path} className="menu-item-link">
      <div className="menu-item">
        <div className={`menu-icon ${active ? 'active' : ''}`}>
          <img
            src={icon}
            alt={label}
            className={`icon-image ${active ? 'white-icon' : ''}`}
          />
        </div>
        <div className={`menu-label ${active ? 'active-label' : ''}`}>
          {label}
        </div>
      </div>
    </Link>
  );
}

function HomePage({ keyboardOffset }) {
  const [input, setInput] = useState('');
  const isInputFilled = input.trim().length > 0;

  return (
    <>
      <div className="textarea-wrapper">
        <textarea
          className="textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Напиши сюда задачу или вопрос\nпо любому предмету.\nРешу, объясню и покажу\nвсе по шагам.`}
        />
      </div>

      <div className="solve-task-button" style={{ bottom: `${keyboardOffset}px` }}>
        <button className={isInputFilled ? 'active' : ''}>Решить задачу</button>
      </div>
    </>
  );
}

function ProfilePage() {
  return <div style={{padding:"20px 16px", fontSize: "20px", color: "#0C0C0C", fontWeight: "500"}}>Профиль</div>;
}

function ChatPage() {
  return <div style={{padding:"20px 16px", fontSize: "20px", color: "#0C0C0C", fontWeight: "500"}}>Запросы</div>;
}

function HistoryPage() {
  return <div style={{padding:"20px 16px", fontSize: "20px", color: "#0C0C0C", fontWeight: "500"}}>История</div>;
}

function HelpPage() {
  return <div style={{padding:"20px 16px", fontSize: "20px", color: "#0C0C0C", fontWeight: "500"}}>Помощь</div>;
}

export default App;

