import React, {useEffect,useState} from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';

interface IMessage {
    id: string;
    author:  string;
    message: string;
    likes: number;
}

const API_URL = 'http://localhost:8080';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
  }),
);

export default function AlignItemsList() {
  const classes = useStyles();

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const url = `${API_URL}/messages`;
    axios.get(url).then(response => response.data)
    .then((data) => {
        console.log("Data fetched: ", data)
        setMessages(data)
       })
    }, [])

  return (
    <List className={classes.root}>
        {messages && messages.length > 0 ? (
            messages.map(item => (
                <ListItem alignItems="flex-start" key={item.id}>
                <ListItemAvatar>
                  <Avatar alt={item.author} src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={item.message}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                      </Typography>
                      {" — by "+item.author}
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))) : (
                <React.Fragment></React.Fragment>
            )}
    </List>
  );
}