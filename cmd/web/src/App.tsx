import React from 'react';
import Container from '@material-ui/core/Container';

import ProTip from './ProTip';
import Copyright from './Copyright'
import TopBar from './TopBar'
import QuestionBar from './QuestionBar'
import Questions from './Questions'

export const socket = new WebSocket('ws://127.0.0.1:8080/ws');

socket.onopen = () => {
  console.log("WS Successfully Connected");
  socket.send("Hi From the Client!")
};

export default function App() {
  return (
    <Container>
        <TopBar />
        <Questions />
        <QuestionBar />
        <ProTip />
        <Copyright />
    </Container>
  );
}