import React, { useState } from 'react';
import './profile.css';

const avatarOptions = [
  { id: 'avatar1', label: 'Avatar 1', src: '/avatar1.png' },
  { id: 'avatar2', label: 'Avatar 2', src: '/avatar2.png' },
];

export const Profile = () => {
  const [userData, setUserData] = useState({
    userId: 'usr_local_1',
    nickname: 'Anon Hacker',
    role: 'Admin',
    avatarUrl: '/avatar1.png',
  });

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [tempNickname, setTempNickname] = useState(userData.nickname);

  const handleOpenNameModal = () => {
    setTempNickname(userData.nickname);
    setIsNameModalOpen(true);
  };

  const handleSaveNickname = (event) => {
    event.preventDefault();
    if (!tempNickname.trim()) return;

    setUserData((prev) => ({
      ...prev,
      nickname: tempNickname.trim(),
    }));
    setIsNameModalOpen(false);
  };

  // Avatar Selection Handler
  const handleSelectAvatar = (chosenUrl) => {
    setUserData((prev) => ({
      ...prev,
      avatarUrl: chosenUrl,
    }));
    setIsAvatarModalOpen(false);
  };

  return (
    <div className="profileContainer">
      <div className="profileDetails">
        <div
          className="profileNickname"
          onClick={handleOpenNameModal}
          title="Click to change nickname"
        >
          <span>{userData.nickname}</span>
          <span className="editIconHint">✎</span>
        </div>
        <span className="profileRoleBadge">{userData.role}</span>
      </div>

      <div
        className="profileAvatarButton"
        onClick={() => setIsAvatarModalOpen(true)}
        title="Click to switch avatar"
      >
        <img
          className="profileAvatarImg"
          src={userData.avatarUrl}
          alt={userData.nickname}
          onError={(e) => {
            e.currentTarget.src = 'https://api.dicebear.com/7.x/identicon/svg?seed=' + userData.nickname;
          }}
        />
      </div>

      {isNameModalOpen && (
        <div className="modalOverlay" onClick={() => setIsNameModalOpen(false)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <span className="modalTitle">Change Nickname</span>
            <form onSubmit={handleSaveNickname} style={{ display: 'contents' }}>
              <input
                className="modalInput"
                type="text"
                autoFocus
                value={tempNickname}
                maxLength={20}
                onChange={(e) => setTempNickname(e.target.value)}
              />
              <div className="modalActions">
                <button
                  type="button"
                  className="modalBtn modalBtnSecondary"
                  onClick={() => setIsNameModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modalBtn modalBtnPrimary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAvatarModalOpen && (
        <div className="modalOverlay" onClick={() => setIsAvatarModalOpen(false)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <span className="modalTitle">Select Avatar</span>
            <div className="avatarSelectionGrid">
              {avatarOptions.map((item) => (
                <div
                  key={item.id}
                  className={`avatarOptionCard ${
                    userData.avatarUrl === item.src ? 'selectedOption' : ''
                  }`}
                  onClick={() => handleSelectAvatar(item.src)}
                >
                  <img
                    className="profileAvatarImg"
                    src={item.src}
                    alt={item.label}
                    onError={(e) => {
                      e.currentTarget.src = 'https://api.dicebear.com/7.x/identicon/svg?seed=' + item.id;
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="modalActions">
              <button
                type="button"
                className="modalBtn modalBtnSecondary"
                onClick={() => setIsAvatarModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;