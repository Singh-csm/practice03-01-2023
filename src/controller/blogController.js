const blogModel = require("../models/blogModel");
const mongoose = require("mongoose");

//<--------------------This API used for Create Blogs-------------->//
const createBlog = async (req, res) => {
  try {
    let Blog = req.body;

    if (Object.keys(Blog).length == 0) {
      return res.status(400).send({
        status: false,
        msg: "Invalid request Please provide valid Author  details",
      });
    }

    if (!Blog.title)
      return res.status(400).send({ msg: " title is required " });
    if (!Blog.body) return res.status(400).send({ msg: "body is required " });
    if (!Blog.authorId)
      return res.status(400).send({ msg: " authorId is required " });
    if (!Blog.category)
      return res.status(400).send({ msg: " category is require" });

    let blogCreated = await blogModel.create(Blog);

    return res.status(201).send({ status: true, data: blogCreated });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

//<----------------This API used for Fetch Blogs of Logged in Author----------->//
const getBlogsData = async (req, res) => {
  try {
    let id = req.params.authorId; //
    if (!id)
      return res.status(400).send({ status: false, msg: "id is required" });

    let isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) return res.status(400).send({ msg: "enter valid objectID" });

    let data = await blogModel.find({ _id: id });

    if (Object.keys(data).length == 0) {
      return res.status(404).send({ status: false, msg: "No data Found" });
    }
    return res.status(200).send({ msg: data });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

//<----------------This API used for Update Blogs of Logged in Author---------->//

const updateBlog = async function (req, res) {
  try {
    let inputId = req.params.blogId;

    let author = req.body;

    let title = req.body.title;
    let body = req.body.body;
    let tags = req.body.tags;
    let category = req.body.category;
    let subcategory = req.body.subcategory;

    if (Object.keys(author).length == 0) {
      return res.status(400).send({
        status: false,
        msg: "Invalid request Please provide valid Author details",
      });
    }

    let date = Date.now();

    let blogs = await blogModel.findOneAndUpdate(
      { _id: inputId },
      {
        $set: {
          title: title,
          body: body,
          category: category,
          isPublished: true,
          publishedAt: date,
        },
        $push: { tags: tags, subcategory: subcategory },
      },
      { new: true }
    );

    if (!blogs) return res.status(404).send({ msg: "no blog found" });
    return res.status(200).send({ msg: blogs });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

//<----------------These APIs used for Deleting Blogs--------->//
const deleteBlog = async function (req, res) {
  try {
    let inputId = req.params.blogId;

    let date = Date.now();

    let data = await blogModel.findOneAndUpdate(
      { _id: inputId },
      { $set: { isDeleted: true, deletedAt: date } },
      { new: true }
    );

    if (!data) return res.status(404).send({ msg: "no data found" });

    return res
      .status(200)
      .send({ status: true, msg: " is successfully deleted" });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

//<----------------These APIs used for Deleting Blogs by query of Logged in Author--------->//

// let deleteQueryBlog = async function(req, res){
//   let data = req.query;
//   let date = Date.now();
//   let blogDelete = await blogModel.findOneAndDelete({...data},{isDeleted: true, deletedAt: date},{new:true});
//   res.status(200).send({status:true, msg: blogDelete})

// }

const deleteQueryBlog = async function (req, res) {
  try {
    const result = req.query;
    const deleteBlog = await blogModel.findOneAndUpdate(
      { ...result, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
    console.log(deleteBlog);
    if (!deleteBlog)
      return res.status(404).send({ status: false, msg: "docs not found" });
    res.status(200).send({ status: true, data: deleteBlog });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createBlog = createBlog;
module.exports.getBlogsData = getBlogsData;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteQueryBlog = deleteQueryBlog;
