
exports.validation = (fname, lname, email, password) =>{
    if(fname==="" || lname==="" || email==="" || password===""){
        throw new Error('All input feild are required!');
    }else if(fname.length < 3 || fname.length > 15){
        throw new Error('First name must be greater than 3 character and less than 15 character!');
    }else if(lname.length < 3 || lname.length > 15){
        throw new Error('Last name must be greater than 3 character and less than 15 character!');
    }
    else if(!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)){
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
    }else if(password.length < 8 || password.length > 12){
        throw new Error('Password length should be between 8 and 12 character.');
    }
}

exports.anyValidation = (body) =>{
    if(body.password && (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(body.password))){
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
    }else if(body.password && (body.password.length < 8 || body.password.length > 12)){
        throw new Error('Password length should be between 8 and 12 character.');
    }else if(body.fname && (body.fname.length < 3 || body.fname.length > 15)){
        throw new Error('First name must be greater than 3 character and less than 15 character!');
    }else if(body.lname && (body.lname.length < 3 || body.lname.length > 15)){
        throw new Error('Last name must be greater than 3 character and less than 15 character!');
    }
}