import React from 'react';
import Container from '@material-ui/core/Container';

import ProTip from './ProTip';
import Copyright from './Copyright';
import TopBar from './TopBar';
import QuestionBar from './QuestionBar';
import Questions from './Questions';
import { userService } from './services/users.service';
import { configService } from './services/config.service';
import { Leaderboard } from './Leaderboard';
export const API_SVC = configService.API_URL;
console.log('API Endpoint =', API_SVC);

export const socket = new WebSocket('ws://' + API_SVC + '/ws');

socket.onopen = () => {
  userService.saveUsernameLocally();
  console.log('WS Successfully Connected');
};

export default function App() {
  return (
    <Container>
      <TopBar />
      <Leaderboard />
      <Questions />
      <QuestionBar />
      <ProTip />
      <Copyright />
    </Container>
  );
}
