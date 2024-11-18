import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../model/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import e from "express";


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async signup(user: User): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        const reqBody = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: hash
        }
        const newUser = new this.userModel(reqBody);
        return newUser.save();
        
        
    }

    async signin(user: User, jwt: JwtService): Promise<any> {
        const foundUser = await this.userModel.findOne({ email: user.email }).exec();
        if (foundUser) {
            const { password } = foundUser;
            if (bcrypt.compare(user.password, password)) {
                const login = { email: user.email };
                return {
                    token: jwt.sign(login),
                };
            }
            return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
        }
        return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
    }
    async getOne(email): Promise<User> {
        return await this.userModel.findOne({ email }).exec();
    }
}
export default UserService;

/**
 * UserService provides methods for user-related operations such as signup, signin, and fetching user details.
 * 
 * - signup(user: User): Creates a new user in the database.
 * - signin(user: User, jwtService: JwtService): Authenticates the user and generates a JWT token if the credentials are correct.
 * - getOne(email: string): Fetches a user by email from the database.
 * 
 * Dependencies:
 * - userModel: Mongoose model for interacting with the user collection in the database.
 * - bcrypt: Library for hashing and comparing passwords.
 * - jwt: Library for generating JWT tokens.
 */