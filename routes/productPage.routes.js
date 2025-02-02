const express = require("express");
const {ProductPageModel} = require("../models/productPageModel");

const productPageRouter = express.Router();

productPageRouter.post("/addone", async (req,res) => {
    const payload = req.body;

    try {
       const data = await new ProductPageModel(payload);
       data.save();
       res.status(200).send({"msg":"data has been added successfully"});
    } catch (error) {
       console.log(error);
       res.status(400).send({"msg":"Some error"});
    }   
});

productPageRouter.post("/addmany", async (req,res) => {
   const payload = req.body;

   try {
      const data = await  ProductPageModel.insertMany(payload);
      res.status(200).send({"msg":"data has been added successfully"});
   } catch (error) {
      console.log(error);
      res.status(400).send({"msg":"Some error"});
   }   
});

productPageRouter.get("/", async (req,res) => {
   const {page,limit,sort ,search } = req.query;
   const skip = (page - 1) * limit;

   let obj = {};
   
    console.log("This is query:-",req.query);
   for(let x in req.query){
      if(x !=="page" && x !=="limit" && x !== "sort" && x !== "search"){
        
         obj[x] = req.query[x];
         
      }
   }

   console.log(sort);

   let sorting = {};

   if(sort === "asc"){
      sorting =  {final_price: 1};
   }else if(sort === "desc"){
      sorting =  {final_price: -1};
   }

   if(search){
      obj["product_title"] = { $regex: search, $options: 'i' } ;
   }
   
   console.log(obj);

   try {
      const data = await  ProductPageModel.find(obj).skip(skip).limit(limit).sort(sorting)
      res.status(200).send(data);
   } catch (error) {
      console.log(error);
      res.status(400).send({"msg":"Some error"});
   }   
});

productPageRouter.get('/search', async (req, res) => {
   const searchTerm = req.query.q;
   const results = await ProductPageModel.find({ product_title: { $regex: searchTerm, $options: 'i' }});
   res.status(200).send(results);
 });


productPageRouter.get("/:id", async (req,res) => {

   const _id = req.params.id;
   const {page,limit } = req.query;
   const skip = (page - 1) * limit;

   let obj = {};

   for(let x in req.query){
      if(x !=="page" && x !=="limit"){
         obj[x] = req.query[x];
      }
   }
   obj["_id"]= _id
   console.log(obj);

   try {
      const data = await  ProductPageModel.find(obj).skip(skip).limit(limit);
      res.status(200).send(data);
   } catch (error) {
      console.log(error);
      res.status(400).send({"msg":"Some error"});
   }   
});


productPageRouter.patch("/update/:id", async (req,res) => {
  const id = req.params.id;
  const payload = req.body;

   try {
      await  ProductPageModel.findByIdAndUpdate(id,payload);
      res.status(200).send({"msg":"data has been updated successfully"});
   } catch (error) {
      console.log(error);
      res.status(400).send({"msg":"Some error"});
   }   
});

productPageRouter.delete("/delete/:id", async (req,res) => {
   const id = req.params.id;

    try {
       await  ProductPageModel.findByIdAndDelete(id);
       res.status(200).send({"msg":"data has been deleted successfully"});
    } catch (error) {
       console.log(error);
       res.status(400).send({"msg":"Some error"});
    }   
});

module.exports = {productPageRouter};