const {validationResult} = require("express-validator")

const Validate = (req,res,next)=>{
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }

    //Array com os erros extraídos de errors
    const Erros = []

    //Enviar erros de erros para o array Erros acima
    errors.array().map((err) => Erros.push(err.msg))

    return res.status(422).json({
        errors: Erros
    })
}

module.exports = Validate