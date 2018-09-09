import React, { Component } from 'react';
import './message.css';


const Message = (props) => {
    return (<div className="message">
        		{props.last ? 
        			<p>Hello {props.name} from {props.country} on {props.day} of {props.month} you will have {props.age} years</p>
        		:
        		<p>Hello! Please complete the form</p>
        		}
      		</div>);
  	}

export default Message;
