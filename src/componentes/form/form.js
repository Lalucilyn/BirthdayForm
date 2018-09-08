import React, { Component } from 'react';
import './form.css';
import Message from '../message/message'
import Table from '../table/table'
//BUGS: 
//CHEQUEAR QUE NO SIGA PASANDO ESO DE QUE QUEDEN CAMPOS VACÍOS. NO DEBERÍA
//PONER LAS HELPER FUNCTIONS EN MÓDULO APARTE
//ORDENAR
//ACHICAR EL STATE
//LA FECHA DEL MENSAJE AHORA ESTÁ HARCODEADA, PONELA BIEN
//REALMENTE CHEQUEÁ LA FUNCIÓN CUMPLEAÑOS
class Form extends Component {
 state = {
 	records:JSON.parse(localStorage.getItem('savedRecords')) || {'name':'savedRecords', 'records':[]},
 	countries:"",
 	error:"",
 	"name":"",
 	"surname":"",
 	"country":"",
 	"birthday":"",
 	"submitted":"",
 	"last":{}
 };

 //Retrieves the countries for the select field
 componentDidMount() {
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

  handleUserInput = (event) => {
  	  const name = event.target.name;
      const value = event.target.value;
      this.setState({[name]: value})
      console.log(this.state)
  }

  handleUserSubmit = (event) => {
  	event.preventDefault();
  	event.target.reset()
  	let records = this.state.records.records;
  	let currentRecord = {
  		id:records.length,
  		name:this.state.name,
  		surname:this.state.surname,
  		country:this.state.country,
  		birthday:this.state.birthday
  	}
  	records.push(currentRecord);
  	let objectRecord = {
  		"name":"savedData",
  		"records":records
  	}
  	let recordJSON = JSON.stringify(objectRecord)
  	console.log(recordJSON)
  	localStorage.setItem('savedRecords', recordJSON);

    let age = this.getUserAge(this.state.birthday)
  	this.setState({
  		records:objectRecord,
 		error:"",
 		"name":"",
 		"surname":"",
 		"country":"",
 		"birthday":"",
 		"last": {"name":currentRecord.name, "country":currentRecord.country, age:age},
 		submitted:true
  	});
  }

  //Pass today as max atribute in the birthday field
  getCurrentDate = () => {
	const today = new Date();
	let day = today.getDate();
	let month = today.getMonth() + 1; 
	let year = today.getFullYear();
	day<10 && (day='0'+ day)
	month<10 && (month ='0'+month)
	const currentDate = year+'-'+month+'-'+day;
    return currentDate;
  }

  //Get user's age on their next birthday
  getUserAge = (birthday) => {
  	//Get day, month and year from user's birthday
  	const birthYear = birthday.slice(0,4);
  	const birthMonth = birthday.slice(5,7);
  	const birthDate = birthday.slice(8,10);

  	//Get day, month and year from current date
  	const currentDate = new Date()
  	const currentYear = currentDate.getFullYear();
  	let currentMonth = currentDate.getMonth() + 1;
  	currentMonth<10 && (currentMonth = '0'+ currentMonth);
  	let currentDay = currentDate.getDate()
    currentDay<10 && (currentDay= '0'+ currentDay);
    let futureAge;
  	
  	//Compare
  	if(currentMonth>birthMonth){
  		console.log("entré en el 1°")
  		futureAge = (currentYear - birthYear) + 1
    }else if(currentMonth === birthMonth && currentDay === birthDate){
    	console.log("happy Birthday")
    	futureAge = currentYear - birthYear
    }else if(currentMonth === birthMonth && currentDate<birthDate){
    	console.log("entre en el 3°")   
    	futureAge = currentYear - birthYear
    }else{
    	console.log("entré en el 4")
    	futureAge = currentYear - birthYear
    }
    return futureAge
  }

  getOldUser = (e) => {
  	let key = e.target.parentNode.id //BUT WHY
  	let records = this.state.records.records

  	let myRecord = records.find((record) => {return record.id==key})
  	let myAge = this.getUserAge(myRecord.birthday)
  	this.setState({"last": {"name":myRecord.name, "country":myRecord.country, age:myAge}, "submitted":true})
    console.log(this.state)
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
               placeholder="enter your name"
       			   required/>
        </div>
        <div className="field">
        	<label htmlFor="surname">Surname</label>
        	<input type="text" 
               placeholder="Enter your surname"
        		   name="surname"
        		   value={this.state.surname}
        		   onChange={this.handleUserInput}		
        		   required/>
        </div>
        <div className="field">
        	<label htmlFor="country">Country</label>
        	<select 
                name="country"
                onChange={this.handleUserInput}
                value={this.state.country}
                required>
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
                   max={this.getCurrentDate()}
                   onChange={this.handleUserInput} 
        	       required/>
        </div>	
        <button>Save</button>
      	</form>
      	{this.state.submitted && <Message name={this.state.last.name} country={this.state.last.country} date="10 of september" age={this.state.last.age}/>}
      	</div>
      	<div className="results-container">
         	<Table records={this.state.records.records} retrieve={this.getOldUser}/>
      	</div>
      </div>
    );
  }
}

export default Form;
