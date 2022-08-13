import React from 'react';
import './App.css';
import Home from './components/Home';

class App extends React.Component {
  constructor(props: any){
    super(props);
   
  }


  public render() {
    return (
      <div>
        <Home any />
      </div>
    );
  }
}

export default App;
