import React, { Component } from 'react';
import './message.css';


const Message = (props) => {
    return (<div className="message">
        		<p>Hello {props.name} from {props.country} on {props.date} you will have {props.age} years</p>
      		</div>);
  	}

export default Message;
