import React, { Component } from 'react';
import Form from './componentes/form/form';
import Table from './componentes/table/table';
import Message from './componentes/message/message';
import './App.css';
//AGREGÁ APELLIDO A LA TABLA
class App extends Component {
  state = {
  records:[],
  countries:"",
  error:false,
  name:"",
  surname:"",
  country:"Select your country",
  birthday:"",
  last:""
  };

  componentDidMount() {
    //Get saved records from LocalStorage, if any
    let records = JSON.parse(localStorage.getItem('savedRecords'))
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
    })
    .catch(function(error){
      alert("no se pudo establecer la conexión con el servidor.")
    })
  }
  
  ///////////EVENT HANDLERS///////////////
  //Saves typed data to state
  handleUserInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value})
  }
  
  //Creates new record for list and also sets last record in state so the message can be displayed
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
      name:this.state.name,
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
    
    //Saves changes in state
    let age = this.getUserAge(this.state.birthday);
    this.setState({
    records:objectRecord.records,
    error:false,
    name:"",
    surname:"",
    country:"",
    birthday:"",
    last: 
       {name:currentRecord.name, 
        country:currentRecord.country, 
        birthday:currentRecord.birthDay, 
        age:age, 
        day:currentRecord.day, 
        month:currentRecord.month
      }
    });
  }
  
  //Retrieves previous record when clicked
  getOldUser = (e) => {
    let key = parseInt(e.target.parentNode.id, 10) //BUT WHY
    let records = this.state.records
    let myRecord = records.find(record => record.id===key)
    let myAge = this.getUserAge(myRecord.birthday)
    this.setState({"last": {"name":myRecord.name, "surname":myRecord.surname, "country":myRecord.country, age:myAge, month:myRecord.month, day:myRecord.day}})
  }
 
 //////AUXILIAR FUNCTIONS//////

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
 
 //Set current date as max attribute on birthday input
 setMaxDate = () => {
  const currentDate = this.getCurrentDate();
  const maxDate = currentDate.year+'-'+ currentDate.month+'-'+ currentDate.day;
  return maxDate;
 }

 //Get month's name for display
  getBirthdayMonth = (month) => {
  let ParsedMonth = parseInt(month,10) - 1
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  return months[ParsedMonth]
  }

  //Get user's age on their next birthday
  getUserAge = (birthday) => {
    const currentDate = this.getCurrentDate()
   //Get day, month and year from user's birthday
   const birthYear = birthday.slice(0,4);
   const birthMonth = birthday.slice(5,7);
   const birthDate = birthday.slice(8,10);
   let futureAge;
   //Compare current date with birthdate
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
    if(this.state.name===""||this.state.surname===""||this.state.country==="Select your country"){
      return true;
    }else{
      return false;
    }
  }

  render() {
    return (
      <div className="App">
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
            name={this.state.name}
            surname={this.state.surname}
            country={this.state.country}
            birthday={this.state.birthday}/>
         <Message 
            name={this.state.last.name} 
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

export default App;
