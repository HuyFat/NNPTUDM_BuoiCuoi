const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// GET messages between 2 users
router.get("/:userID", async (req, res) => {
  try {
    const currentUser = req.user._id;
    const otherUser = req.params.userID;

    const messages = await Message.find({
      $or: [
        { from: currentUser, to: otherUser },
        { from: otherUser, to: currentUser }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST message
router.post("/:userID", async (req, res) => {
  try {
    const currentUser = req.user._id;
    const toUser = req.params.userID;
    const { text, file } = req.body;

    let messageContent = file
      ? { type: "file", text: file }
      : { type: "text", text: text };

    const message = await Message.create({
      from: currentUser,
      to: toUser,
      messageContent
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET last message of each conversation
router.get("/", async (req, res) => {
  try {
    const currentUser = req.user._id;

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ from: currentUser }, { to: currentUser }]
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: [
              { $eq: ["$from", currentUser] },
              "$to",
              "$from"
            ]
          }
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $first: "$$ROOT" }
        }
      }
    ]);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
