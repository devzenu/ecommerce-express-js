// creating token and saving in cookie 


const sendToken =(user, statusCode,res)=>{
    const token = user.getJWTToken();
    // option for cookies 
    const options={
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly:true,

    }
    res.status(statusCode).cookie("token", token, options).json({
        succes:true, 
        user,
        token
    })
}

export default sendToken


























/* // jub hum token use kerty hn to sath mn status bhi dena perta kay ye successfull ha ya ni and 200,
//res.status(200).json({
  //  success: true,
    //token,
  //}) 201 jo bhi code wo dena hota 
// to issue ye ha jub jub hum token use kerty to itna lamba baki sub kuxh bhi likhna perta to is sub ko avoide kerny ky liy 
// hum 1 function bnain gy and wo token ky status  code wali jga py 1 line ka code dain gy */ 