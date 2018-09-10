import React, { Component } from 'react';
import Form from '../form/form';
import Table from '../table/table';
import Message from '../message/message';
import './main.css';

class Main extends Component {
  state = {
  records:[],
  countries:"",
  error:false,
  firstname:"",
  surname:"",
  country:"Select your country",
  birthday:"",
  last:""
  };

  componentDidMount() {
    //Gets saved records from LocalStorage, if there are any
    let records = JSON.parse(localStorage.getItem('savedRecords'));
    records!==null && this.setState({records:records.records});
    
    //Gets countries data from API
    fetch("https://restcountries.eu/rest/v2/all")
    .then((response) => {
      return response.json()  
    })
    .then((data) => {
      let countries = [];
      data.forEach((item)=>{countries.push(item.name)});
      this.setState({countries:countries, error:false});
    })
    .catch(function(error){
      alert("Sorry! We weren't able to load the countries. Please check your internet connection or try again later")
    })
  }
  
  ///////////EVENT HANDLERS///////////////
  //Saves data entered to the form to state
  handleUserInput = (event) => {
    const targetName = event.target.name;
    const value = event.target.value;
    this.setState({[targetName]: value})
  }
  
  /*Gets form data when the submit button is clicked. Creates a new record,
  saves it and also gets the data necessary to display the message*/
  handleUserSubmit = (event) => {
    event.preventDefault();
    //If it finds any errors, the form does not validate
    if(this.getErrors()){
      this.setState({error:true})
      return;
    }
    
    //Clears form fields
    event.target.reset()
    
    //Saves current form data
    let records = this.state.records;   
    let currentRecord = {
      id:records.length,
      firstname:this.state.firstname,
      surname:this.state.surname,
      country:this.state.country,
      birthday:this.state.birthday,
      day:parseInt(this.state.birthday.slice(8,10),10),
      month:this.getBirthdayMonth(this.state.birthday.slice(5,7))
    }
    records.push(currentRecord);
    
    //Save changes in LocalStorage
    let objectRecord = {
      "name":"savedData",
      "records":records
    }
    let recordJSON = JSON.stringify(objectRecord)
    localStorage.setItem('savedRecords', recordJSON);
    
    //Clears form data from state and saves last record for it to be displayed in the 
    //message
    let age = this.getUserAge(this.state.birthday);
    this.setState({
    records:objectRecord.records,
    error:false,
    firstname:"",
    surname:"",
    country:"",
    birthday:"",
    last: 
       {firstname:currentRecord.firstname, 
        country:currentRecord.country, 
        age:age, 
        day:currentRecord.day, 
        month:currentRecord.month}
    });
  }
  
  //Retrieves previous record when clicked
  getOldUser = (e) => {
    let key = parseInt(e.target.parentNode.id, 10) 
    let records = this.state.records
    let oldRecord = records.find(record => record.id===key)
    let myAge = this.getUserAge(oldRecord.birthday)
    this.setState({last: {
                   firstname:oldRecord.firstname, 
                   country:oldRecord.country, 
                   age:myAge, 
                   month:oldRecord.month, 
                   day:oldRecord.day}
                 })
  }
 
 //////AUXILIAR FUNCTIONS//////

 //Gets current date and returns it as an object
 getCurrentDate = () => {
  const today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1; 
  let year = today.getFullYear();
  day<10 && (day='0'+ day)
  month<10 && (month ='0'+month)
  return {day:day, month:month, year:year}
 }
 
 //Formats current date so it can be passed as max atribute in the birthday input
 setMaxDate = () => {
  const currentDate = this.getCurrentDate();
  const maxDate = currentDate.year+'-'+ currentDate.month+'-'+ currentDate.day;
  return maxDate;
 }

 //Gets month's name for it to be displayed on the message
  getBirthdayMonth = (month) => {
  let ParsedMonth = parseInt(month,10) - 1
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  return months[ParsedMonth]
  }

  //Gets user's age on their next birthday for it to be displayed on the message
  getUserAge = (birthday) => {
    const currentDate = this.getCurrentDate()
   //Gets day, month and year from user's birthday
   const birthYear = birthday.slice(0,4);
   const birthMonth = birthday.slice(5,7);
   const birthDate = birthday.slice(8,10);
   let futureAge;
   //Compares current date with birthdate
   switch(true){
    case currentDate.month>birthMonth:
    case currentDate.month===birthMonth && currentDate.day>=birthDate:
    futureAge = (currentDate.year - birthYear) + 1;
    break;
    default: futureAge = currentDate.year - birthYear;
   }
   return futureAge
  }
  
  //Checks for empty inputs to validate form
  getErrors = () => {
    if(this.state.firstname===""||this.state.surname===""||this.state.country==="Select your country"){
      return true;
    }else{
      return false;
    }
  }

  //////RENDER/////
  render() {
    return (
      <div className="Container">
      	<header>
      		<h1>Intive-FDV Exercise</h1>
      	</header>
        <div className="main-container">
      	 <div className="form-container">
          <Form 
            change={this.handleUserInput} 
            submit={this.handleUserSubmit} 
            countries={this.state.countries}
            error={this.state.error}
            max={this.setMaxDate()}
            firstname={this.state.firstname}
            surname={this.state.surname}
            country={this.state.country}
            birthday={this.state.birthday}/>
         <Message 
            firstname={this.state.last.firstname} 
            country={this.state.last.country} 
            day={this.state.last.day} 
            month={this.state.last.month} 
            age={this.state.last.age} 
            last={this.state.last}/>
         </div>
         <div className="results-container">
          {this.state.records.length>0 
           ? 
           <Table records={this.state.records} retrieve={this.getOldUser}/>
           :
           <p className="empty">Your saved data will be displayed here</p>}         
         </div>
        </div>
        <footer className="my-name">
        	<h4>Lucía Wainfeld</h4>
        </footer>
      </div>
    );
  }
}

export default Main;
