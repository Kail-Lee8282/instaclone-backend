import * as jwt from "jsonwebtoken";
import client from "../client";
import { Context, Resolver } from "../types";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }

    // js
    // const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    // const user = await client.user.findUnique({ where: { id } });

    // if (user) {
    //   return user;
    // } else {
    //   return null;
    // }

    const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY);
    if ("id" in verifiedToken) {
      const user = await client.user.findUnique({
        where: { id: verifiedToken["id"] },
      });

      if (user) {
        return user;
      }
    }

    return null;
  } catch {
    return null;
  }
};

// export const  protectResolver = (user) =>{
//   if(!user){
//     throw new Error("You need to login.");
//   }
// };

// export const protectedResolver = (ourResolver) => (root, args, context, info) => {
//   if (!context.loginUser) {
//     return {
//       ok: false,
//       error: "Please login to perform this action",
//     };
//   }
//   return ourResolver(root, args, context, info);
// };

export function protectedResolver(ourResolver: Resolver) {
  return function (root: any, args: any, context: Context, info: any) {
    if (!context.loginUser) {
      const query = info.operation.operation === "query";
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "Please login to perform this action.",
        };
      }
      console.log(info);
    }
    return ourResolver(root, args, context, info);
  };
}
