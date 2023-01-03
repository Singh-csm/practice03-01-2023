const express = require("express");
const router = express.Router();
const authorController = require("../controller/authorController.js");
const blogController = require("../controller/blogController.js");

//<-------------This API used for Create Author---------------->//
router.post("/authors", authorController.createAuthor);
//<--------------------This API used for Create Blogs-------------->//
router.post("/blogs", blogController.createBlog);
//<----------------This API used for Fetch Blogs of Logged in Author----------->//
router.get("/blogs/:authorId", blogController.getBlogsData);
//<----------------This API used for Update Blogs of Logged in Author---------->//
router.put("/blogs/:blogId", blogController.updateBlog);
//<----------------These APIs used for Deleting Blogs--------->//
router.delete("/blogs/:blogId", blogController.deleteBlog);
//<----------------These APIs used for Deleting Blogs by query of Logged in Author--------->//
router.delete("/blogs", blogController.deleteQueryBlog);

module.exports = router;
