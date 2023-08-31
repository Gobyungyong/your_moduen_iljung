import React from 'react';
import styled from 'styled-components';
import { LuX } from 'react-icons/lu';

const TeamListContainer = styled.div`
  /* border: 1px solid blue; */
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LinkModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 220px;
  width: 100%;
  max-width: 430px;
  background-color: #f9f3f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    text-align: center;
    font-size: 17px;
    font-weight: bold;
    margin: 20px 0 10px;
  }
`;
const CopyBtn = styled.button`
  width: 90px;
  padding: 10px 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 30px;
  background-color: #c1355a;
  box-shadow:
    -5px -5px 10px #f9f3f4,
    5px 5px 8px #babebc;
  color: rgb(253, 250, 250);
  font-weight: bold;
  cursor: pointer;
`;
const CloseBtn = styled.button`
  border: none;
  background-color: #f9f3f4;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;
const LinkBox = styled.div`
  text-align: center;
  padding: 15px;
  margin: 15px;
  max-width: 320px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  background-color: #fdf8f9;
  box-shadow:
    inset 7px 2px 10px #d6b5bf,
    inset -5px -5px 12px #fff;
  overflow: hidden;
`;

const TeamLinkModal = ({
  isOpen,
  teamId,
  setTeamId,
  handleCopyClick,
  redirectToCalendar,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <TeamListContainer>
      <LinkModal isOpen={!!teamId}>
        <h2>링크로 팀원 초대하기</h2>
        <LinkBox>{`http://localhost:3000/api/v1/teams/members/${btoa(
          teamId + '',
        )}/`}</LinkBox>
        <CopyBtn onClick={handleCopyClick}>링크 복사</CopyBtn>

        <CloseBtn
          onClick={() => {
            setTeamId(null);
            redirectToCalendar();
          }}
        >
          <LuX />
        </CloseBtn>
      </LinkModal>
    </TeamListContainer>
  );
};

export default TeamLinkModal;