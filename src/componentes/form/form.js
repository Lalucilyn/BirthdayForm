import React from 'react';
import './form.css';
import FormError from '../error/error'

const Form = (props) =>  {
  return (
       <form method="post" onSubmit={props.submit}> 
        <div className="field">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
               name="name"
               maxlength="15"
               value={props.name}
               onChange={props.change}  
               placeholder="enter your name"/>
        </div>
        <div className="field">
          <label htmlFor="surname">Surname</label>
          <input type="text" 
               placeholder="Enter your surname"
               name="surname"
               maxlength="15"
               value={props.surname}
               onChange={props.change}/>
        </div>
        <div className="field">
          <label htmlFor="country">Country</label>
          <select 
                name="country"
                onChange={props.change}
                value={props.country}>
            <option>Select your country</option>
            {props.countries && props.countries.map((name, index)=>{
                return <option key={name}>{name}</option>
              })}
          </select>
          
        </div>
        <div className="field">
          <label htmlFor="birthday">Birthday</label>
          <input type="date" 
                   name="birthday"
                   max={props.max}
                   onChange={props.change}
                   value={props.birthday}/>
        </div>  
        <button>Save</button>
        {props.error && <FormError/>}
        </form>
    )

}
export default Form;
