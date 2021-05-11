import { nanoid } from 'nanoid';
import React, { Component } from 'react';

class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            message: "",
            userId: "",
            allMessages: [],
            id: 0
         }
    }

    handleSubmit = (evt) => {
        evt.preventDefault();
        this.state.message && this.sendNewMessage(this.state.message)   
    }

    sendNewMessage = (message) => {
        fetch(process.env.REACT_APP_CURRENCY_URL, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                    id: 0,
                    userId: this.state.userId,
                    content: message
            }),
          })
        this.setState({
            message: "",
        })  
    }

    windowScrolling = () => {
        const chatScroll = document.querySelector(".chat-messages");
        chatScroll.scrollTop = chatScroll.scrollHeight;
    }
    componentDidMount = () => {
        this._isMounted = true;
        localStorage.getItem("userId") ? localStorage.getItem("userId") : localStorage.setItem("userId", nanoid(36))
        this.setState({userId: localStorage.getItem("userId")})
        let url = process.env.REACT_APP_CURRENCY_URL + "?from=" + this.state.id;

        console.log(this.state.id)
        this.interval =  setInterval(() => {
            const gettingMessage = () => fetch(url, {})
                .then(response => response.json())
                .then(allMessages => {
                    this._isMounted && this.setState({
                        allMessages: allMessages,
                        id: allMessages.length > 0 ? allMessages[allMessages.length-1].id : 0
                    })
                });
            url = process.env.REACT_APP_CURRENCY_URL + "?from=" + this.state.id;
            gettingMessage()
            this.windowScrolling()
            console.log(url)
        },5000)

        this.timeout = setTimeout(() => {
            this.printing()
        }, 9000)
    }
    componentWillUnmount = () => {
        clearInterval(this.interval);
        clearInterval(this.timeout)
    }
    printing = () => {
        
        return this.state.allMessages.map(message => 
            <div
                key={message.id}
                className={`chat-one-message ${message.userId === this.state.userId ? 'chat-my-message' : 'chat-other-message'}`}
            >
                {message.content}
            </div>)
    }

    handleText = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }
    render() { 
        return ( 
            <div className="chat-container">
                <div className="chat-messages">{this.printing()}</div>               
                <form onSubmit={this.handleSubmit}>
                    <textarea name="message" value={this.state.message} onChange={this.handleText}/>
                    <button>&#10148;</button>
                </form>
            </div>
         );
    }
}
 
export default ChatWindow;