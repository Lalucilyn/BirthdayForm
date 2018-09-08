import React from 'react';
import './table.css';

const Table = (props) => {
    return (
      <div>
        <table>
        	<thead>
        		<tr>
        			<th>Name</th>
        			<th>Country</th>
        			<th>Birthday</th>
        		</tr>
        	</thead>
        	<tbody>
        		{
        			props.records.map((key, value) => <tr id={key.id} key={key.id} onClick={props.retrieve}><td>{key.name}</td><td>{key.country}</td><td>{key.birthday}</td></tr>)
        		}
        	</tbody>

        </table>
      </div>
    );
  }

export default Table;
