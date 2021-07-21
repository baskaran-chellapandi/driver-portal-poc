export interface User {
    email : string,
    password : string,
    firstName ?: string,
    lastName ?: string,
    gender ?: string,
    role ?: string
}

// export class User{
//     constructor(
//         public email : string,
//         public password : string,
//         public firstName ?: string,
//         public lastName ?: string,
//         public gender ?: string,
//         public role ?: string,
//     ){}
// }