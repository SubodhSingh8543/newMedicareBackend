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

productPageRouter.get("/", async (req, res) => {
   const { page = 1, limit = 10, sort, search, discount_lower, discount_heigher } = req.query;
   const skip = (page - 1) * limit;
 
   let obj = {};
   for (let x in req.query) {
     if (
       x !== "page" &&
       x !== "limit" &&
       x !== "sort" &&
       x !== "search" &&
       x !== "discount_lower" &&
       x !== "discount_heigher" &&
       req.query[x] !== "null" &&
       req.query[x] !== "" &&
       req.query[x] !== undefined &&
       req.query[x] !== "undefined"
     ) {
       obj[x] = req.query[x];
     }
   }
 
   let sorting = { _id: 1 };
   if (sort === "asc") sorting = { final_price: 1 };
   else if (sort === "desc") sorting = { final_price: -1 };
 
   if (search) {
     obj["product_title"] = { $regex: search, $options: "i" };
   }
 
   try {
     let data = await ProductPageModel.find(obj).sort(sorting);
 
     // Node.js discount filtering
     const lower = Number(discount_lower);
     const higher = Number(discount_heigher);
 
     if (!isNaN(lower) || !isNaN(higher)) {
       data = data.filter(item => {
         const match = typeof item.discount === 'string' && item.discount.match(/([0-9]+)/);
         const disc = match ? parseInt(match[1]) : null;
         if (disc === null) return false;
         if (!isNaN(lower) && !isNaN(higher)) return disc >= lower && disc <= higher;
         if (!isNaN(lower)) return disc >= lower;
         if (!isNaN(higher)) return disc <= higher;
         return true;
       });
     }
 
     // Pagination
     data = data.slice(skip, skip + Number(limit));
 
     res.status(200).send(data);
   } catch (error) {
     console.error("Error in /productPage:", error);
     res.status(400).send({ msg: error.message, stack: error.stack });
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