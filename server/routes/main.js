const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');


/**
    * GET 
    * HOME 
*/
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "IMPACS | Your automation hub",
            description: "simple"
        }

        let perPage = 2;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: { createdAt: -1} }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) +1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        
        res.render('index', { 
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
         });
    } catch (error) {
        console.log(error);
    }
});


// router.get('', async (req, res) => {
//     const locals = {
//         title: "NodeJS blog",
//         description: "simple"
//     }

//     try {
//         const data = await Post.find();
//         res.render('index', { locals, data });
//     } catch (error) {
//         console.log(error);
//     }
// });


/**
    * GET 
    * Post: id 
*/
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });
        const comments = await Comment.find({ postId: slug });

        const locals = {
            title: data.title,
            description: "simple"
        }

        res.render('post', { locals, data, comments, currentRoute: `/post/${slug}` });
    } catch (error) {
        console.log(error);
    }
});

/**
    * POST 
    * Post comment
*/
router.post('/comments/add', async (req, res) => {
    try {
        console.log(req.body);
      const { postId, name, comment, parentCommentId } = req.body;
      const isReply = parentCommentId ? true : false; // Sprawdź, czy nowy komentarz jest odpowiedzią
      const newComment = await Comment.create({ postId, name, comment: comment, parentCommentId, isReply });
      
      if (parentCommentId) {
        await Comment.findByIdAndUpdate(parentCommentId, { $push: { replies: newComment._id } });
      }

      res.redirect(`/post/${postId}`);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).send('Internal Server Error');
    }
  });

/**
    * POST
    * Post - seatchTerm
*/
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "simple"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")


        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]

        });





        res.render("search", {
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
});



router.get('/about', (req, res) => {
    res.render('about',{
    currentRoute: '/about'
    });
})


module.exports = router;


// function insertPostData () {
//     Post.insertMany([
//         {
//             title: "building a blog",
//             body: "body"
//         },
//         {
//             title: "building a blog2",
//             body: "body2"
//         },
//         {
//             title: "building a blog3",
//             body: "body3"
//         }

//     ])
// };
// insertPostData();