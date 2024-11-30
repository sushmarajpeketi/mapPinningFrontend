//1.Import React and ReactDom libraries
import React from 'react';
import ReactDom from 'react-dom/client'
import App from './App'

//2.get a reference to the div with Id root
const el = document.getElementById('root');

//3.Tell react to take control of that element
const root = ReactDom.createRoot(el);

//4.create a component
// a component is function that return some jsx


//5.Show the component on the screen 
root.render(<App/>);