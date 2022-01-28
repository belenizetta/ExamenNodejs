const express = require('express');
const res = require('express/lib/response');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idUnico() {
  // function closure
  let id = 0;
  return function () {
    id = id + 1;
    return id;
  };
}

const newId = idUnico(); // instancio la closure

// TODO: your code to handle requests

server.post('/posts', (req,res) => {
  const {author,title,contents} = req.body;
  if (author && title && contents){
    const newPost = {
      id: newId(),
      author,
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"});
  }
});

server.post('/posts/author/:author', (req,res) =>{
  const {title , contents} = req.body;
  const author = req.params.author;
  if (author && contents && title){
    const newPost = {
      id: newId(),
      author,
      contents,
      title,
    };
    posts.push(newPost);
    return res.json(newPost);
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"})
  }

});

server.get('/posts/:author', (req, res) =>{
  const author = req.params.author;
  if(posts.find(item => item.author === author)){
    return res.json(posts.filter(item => item.author === author));
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"})
  }  
});


server.get('/posts/:author/:title', (res, req) => {
  const author = req.query.author;
  const title = req.query.title;
  if(posts.find(item => item.author === author && item.title === title)){
    return res.json(posts.filter(item => item.author === author && item.title === title));
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"})
  }   
});

server.put('/posts', (res,req) => {
  const {id,title,contents} = req.body;
  if(id && title && contents){
    posts.map(function(dato){
      if(dato.id === req.body.id){
        dato.title = req.body.title;
        dato.contents = req.body.contents;

        return dato;
      }else{
      res.status(STATUS_USER_ERROR).json({error: "Id no identificado"});
      }
    })
    
  }else {
    return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"})
  }

});


module.exports = { posts, server };
