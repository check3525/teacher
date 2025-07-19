import { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  useParams,
  Link,
} from 'react-router-dom';

import chatIcon from './assets/chat.svg';
import historyIcon from './assets/history.svg';
import homeIcon from './assets/home.svg';
import profileIcon from './assets/profile.svg';
import helpIcon from './assets/help.svg';
import stone from "./stone.png"
import plus from "./plus.svg"
import teacher from "./teacher.png"


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
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const currentPath = location.pathname;
  const isChatPage = currentPath.startsWith('/chat/'); // <-- проверка

  return (
    <div className="app">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Показываем меню только если не страница чата */}
      {!isChatPage && (
        <div className="bottom-menu">
          <MenuItem icon={chatIcon} label="Запросы" path="/requests" currentPath={currentPath} />
          <MenuItem icon={historyIcon} label="История" path="/history" currentPath={currentPath} />
          <MenuItem icon={homeIcon} label="Главная" path="/" currentPath={currentPath} />
          <MenuItem icon={profileIcon} label="Профиль" path="/profile" currentPath={currentPath} />
          <MenuItem icon={helpIcon} label="Помощь" path="/help" currentPath={currentPath} />
        </div>
      )}
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

  const navigate = useNavigate();

const handleSolveTask = () => {
  if (!isInputFilled) return;

  const chatId = Date.now().toString(); // Уникальный ID (в реальности будет от сервера)

  navigate(`/chat/${chatId}`, {
    state: { userMessage: input.trim() },
  });

  setInput('');
};

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
      <button className={isInputFilled ? 'active' : ''} onClick={handleSolveTask}>Решить задачу</button>
    </div>
  </div>
</div>
    </>
  );
}

function ChatPage() {
  const { chatId } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatContentRef = useRef(null);
  const textareaRef = useRef(null);

  // Прокрутка вниз при появлении новых сообщений
  useEffect(() => {
    const el = chatContentRef.current;
    if (!el) return;

    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    if (isAtBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // Прокрутка вниз при фокусе
  useEffect(() => {
    const handleFocus = () => {
      setTimeout(() => {
        const el = chatContentRef.current;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      }, 300);
    };

    const textarea = textareaRef.current;
    textarea?.addEventListener('focus', handleFocus);

    return () => {
      textarea?.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Telegram WebApp стабильная высота (если доступна)
  useEffect(() => {
    if (window.Telegram?.WebApp?.setViewportStableHeight) {
      window.Telegram.WebApp.setViewportStableHeight(true);
    }
  }, []);

  // Начальное сообщение от пользователя
  useEffect(() => {
    const userMessage = location.state?.userMessage;
    if (userMessage) {
      setMessages([
        { from: 'user', text: userMessage },
        {
          from: 'ai',
          text:
            'Решим задачу по шагам:\n\n1. Маша съела 4 яблока.\n2. Андрей съел на 3 груши больше, чем Маша яблок:\n4+3=7 груш съел Андрей\n\nВсего фруктов:\n4+7=11 фруктов\n✅ Ответ: 11 фруктов было у детей.',
        },
      ]);
    }
  }, [location.state]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text: userMessage }]);
    setInput('');

    const loadingMessageId = Date.now();
    setMessages((prev) => [
      ...prev,
      { from: 'ai', text: '...', loading: true, id: loadingMessageId },
    ]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                ...msg,
                loading: false,
                text:
                  'Решим задачу по шагам:\n\n1. Маша съела 4 яблока.\n2. Андрей съел на 3 груши больше…\n\n✅ Ответ: 11 фруктов.',
              }
            : msg
        )
      );
    }, 2000);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="balance-display">💎 1236</div>
      </div>

      <div className="chat-content" ref={chatContentRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.from}`}>
            {msg.loading ? <TypingDots /> : <div>{msg.text}</div>}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={handleInputChange}
          placeholder="Спросите что-нибудь"
          rows={1}
        />
        <button className="send-button" onClick={handleSend}>
          ↑
        </button>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div class="typing-container">
      <img src={teacher} alt="teacher" class="company-icon"/>
      <div class="typing-dots">
        <span class="dot1"></span>
        <span class="dot2"></span>
        <span class="dot3"></span>
      </div>
    </div>
  );
}
function ProfilePage() {
  return <div style={{padding:"20px 16px", fontSize: "20px", color: "#0C0C0C", fontWeight: "500"}}>

  <div class="profile-card">
    <div class="user-info">
      <div class="user-name">Artem</div>
      <div class="user-id">
        id: 1155353586
      </div>
    </div>
    <div class="balance-info">
      <div class="balance-label">Баланс</div>
      <div class="balance-value">💎 5</div>
    </div>
  </div>
  </div>;
}

function RequestsPage() {
  return <div style={{padding:"20px 16px", fontSize: "20px", color: "#0C0C0C", fontWeight: "500"}}>Запросы</div>;
}

function HistoryPage() {
const arr = [
  {
    id: 0,
    title: `Маша съела 4 яблока, а Андрей на 3 груши больше. Сколько всего фруктов было у детей?`
  },
  {
    id: 1,
    title: `2 лыжника ехали навстречу друг другу со скоростью 10 км/ч`
  },
  {
    id: 2,
    title: `Объясни тему квадратов и корней`
  },
  {
    id: 3,
    title: `Как решать уравнения с двумя переменными?`
  },
  {
    id: 4,
    title: `Покажи пример задачи на проценты с решением`
  },
  {
    id: 5,
    title: `В чём разница между площадью и периметром?`
  },
  {
    id: 6,
    title: `Что такое дроби и как ими пользоваться?`
  },
  {
    id: 7,
    title: `Если поезд выехал в 8:00 и ехал 3 часа, во сколько он приедет?`
  },
  {
    id: 8,
    title: `Проверь моё сочинение на ошибки`
  },
  {
    id: 9,
    title: `Как работает правило умножения вероятностей?`
  },
  {
    id: 10,
    title: `Найди ошибку в решении: 2x + 3 = 7, x = 1`
  },
  {
    id: 11,
    title: `Объясни, как делить угол пополам`
  },
  {
    id: 12,
    title: `Помоги составить план рассказа по теме "Лето" для 3 класса`
  },
  {
    id: 13,
    title: `Чем отличаются амёба и инфузория?`
  },
  {
    id: 14,
    title: `Что такое метафора? Приведи примеры`
  }
];

function truncateText(text, maxLength = 60) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength - 1) + '…' : text;
}
  return <div style={{padding:"20px 16px", fontSize: "20px", color: "#0C0C0C", fontWeight: "500"}}>
    <div className='deleteAllChats'>Удалить все чаты</div>
     <div className="history-scroll-container">
      {arr.map(el => {
        return (
        <div key={el.id} className="historyElementBlock">
          <div className="history-title">{truncateText(el.title, 60)}</div>
          <button className="delete-btn" onClick={() => handleDeleteChat(el.id)}>×</button>
        </div>
        )
      })}
     </div>

  </div>;
}

function HelpPage() {
  return <div style={{padding:"20px 16px", fontSize: "20px", color: "#0C0C0C", fontWeight: "500"}}>Помощь</div>;
}

export default App;

