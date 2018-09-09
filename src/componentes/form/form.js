import React, { Component } from 'react';
import './form.css';
import Message from '../message/message'
import Table from '../table/table'
import FormError from '../error/error'
//BUGS: 
//CHEQUEAR QUE NO SIGA PASANDO ESO DE QUE QUEDEN CAMPOS VACÍOS. NO DEBERÍA
//PONER LAS HELPER FUNCTIONS EN MÓDULO APARTE
//ORDENAR
//ACHICAR EL STATE
//REALMENTE CHEQUEÁ LA FUNCIÓN CUMPLEAÑOS

class Form extends Component {
 state = {
 	records:[],
 	countries:"",
 	error:false,
 	"name":"",
 	"surname":"",
 	"country":"Select your country",
 	"birthday":"",
 	"last":""
 };

 getErrors = () => {
  if(this.state.name===""||this.state.surname===""||this.state.country==="Select your country"){
    return true;
  }else{
    return false;
  }
 }

 componentDidMount() {
    //Get saved records from LocalStorage, if any
    let records = JSON.parse(localStorage.getItem('savedRecords'))
    console.log(records)
    records!==null && this.setState({records:records.records});
    
    //Get countries data from API
    fetch("https://restcountries.eu/rest/v2/all")
    .then((response) => {
      return response.json()	
    })
    .then((data) => {
      let countries = [];
      data.forEach((item)=>{countries.push(item.name)});
      this.setState({countries:countries, error:false})
      console.log(this.state)
    })
    .catch(function(error){
      this.setState({error:true})
    })
  }

  //Saves typed data to state
  handleUserInput = (event) => {
  	  const name = event.target.name;
      const value = event.target.value;
      this.setState({[name]: value})
  }
  
  //Creates new record for list and also sets last record in state so the message can be displayed
  handleUserSubmit = (event) => {
  	event.preventDefault();
  	if(this.getErrors()){
       this.setState({error:true})
      return;
    }
    event.target.reset()

  	let records = this.state.records;  	
    let currentRecord = {
  		id:records.length,
  		name:this.state.name,
  		surname:this.state.surname,
  		country:this.state.country,
  		birthday:this.state.birthday,
      day:parseInt(this.state.birthday.slice(8,10),10),
      month:this.getBirthdayMonth(this.state.birthday.slice(5,7))
  	}

  	records.push(currentRecord);
  	let objectRecord = {
  		"name":"savedData",
  		"records":records
  	}

  	let recordJSON = JSON.stringify(objectRecord)
  	localStorage.setItem('savedRecords', recordJSON);
    
    let age = this.getUserAge(this.state.birthday);
    this.setState({
  	records:objectRecord.records,
 		error:false,
 		"name":"",
 		"surname":"",
 		"country":"",
 		"birthday":"",
 		"last": {"name":currentRecord.name, 
             "country":currentRecord.country, 
             "birthday":currentRecord.birthDay, 
             "age":age, 
             "day":currentRecord.day, 
             "month":currentRecord.month
            },
  	});
  }
  
  //Get current date and returns day as DD, month as MM and year as YYYY
  getCurrentDate = () => {
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1; 
    let year = today.getFullYear();
    day<10 && (day='0'+ day)
    month<10 && (month ='0'+month)
    return {day:day, month:month, year:year}
  }

  //Get month's name
  getBirthdayMonth = (month) => {
  let monthString;
  switch(month){
    case "01":monthString="January";break;
    case "02":monthString="February";break;
    case "03":monthString="March"; break;
    case "04":monthString="April"; break;
    case "05":monthString="May"; break;
    case "06":monthString="June"; break;
    case "07":monthString="July"; break;
    case "08":monthString="August"; break;
    case "09":monthString="September"; break; 
    case "10":monthString="October"; break;
    case "11":monthString="November"; break;
    case "12":monthString="December"
  }
  return monthString;
  }

  //Pass today as max atribute in the birthday field
  setMaxDate = () => {
    const currentDate = this.getCurrentDate();
    const maxDate = currentDate.year+'-'+ currentDate.month+'-'+ currentDate.day;
    return maxDate;
  }

  //Get user's age on their next birthday
  getUserAge = (birthday) => {
    const currentDate = this.getCurrentDate()
  	//Get day, month and year from user's birthday
  	const birthYear = birthday.slice(0,4);
  	const birthMonth = birthday.slice(5,7);
  	const birthDate = birthday.slice(8,10);
  	
    let futureAge;
   	//Compare
    switch(true){
      case currentDate.month>birthMonth:
      case currentDate.month===birthMonth && currentDate.day>birthDate:
      futureAge = (currentDate.year - birthYear) + 1;
      break;
      case currentDate.month===birthMonth && currentDate.day===birthDate:
      futureAge = (currentDate.year - birthYear); console.log("happy birthday")
      break;
      default: futureAge = currentDate.year - birthYear;
     }
    /* 
  	if(currentDate.month>birthMonth){
  		console.log("entré en el 1°")
  		futureAge = (currentDate.year - birthYear) + 1
      console.log(currentDate.year)
    }else if(currentDate.month === birthMonth && currentDate.day === birthDate){
    	console.log("happy Birthday")
    	futureAge = currentDate.year - birthYear
    }else if(currentDate.month === birthMonth && currentDate.day<birthDate){
    	console.log("entre en el 3°")   
    	futureAge = currentDate.year - birthYear + 1;
    }else{
    	console.log("entré en el 4")
    	futureAge = currentDate.year - birthYear
    }*/
    return futureAge
  }

  getOldUser = (e) => {
  	let key = parseInt(e.target.parentNode.id, 10) //BUT WHY
  	let records = this.state.records
  	let myRecord = records.find(record => record.id===key)
  	let myAge = this.getUserAge(myRecord.birthday)
  	this.setState({"last": {"name":myRecord.name, "country":myRecord.country, age:myAge, month:myRecord.month, day:myRecord.day}})
  }

   render() {
    return (
    <div className="main-container">
    <div className="form-container">
      <form onSubmit={this.handleUserSubmit}>	
        <div className="field">
        	<label htmlFor="name">Name</label>
       		<input type="text" 
       			   name="name"
       			   value={this.state.name}
       			   onChange={this.handleUserInput}	
               placeholder="enter your name"/>
        </div>
        <div className="field">
        	<label htmlFor="surname">Surname</label>
        	<input type="text" 
               placeholder="Enter your surname"
        		   name="surname"
        		   value={this.state.surname}
        		   onChange={this.handleUserInput}/>
        </div>
        <div className="field">
        	<label htmlFor="country">Country</label>
        	<select 
                name="country"
                onChange={this.handleUserInput}
                value={this.state.country}>
        		<option>Select your country</option>
        		{this.state.countries && this.state.countries.map((name, index)=>{
        	    	return <option key={name}>{name}</option>
        	    })}
        	</select>
          
        </div>
        <div className="field">
        	<label htmlFor="birthday">Birthday</label>
        	<input type="date" 
                   name="birthday"
                   value={this.state.birthday}
                   max={this.setMaxDate()}
                   onChange={this.handleUserInput}/>
        </div>	
        <button>Save</button>
        {this.state.error && <FormError/>}
      	</form>
      	<Message name={this.state.last.name} country={this.state.last.country} day={this.state.last.day} month={this.state.last.month} age={this.state.last.age} last={this.state.last!==""}/>
      	</div>
      	<div className="results-container">
         	{this.state.records.length>0 && <Table records={this.state.records} retrieve={this.getOldUser}/>}
      	</div>
      </div>
    );
  }
}

export default Form;
