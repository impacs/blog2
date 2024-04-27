const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


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

// Dodawanie nowego posta
router.post('/post', async (req, res) => {
    try {
      const newPost = new Post(req.body);
      await newPost.save();
      res.status(201).send(newPost);
    } catch (error) {
      res.status(400).send(error);
    }
  });

// Dodawanie komentarza do posta
router.post('/post/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { username, comment } = req.body;
  try {
    const post = await Post.findById(postId);
    post.comments.push({ username, comment });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

  // Dodawanie odpowiedzi do komentarza
router.post('/post/:postId/comments/:commentId/replies', async (req, res) => {
  const { postId, commentId } = req.params;
  const { name, reply } = req.body;
  try {
    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);
    comment.replies.push({ name, reply });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

  // Wyświetlanie postów z komentarzami i odpowiedziami
router.get('/post/:postId', async (req, res) => {
    try {
      const locals = {
        title: "post"
      }
        let slug = req.params.postId;

      const data = await Post.findById({ _id: slug });
      res.render('post', { locals, data, currentRoute: `/post/${slug}` });
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
    * POST
    * Post - searchTerm
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