const yup = require('yup')

const validate =(schema) =>async (req,res,next)=>{
    try{
            await schema.validate({
                body: req.body,
                query:req.query,
                params:req.params
            });
        return next();
        }catch(err){
                return res
                .status(400)
                .json({type: err.errors})
        }
}

module.exports=validate;