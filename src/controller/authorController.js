const authorModel = require("../models/authorModel.js");
const jwt = require("jsonwebtoken");

//<-------------This API used for Create Authors---------------->//
const createAuthor = async function (req, res) {
    try {
        let author = req.body;
        let email = req.body.email;
        let password = req.body.password;
        if (Object.keys(author).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        } 
        let fname=req.body.fname;
        let lname=req.body.lname;
        //fname
        var validateFname = function (name) {
            var re = /[a-zA-Z]{3,}/;
            return re.test(name)
        };
        
        let CheckFname = validateFname(fname);
        let Checklname=validateFname(lname);
        if (CheckFname == false || Checklname==false) {
            return res.status(400).send({ status: false, msg: "name should be string" })}
        

    
        if (!author.fname) return res.status(400).send({ msg: " First name is required " });
        if (!author.lname) return res.status(400).send({ msg: " Last name is required " });
        if (!author.email) return res.status(400).send({ msg: " email is required " });
        if (!author.password) return res.status(400).send({ msg: " password is required " });


        //Email id Validation
        var validateEmail = function (email) {
            var re = /[a-zA-Z_1-90]{3,}@[A-za-z]{3,}[.]{1}[a-zA-Z]{2,}/;
            return re.test(email)
        };

        let Check = validateEmail(email);
        if (Check == false) {
           return res.status(400).send({ status: false, msg: "email is not valid" })
        }

        // Password Id Validation
        var validatepassword = function (password) {
            var re = /[A-Z]{1,}[a-z]{3,}[@#$%]{1,}[1-90]{1,}/;
            //Minimum 1 Upper add, Minimum 3 Lower Case,Mininum 1 special; Symbol like (@#$%),mininum 1 number 
            return re.test(password)
        };

        let Checkpassword = validatepassword(password);
        if (Checkpassword == false) {
          return  res.status(400).send({ status: false, msg: "Password is not valid" })
        }

        let titleEnum = ['Mr', 'Mrs', 'Miss']
        if (!titleEnum.includes(author.title)) {
           return res.status(400).send({ status: false, msg: "title should be Mr, Mrs or Miss" })
        }

        let authorCreated = await authorModel.create(author)


       return res.status(201).send({ data: authorCreated })
    } catch (error) {
       return res.status(500).send({ msg: error.message })
    }
}



const login = async(req, res)=>{
    let result =req.body;
    if(Object.keys(result).length == 0) return res.status(400).send({status:false});
    let {password, email} =result
    //let email= result.email;
    //let password =result.password;
    if(!password) return res.status(400).send({status:falswe,msg: "password is mandatory"});
    if(!email) return res.status(400).send({status:false, msg:"email ius mandatory"});
    
    let fAuthor = await authorModel.findOne({email: result.email, password: result.password});
    if(!fAuthor) return res.status(400).send({status:false, msg:"credentials does not matched"});
    
    let payload = {authoreId: fAuthor._id.toString(), emailID: fAuthor.email}
    let token = jwt.sign(payload, "blogGroup17");
    res.status(201).send({status:true, data: token});
    
    


module.exports.logiun = login;
module.exports.createAuthor = createAuthor;

