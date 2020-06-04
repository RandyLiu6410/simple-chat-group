import React, {Component} from 'react';
import { w3cwebsocket as W3CWebSocket} from 'websocket';
import io from 'socket.io-client';
import { Card, Avatar, Input, Typography} from 'antd';
import 'antd/dist/antd.css';
import TextField from './Component/TextField';
import pic from './asset/img/IMG_8872.jpg';

const client = io('http://chat-group-ws-server.herokuapp.com');

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      isLoggedIn: false,
      messages: []
    }

    this.onButtonClicked = this.onButtonClicked.bind(this);
  }

  onButtonClicked = (value) => {
    client.emit('getMessage', JSON.stringify({
      type: "message",
      msg: value,
      user: this.state.userName
    }))
  }

  componentWillMount() {
    client.open = () => {
      console.log('WebSocket Client Connected');
    };

    client.on('getMessage', message => {
      const dataFromServer = JSON.parse(message)
      console.log(`got reply! `, dataFromServer);
      if(dataFromServer.type === 'message')
      {
        this.setState((state) => ({
          messages: [...state.messages,
          {
            msg: dataFromServer.msg,
            user: dataFromServer.user
          }]
        }))
      }
    })

    // keep new message on bottom
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if(this.messagesEnd)
    {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  }

  render() {
    return (
      <div className='main'>
        {
          this.state.isLoggedIn ? 
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }}>
              {this.state.messages.map(message => 
                <Card 
                  key={message.msg.text} 
                  style={{ width: 300, margin: '16px 4px 0 4px', alignSelf: this.state.userName === message.user ? 'flex-end' : 'flex-start' }} 
                  loading={false}
                  cover={message.msg.imgUrl != '' ? <img src={message.msg.imgUrl} /> : <div />}
                  >
                  <Meta
                    avatar={
                      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{message.user[0].toUpperCase()}</Avatar>
                    }
                    title={message.user}
                    description={message.msg.text}
                  />
                </Card>
              )}
              <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }} />
            </div>
            <div className='bottom'>
              <TextField onSearch={this.onButtonClicked}/>
            </div>
          </div>
          :
          <div style={{padding: '200px 40px'}}>
            <Search 
              placeholder="Enter username"
              enterButton="Login"
              size="large"
              onSearch={value => this.setState({
                isLoggedIn: true,
                userName: value
              })}
            />
          </div>
        }
      </div>
    )
  }
}
