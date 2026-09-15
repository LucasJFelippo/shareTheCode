import React from 'react';
import './members.css';

const dummyMembers = [
  { userId: 'usr_1', nickname: 'Lucas', avatarUrl: '/avatar1.png' },
  { userId: 'usr_2', nickname: 'Alice', avatarUrl: '/avatar2.png' },
  { userId: 'usr_3', nickname: 'Bob_The_Builder', avatarUrl: '/avatar1.png' },
  { userId: 'usr_4', nickname: 'CyberNinja', avatarUrl: '/avatar2.png' },
  { userId: 'usr_5', nickname: 'Rustacean_99', avatarUrl: '/avatar1.png' },
  { userId: 'usr_6', nickname: 'EchoProtocol', avatarUrl: '/avatar2.png' },
  { userId: 'usr_7', nickname: 'KernelPanic', avatarUrl: '/avatar1.png' },
  { userId: 'usr_8', nickname: 'NullPointer', avatarUrl: '/avatar2.png' },
  { userId: 'usr_9', nickname: 'BytePusher', avatarUrl: '/avatar1.png' },
  { userId: 'usr_10', nickname: 'StackOverflow', avatarUrl: '/avatar2.png' },
];

export const Members = () => {
  return (
    <div className="membersWrapper">
      <div className="membersListContainer">
        {dummyMembers.map((member) => (
          <div key={member.userId} className="memberCard">
            <div className="memberIdentity">
              <img
                src={member.avatarUrl}
                alt={member.nickname}
                className="memberAvatar"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${member.userId}`;
                }}
              />
              <span className="memberNickname" title={member.nickname}>
                {member.nickname}
              </span>
            </div>
            <div className="memberActions">
              <button className="permBtn permBtnRead" title="Read permission">
                R
              </button>
              <button className="permBtn permBtnWrite" title="Write permission">
                W
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="membersReservedArea" />
    </div>
  );
};

export default Members;