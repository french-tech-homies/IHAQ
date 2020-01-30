import React, { useEffect, FC } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './store/store';
import { fetchMessages, likeMessage } from './store/messages';
import { getMessagesWithUser } from './store/authors/authors.selectors';
import { FavoriteBorder } from '@material-ui/icons';
import { socket } from './App';

// @ts-ignore
import { Rings as Identicon } from 'react-identicon-variety-pack';
import { Button, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper
    },
    inline: {
      display: 'inline'
    }
  })
);

export default function AlignItemsList() {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  // Messages is updated everytime the store is updated
  const messages = useSelector(getMessagesWithUser);
  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  socket.onmessage = function(evt) {
    // Dirty Hack around web socket
    console.log(evt);
    dispatch(fetchMessages());
  };

  return (
    <List className={classes.root}>
      {messages && messages.length > 0
        ? messages.map(item => (
            <ListItem alignItems="flex-start" key={item.message.id}>
              <ListItemAvatar>
                <Avatar alt={item.author.name}>
                  <Identicon seed={item.author.name} size={64} />
                </Avatar>
              </ListItemAvatar>
              <Grid container direction="column" alignItems="flex-start">
                <Grid item>
                  <ListItemText primary={item.message.text} />
                </Grid>
                <Grid item>
                  <MessageSubtext
                    authorName={item.author.name}
                    likes={item.message.likes}
                    onLike={() => dispatch(likeMessage(item.message.id))}
                  />
                </Grid>
              </Grid>
            </ListItem>
          ))
        : null}
    </List>
  );
}

interface MessageSubtextProps {
  likes: number;
  authorName: string;
  onLike: () => void;
}
const MessageSubtext: FC<MessageSubtextProps> = ({ authorName, likes, onLike }) => {
  return (
    <Grid container alignItems="center" justify="flex-start">
      <Grid item>
        <Typography variant="body2">- by {authorName}</Typography>
      </Grid>
      <Grid item>
        <Button variant="text" color="default" onClick={onLike} startIcon={<FavoriteBorder />}>
          {likes}
        </Button>
      </Grid>
    </Grid>
  );
};
