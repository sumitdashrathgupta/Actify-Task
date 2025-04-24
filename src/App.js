import React from 'react';
import Table from './components/Table';
import Form from './components/Form';
// import './App.css';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">React Table Demo</h1>
      <Form />
      <Table />
    </div>
  );
}

export default App; 