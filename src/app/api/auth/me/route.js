import { getLoggedUser } from "@/lib/auth";
import db from "@/lib/connectDb";
import User from "@/models/userModel";

export async function GET() {
  await db();
  const user = await getLoggedUser();
  return Response.json(user, { status: 200 });
}

export async function PUT(request) {
  await db();
  const user = await getLoggedUser();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { username, avatar, bio, basicInfo = {}, account = {} } = await request.json();
  if(username && username!==user.username){
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return Response.json({ message: "Username already taken" }, { status: 400 });
    }
    user.username = username;
  }
  if(avatar) user.avatar = avatar;
  if(bio) user.bio = bio;

  if(!user.basicInfo) user.basicInfo = {};
  if(basicInfo.name) user.basicInfo.name = basicInfo.name;
  if(basicInfo.gender) user.basicInfo.gender = basicInfo.gender;
  if(basicInfo.location){
    user.basicInfo.location = {
      ...user.basicInfo.location,
      ...basicInfo.location
    };
  }
  if(basicInfo.work){
    if(!Array.isArray(basicInfo.work)){
      return Response.json({ message: "Invalid work data" }, { status: 400 });
    }
    user.basicInfo.work = basicInfo.work;
  }
  if(basicInfo.education){
    if(!Array.isArray(basicInfo.education)){
      return Response.json({ message: "Education data must be an array" }, { status: 400 });
    }
    user.basicInfo.education = basicInfo.education;
  }
  if(basicInfo.birthday) user.basicInfo.birthday = new Date(basicInfo.birthday);
  if(!user.account) user.account = {};
  if(account.github) user.account.github = account.github;
  if(account.linkedin) user.account.linkedin = account.linkedin;
  if(account.leetcode) user.account.leetcode = account.leetcode;
  if(account.gmail) user.account.gmail = account.gmail;
  if(account.portfolio) user.account.portfolio = account.portfolio;
  await user.save();
  return Response.json(user, { status: 200 });
}
