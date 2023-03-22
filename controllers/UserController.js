const User = require("../models/User")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const jwtSecret = process.env.JWT_SECRET

//Generete token
const generateToken = (id) =>{
    return jwt.sign({id},jwtSecret,{
        expiresIn: "5d"
    })
}

const generateHash = async(password)=>{
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password, salt)
}

//Register user and sign in
const register = async(req,res)=>{
    const {name, email, password} = req.body

    const user = await User.findOne({email})

    if(user){
        res.status(422).json({errors: ["Esse email já está em uso."]})
        return
    }

    passwordHash = await generateHash(password)

    //Criar usuário
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })

    //Usuário criado com sucesso -> retornar token
    if(!newUser){
        res.status(422).json({errors: ["Houve um erro, tente novamente."]})
        return
    }
    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    })
}

//Login
const login = async(req,res)=>{
    const {email,password} = req.body

    const user = await User.findOne({email})
    
    //usuário existe?
    if(!user){
        res.status(404).json({errors: ["Usuário não encontrado."]})
        return
    }

    //Confirmação de senha
    if(!(await bcrypt.compare(password, user.password))){
        res.status(422).json({errors: ["Senha inválida"]})
        return
    }

    res.status(201).json({
        _id: user._id,
        token: generateToken(user._id)
    })
}

//Perfil de usuário - quem é o usuário logado?
const getCurrentUser = async(req,res)=>{
    const user = req.user
    res.status(200).json(user)
}

const update = async(req,res)=>{
    const {name,password} = req.body

    const reqUser = req.user
    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select("-password")
    
    if(name){
        user.name = name
    }

    if(password){
        passwordHash = await generateHash(password)

        user.password = passwordHash
    }

    await user.save()
    res.status(200).json(user)
}

const getUserById = async(req,res)=>{
    const {id} = req.params

    try{
        const user = await User.findById(new mongoose.Types.ObjectId(id)).select("-password")
        if(!user){
            res.status(404).json({errors: ["Usuário não encontrado"]})
            return
        }
        res.status(200).json(user)
    } catch(error) {
        res.status(404).json({errors:["Usuário informado é inválido"]})
        return
    }
}

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById
}