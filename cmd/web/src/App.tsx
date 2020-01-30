import React, { useEffect } from 'react';
import Container from '@material-ui/core/Container';

import ProTip from './ProTip';
import Copyright from './Copyright';
import TopBar from './TopBar';
import QuestionBar from './QuestionBar';
import Questions from './Questions';
import { userService } from './services/users.service';
import { configService } from './services/config.service';
import { Leaderboard } from './Leaderboard';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store';
import { saveUser } from './store/user';
export const API_SVC = configService.API_URL;
console.log('API Endpoint =', API_SVC);

export const socket = new WebSocket('ws://' + API_SVC + '/ws');

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socket.onopen = () => {
      userService.saveUsernameLocally();
      const userId = userService.getUsername();
      console.log('WS Successfully Connected');
      if (userId) {
        dispatch(saveUser({ userId }));
      }
    };
  }, []);
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
