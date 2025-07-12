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
import stone from "./stone.png"
import plus from "./plus.svg"


function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand(); // Раскрытие на весь экран
    }
  }, []);


  const currentPath = location.pathname;

  return (
    <div className="app">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* Добавим обработку несуществующих маршрутов */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <div className={`bottom-menu`}>
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

function HomePage() {
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

<div className="balance-wrapper">
  <div className="balance-top">
    <span className="balance-label">Мой баланс</span>
    <img src={plus}/>
  </div>

  <div className="bottom-action-row">
    <div className="crystal-block">
      <img src={stone} alt="crystal" className="crystal-icon" />
      <span className="crystal-count">5</span>
    </div>
    <div className="solve-task-button-inline">
      <button className={isInputFilled ? 'active' : ''}>Решить задачу</button>
    </div>
  </div>
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

