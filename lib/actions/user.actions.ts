"use server";

import User from "../models/user.model"
import { connectToDB } from "@/lib/mongoose"
import clearCache from "./cache";
import { UserType } from "../types/types";
import { generateLongPassword } from "../utils";

type CreateUserParams = {
    username: string, 
    email: string,
    password: string
}

export async function createUser({ username, email, password }: CreateUserParams) {
    try {
        const newUser = await User.create({
            username,
            email,
            password,
            selfCreated: false
        })

        clearCache("createUser")

        return newUser
    } catch (error: any) {
        throw new Error(`Error creating new user: ${error.message}`)
    }
}

export async function createuserByMyself(params: { name: string, email: string, surname?: string, phoneNumber?: string }): Promise<UserType>;
export async function createuserByMyself(params: { name: string, email: string, surname?: string, phoneNumber?: string }, type: 'json'): Promise<string>;

export async function createuserByMyself(params: { name: string, email: string, surname?: string, phoneNumber?: string }, type?: 'json') {
   try {
    const newUser = await User.create({
        name: params.name,
        email: params.email,
        password: generateLongPassword(),
        surname: params.surname || "",
        phoneNumber: params.phoneNumber || "",
        selfCreated: true
    })

    console.log(newUser)
    clearCache("createUser")

    if(type === 'json'){
      return JSON.stringify(newUser)
    } else {
      return newUser
    }

   } catch (error: any) {
     throw new Error(`${error.message}`)
   }
}

export async function populateSelfCreatedUser(params: CreateUserParams): Promise<UserType>;
export async function populateSelfCreatedUser(params: CreateUserParams, type: 'json'): Promise<string>;

export async function populateSelfCreatedUser(params: CreateUserParams, type?: 'json') {
   try {

    const existingUser = await User.findOneAndUpdate(
        { email: params.email },
        { $set: { username: params.username, password: params.password, selfCreated: false } },
        { new: true, runValidators: true }
    ).select("-password");

    clearCache("createUser")
    if(type === 'json'){
      return JSON.stringify(existingUser)
    } else {
      return existingUser
    }
   } catch (error: any) {
     throw new Error(`${error.message}`)
   }
}
type FetchUserByEmailparams = {
   email: string
}

export async function fetchUserByEmail(params: FetchUserByEmailparams): Promise<UserType>;
export async function fetchUserByEmail(params: FetchUserByEmailparams, type: 'json'): Promise<string>;

export async function fetchUserByEmail(params: FetchUserByEmailparams, type?: 'json') {
   try {
        connectToDB()
        const currentUser = await User.findOne({ email: params.email}).select("-password")

    if(type === 'json'){
      return JSON.stringify(currentUser)
    } else {
      return currentUser
    }
   } catch (error: any) {
     throw new Error(`${error.message}`)
   }
}

export async function checkForAdmin(email: string){
    try {
        connectToDB();

        const currentUser = await User.findOne({ email: email });

        if(currentUser.isAdmin){
            return true
        } else return false
    } catch (error: any) {
        throw new Error(`Error determining, whether the user is admin ${error.message}`)
    }
}

export async function fetchUserById(userId: string) {
    try {
        connectToDB()

        const currentUser = User.findById(userId);

        return currentUser;
    } catch (error: any) {
        throw new Error(`Error fetching user by id, ${error.message}`)
    }
}

export async function fetchUsers(type?: "json") {
    try {
        connectToDB();

        const users = await User.find().select("_id email username orders");

        const fetchedUsers = [];

        for(const user of users) {
            fetchedUsers.push({ _id: user._id, email: user.email, username: user.username, orders: user.orders.length })
        }
        
        return fetchedUsers;
    } catch (error: any) {
        throw new Error(`Error fetching users: ${error.message}`)
    }
}