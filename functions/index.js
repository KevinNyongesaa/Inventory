const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();
const app = express();
const main = express();

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));
main.use("/api/v1", app);

// Create Inventory
app.post("/inventory", async (req, res) => {
  try {
    const {name, quantity} = req.body;

    if (!name || !quantity) {
      return res.status(400).json({error: "Name and quantity required"});
    }

    const inventoryRef = admin.firestore().collection("inventory");
    await inventoryRef.add({name, quantity});

    return res.status(201).json({message: "Inventory created successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Something went wrong"});
  }
});

// Update Inventory
app.put("/inventory/:id", async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const {name, quantity} = req.body;
    const inventoryRef = admin.firestore().collection("inventory")
        .doc(inventoryId);
    await inventoryRef.update({name, quantity});
    return res.status(200).json({message: "Inventory updated successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Something went wrong"});
  }
});

// Get Inventory
app.get("/inventory/:id", async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const inventoryRef = admin.firestore().collection("inventory")
        .doc(inventoryId);
    const snapshot = await inventoryRef.get();
    if (!snapshot.exists) {
      return res.status(404).json({error: "Inventory not found"});
    }
    const inventoryData = snapshot.data();
    return res.status(200).json(inventoryData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Something went wrong"});
  }
});

// Delete Inventory
app.delete("/inventory/:id", async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const inventoryRef = admin.firestore().collection("inventory")
        .doc(inventoryId);
    await inventoryRef.delete();
    return res.status(200).json({message: "Inventory deleted successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Something went wrong"});
  }
});

exports.api = functions.https.onRequest(main);
