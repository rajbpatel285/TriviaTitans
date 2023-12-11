import React from 'react'
import styled from "styled-components"

function Leaderboard() {
    return (
        <>
            <StyledLeaderboardTitle className='leaderboard-title'>Leaderboard</StyledLeaderboardTitle>
            <StyledLeaderboardStats className='leaderboard-stats'>
                <iframe className='iframe' src="https://lookerstudio.google.com/embed/reporting/ea9582f1-e8db-434f-ae79-edcd76f5e55b/page/2BkWD"></iframe>
            </StyledLeaderboardStats>
        </>
    )
}

const StyledLeaderboardTitle = styled.div`
  display: flex;
  width: 100%;
  margin-top : 0% ;
  justify-content: center;
  font-size: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
`;

const StyledLeaderboardStats = styled.div`
  display: flex;
  width: 100%;
  .iframe {
    width: 100%;
    height: 100vh;
  }
`;

export default Leaderboard;