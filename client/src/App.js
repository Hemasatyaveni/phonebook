import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phonebook, setPhonebook] = useState([]);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    Axios.get('http://localhost:8080/get-phone')
      .then((res) => {
        setPhonebook(res.data.data.phoneNumbers);
      })
      .catch((error) => {
        console.error('Error fetching phonebook:', error);
      });
  }, []);

  const addNewNumber = () => {
    Axios.post('http://localhost:8080/add-phone', { name, phone })
      .then((res) => {
        setPhonebook([...phonebook, res.data]);
        setName('');
        setPhone('');
      })
      .catch((error) => {
        console.error('Error adding new number:', error);
      });
  };

  const startEditing = (id, currentName, currentPhone) => {
    setEditId(id);
    setEditName(currentName);
    setEditPhone(currentPhone);
  };

  const updatePhone = () => {
    Axios.put('http://localhost:8080/update-phone', { id: editId, name: editName, phone: editPhone })
      .then((res) => {
        setPhonebook(phonebook.map((val) => (val._id === editId ? res.data : val)));
        setEditName('');
        setEditPhone('');
        setEditId(null);
      })
      .catch((error) => {
        console.error('Error updating phone number:', error);
      });
  };

  const deletePhone = (id) => {
    Axios.delete(`http://localhost:8080/delete-phone/${id}`)
      .then((res) => {
        setPhonebook(phonebook.filter((val) => val._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting phone number:', error);
      });
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Add New Contact</h2>
        <label>Name: </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} /><br /><br />
        <label>Phone: </label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} /><br /><br />
        <button onClick={addNewNumber}>Add New Number</button>
      </div>

      <h1>PhoneBook List</h1>
      <div className="phonebook-list">
        {phonebook.map((val, key) => (
          val && val.name && val.phone && (
            <div key={key} className="phone-entry">
              <p>Name: {val.name}</p>
              <p>Phone Number: {val.phone}</p>
              {editId === val._id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    placeholder="Update Name..."
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Update Phone..."
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                  <button className="update-btn" onClick={updatePhone}>
                    Confirm Update
                  </button>
                </div>
              ) : (
                <div>
                  <button className="update-btn" onClick={() => startEditing(val._id, val.name, val.phone)}>
                    Update
                  </button>
                  <button className="delete-btn" onClick={() => deletePhone(val._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default App;
