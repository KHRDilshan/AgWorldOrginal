const asyncHandler = require("express-async-handler");
const postsDao = require("../dao/publicForum-dao");

exports.getPosts = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
    const offset = (page - 1) * limit;

    // Fetch posts using DAO
    const posts = await postsDao.getPaginatedPosts(limit, offset);

    // Fetch the total number of posts using DAO
    const totalPosts = await postsDao.getTotalPostsCount();

    // Send the response
    res.status(200).json({
      total: totalPosts,
      posts,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getReplies = asyncHandler(async (req, res) => {
  try {
    const { chatId } = req.params; // Extract chatId from request parameters

    // Fetch replies using DAO
    const replies = await postsDao.getRepliesByChatId(chatId);

    // Send the response
    res.status(200).json(replies);
  } catch (err) {
    console.error("Error fetching replies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.createReply = asyncHandler(async (req, res) => {
  try {
    const { chatId, replyMessage } = req.body; // Extract reply data from request body
    const replyId = req.user.id;

    // Create reply using DAO
    const newReplyId = await postsDao.createReply(
      chatId,
      replyId,
      replyMessage
    );

    // Send the response
    res.status(201).json({ message: "Reply created", replyId: newReplyId });
  } catch (err) {
    console.error("Error creating reply:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.createPost = asyncHandler(async (req, res) => {
  try {
    const { heading, message } = req.body; // Extract post data from request body
    const userId = req.user.id;

    console.log("Heading:", heading);
    console.log("Message:", message);
    console.log("File received:", req.file); // Log file received

    let postimage = null;

    // Check if an image was uploaded
    if (req.file) {
      postimage = req.file.buffer; // Store image in buffer as binary data
    } else {
      console.log("No image uploaded");
    }

    // Create post using DAO
    const newPostId = await postsDao.createPost(
      userId,
      heading,
      message,
      postimage
    );

    // Send the response
    res.status(201).json({ message: "Post created", postId: newPostId });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
