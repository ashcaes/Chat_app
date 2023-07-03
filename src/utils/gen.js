const generatedAtMessage = (username,text)=>{
    return {
        username,
        text,
        createdAt:new Date().getTime()
    }
}

const genereatedLocMessage = (username,loc)=>{
    return {
        username,
        loc,
        createdAt:new Date().getTime()
    }
}

module.exports = {
    generatedAtMessage,
    genereatedLocMessage
}