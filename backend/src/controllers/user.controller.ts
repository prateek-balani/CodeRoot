import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { User } from "../model/user.schema";
import { UserService } from "../service/user.service";
import { JwtService } from '@nestjs/jwt'


@Controller('/api/v1/user')
export class UserController {
    constructor(private readonly userServerice: UserService,
        private jwtService: JwtService
    ) { }

@Post('/signup')
    async Signup(@Res() response, @Body() user: User) {
        const newUSer = await this.userServerice.signup(user);
        return response.status(HttpStatus.CREATED).json({
            newUSer
        })
    }
    @Post('/signin')
    async SignIn(@Res() response, @Body() user: User) {
        const token = await this.userServerice.signin(user, this.jwtService);
        return response.status(HttpStatus.OK).json(token)
    }
}
/**
 *  * UserController handles user-related HTTP requests.
 * 
 * - @Post('/signup'): Handles user signup requests. It calls the signup method of the UserService
 *   to create a new user and returns the created user in the response with a status of 201 (Created).
 * 
 * - @Post('/signin'): Handles user signin requests. It calls the signin method of the UserService
 *   to authenticate the user and generate a JWT token, which is returned in the response with a status of 200 (OK).
 * 
 * Dependencies:
 * - UserService: Provides methods for user signup and signin.
 * - JwtService: Used to generate JWT tokens for authenticated users.
 */
