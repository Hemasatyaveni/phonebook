const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/phonebook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB successfully');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Phone Schema and Model
const phoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
});
const Phone = mongoose.model('Phone', phoneSchema);

// Routes

// Add a new phone entry
app.post('/add-phone', async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Validate input
    if (!name || !phone) {
      return res.status(400).send({ error: 'Name and phone are required' });
    }

    const newPhone = new Phone({ name, phone });
    const savedPhone = await newPhone.save();
    res.status(200).send(savedPhone);
  } catch (err) {
    console.error('Error saving phone:', err);
    res.status(500).send(err);
  }
});

// Get all phone entries
app.get('/get-phone', async (req, res) => {
  try {
    const phones = await Phone.find({});
    res.status(200).send({ data: { phoneNumbers: phones } });
  } catch (err) {
    console.error('Error fetching phones:', err);
    res.status(500).send(err);
  }
});

// Update a phone entry
app.put('/update-phone', async (req, res) => {
  try {
    const { id, name, phone } = req.body;

    // Validate input
    if (!id || !name || !phone) {
      return res.status(400).send({ error: 'ID, Name, and Phone are required' });
    }

    const updatedPhone = await Phone.findByIdAndUpdate(
      id,
      { name, phone },
      { new: true }
    );

    if (!updatedPhone) {
      return res.status(404).send({ error: 'Phone entry not found' });
    }

    res.status(200).send(updatedPhone);
  } catch (err) {
    console.error('Error updating phone:', err);
    res.status(500).send(err);
  }
});

// Delete a phone entry
app.delete('/delete-phone/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPhone = await Phone.findByIdAndRemove(id);

    if (!deletedPhone) {
      return res.status(404).send({ error: 'Phone entry not found' });
    }

    res.status(200).send(deletedPhone);
  } catch (err) {
    console.error('Error deleting phone:', err);
    res.status(500).send(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
