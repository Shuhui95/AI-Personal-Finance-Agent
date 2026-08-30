import "./Sidebar.css";


function Sidebar({
  activePage,
  onPageChange,
  onNewChat,
  recentChats,
}) {
  const menuItems = [
    {
      id: "chat",
      icon: "💬",
      label: "Chat",
    },
    {
      id: "dashboard",
      icon: "▥",
      label: "Dashboard",
    },
    {
      id: "transactions",
      icon: "▤",
      label: "Transactions",
    },
    {
      id: "budget",
      icon: "◎",
      label: "Budget",
    },
    {
      id: "reports",
      icon: "◔",
      label: "Reports",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <span>●</span>
          <span className="brand-face">⌣</span>
        </div>

        <div>
          <h1>AI Finance</h1>
          <p>Your Personal Finance Agent</p>
        </div>
      </div>

      <button
        className="new-chat-button"
        onClick={onNewChat}
      >
        <span>＋</span>
        New Chat
      </button>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={
              activePage === item.id
                ? "sidebar-nav-item active"
                : "sidebar-nav-item"
            }
            onClick={() => onPageChange(item.id)}
          >
            <span className="sidebar-nav-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </button>
        ))}

        <button className="sidebar-nav-item">
          <span className="sidebar-nav-icon">⚙</span>
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-divider" />

      <div className="recent-section">
        <p className="recent-title">
          Recent Chats
        </p>

        <div className="recent-chat-list">
          {recentChats.length === 0 ? (
            <p className="recent-empty">
              Your conversations will appear here.
            </p>
          ) : (
            recentChats.slice(0, 5).map((chat, index) => (
              <button
                key={`${chat}-${index}`}
                className="recent-chat-item"
                onClick={() => onPageChange("chat")}
              >
                <span className="recent-chat-icon">
                  ▢
                </span>

                <span className="recent-chat-text">
                  <strong>{chat}</strong>
                  <small>
                    {index === 0
                      ? "Just now"
                      : "Earlier"}
                  </small>
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          U
        </div>

        <div className="user-information">
          <strong>Finance User</strong>
          <span>Personal account</span>
        </div>

        <span className="user-chevron">
         ⌄
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;