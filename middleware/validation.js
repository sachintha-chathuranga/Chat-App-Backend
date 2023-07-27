
exports.validation = (req, res, next) =>{
    let errors
    if(req.body.fname==="" || req.body.lname==="" || req.body.email==="" || req.body.password===""){
        errors = 'All input feild are required!'
    }else if(req.body.fname.length < 3 || req.body.fname.length > 15){
        errors = 'First name must be greater than 3 character and less than 15 character!'
    }else if(req.body.lname.length < 3 || req.body.lname.length > 15){
        errors = 'Last name must be greater than 3 character and less than 15 character!'
    }
    else if(!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(req.body.password)){
        errors = 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    }else if(req.body.password.length < 8 || req.body.password.length > 12){
        errors = 'Password length should be between 8 and 12 character.'
    }
    errors ? res.status(402).json(errors) : next();
}

exports.updateValidation = (req, res, next) =>{
    let errors
    if(req.body.password && (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(req.body.password))){
        errors = 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    }else if(req.body.password && (req.body.password.length < 8 || req.body.password.length > 12)){
        errors = 'Password length should be between 8 and 12 character.';
    }else if(req.body.fname && (req.body.fname.length < 3 || req.body.fname.length > 15)){
        errors = 'First name must be greater than 3 character and less than 15 character!';
    }else if(req.body.lname && (req.body.lname.length < 3 || req.body.lname.length > 15)){
        errors = 'Last name must be greater than 3 character and less than 15 character!';
    }
    errors ? res.status(402).json(errors) : next();
}