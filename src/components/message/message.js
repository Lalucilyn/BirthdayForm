import React from 'react';
import './message.css';


const Message = (props) => {
  return (<div className="message">
        		{props.last ? 
        			<p>Hello {props.firstname} from {props.country} on {props.day} of {props.month} you will have {props.age} years</p>
        		:
        			<p>Hello! Please complete the form</p>
        		}
      		</div>);
}

export default Message;
