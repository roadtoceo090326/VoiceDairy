import express from 'express'

const PORT = 5000
const server = express()

server.get('/',async (req,res)=>{
    res.json({
        sucess:"true",
        message:"Hello Dairy!"
    })
})

server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})