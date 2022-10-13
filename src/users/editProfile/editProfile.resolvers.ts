import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import { createWriteStream } from "fs";
import { GraphQLUpload } from "graphql-upload";
import { Resolver } from "../../types";
import { uploadToS3 } from "../../shared/shared.utils";

const resolveFn: Resolver = async (
  _,
  { firstName, lastName, userName, email, password: newPassword, bio, avatar },
  { loginUser, client }
) => {
  let avatarUrl = null;
  if (avatar) {
    // AWS 파일 업로드
    avatarUrl = await uploadToS3(avatar, loginUser.id, "avatars");

    // Server에 파일 업로드
    // const { filename, createReadStream } = await avatar;
    // const newFileName = `${loginUser.id}-${Date.now()}-${filename}`;
    // const readStream = createReadStream();
    // const writeStream = createWriteStream(
    //   process.cwd() + "/uploads/" + newFileName
    // );

    // readStream.pipe(writeStream);
    // avatarUrl = `http://localhost:5000/static/${newFileName}`;
  }
  // 토근 검증
  // context에서 처리
  //const {id} = await jwt.verify(token, process.env.SECRET_KEY);
  let hashPwd = null;
  if (newPassword) {
    hashPwd = await bcrypt.hash(newPassword, 10);
  }

  const updateUser = await client.user.update({
    where: {
      id: loginUser.id,
    },
    data: {
      firstName,
      lastName,
      userName,
      email,
      bio,
      // 분기에 따른 옵션 처리 방법
      ...(hashPwd && { password: hashPwd }),
      ...(avatarUrl && { avatar: avatarUrl }),
    },
  });

  if (updateUser) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "Could not update password.",
    };
  }
};

const resovlers = {
  Upload: GraphQLUpload,
  Mutation: {
    editProfile: protectedResolver(resolveFn),
  },
};

export default resovlers;
