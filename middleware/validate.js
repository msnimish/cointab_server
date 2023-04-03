export const validate = (req,res,next) => {
    let pattern  = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    let {email, password} = req.body;

    if(email ==="" || password ===""){
        return res.status(401).send({message: "Please fill in your credentials"});
    }
    // if (!pattern.test(email)) {
    //     return res.status(401).send({message: "Invalid email format"});
    // }
    next()
}