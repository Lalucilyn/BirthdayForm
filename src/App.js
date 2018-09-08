import React, { Component } from 'react';
import Form from './componentes/form/form';
import Table from './componentes/table/table';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      	<header>
      		<h1>Intive-FDV Exercise</h1>
      	</header>
      	<Form/>
        <footer className="my-name">
        	<h4>Lucía Wainfeld</h4>
        </footer>
      </div>
    );
  }
}

export default App;
