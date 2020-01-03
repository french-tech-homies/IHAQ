import React, {useState, FormEvent} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

import axios from 'axios';

const API_URL = 'http://localhost:8080';


interface IQuestion {
    message: string;
    author: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function CustomizedInputBase() {
  const classes = useStyles();
  const initialState = {author:"Unknow", message:""}
  const [question, setQuestion] = useState<IQuestion>(initialState);

  const handleChange = (event: any) => {
    const theQuestion : IQuestion = {author:"Unknow", message:event.target.value}
    setQuestion(theQuestion)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Clicked")
    console.log("msg: ", question)
    const url = `${API_URL}/message`;
    axios.post(url, question).then(response => response.data)
    .then((data) => {
        console.log("Data posted: ", data)
        // const theQuestion : IQuestion = 
        setQuestion(initialState)
    })
  }


  return (
    <form onSubmit={handleSubmit}>
    <Paper className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Send Question"
        inputProps={{ 'aria-label': 'send question' }}
        onChange={handleChange}
        value={question?.message}
      />
      <IconButton className={classes.iconButton} aria-label="send" type="submit">
        <SendIcon />
      </IconButton>
    </Paper>
    </form>
  );
}
