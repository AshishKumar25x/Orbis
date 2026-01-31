import {SKILLS} from "@/lib/skills";
import db from "@/lib/connectDb";
import {getLoggedUser} from "@/lib/auth";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    if (!query) {
        return Response.json(SKILLS, { status: 200 });
    }
    const results = SKILLS.filter((skill) =>
        skill.toLowerCase().includes(query)
    );
    return Response.json(results, { status: 200 });
}

export async function PUT(request) {
    await db();
    const user = await getLoggedUser();
    if (!user) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { skill, action } = await request.json();
    if (!skill || !SKILLS.includes(skill)) {
        return Response.json({ message: "Invalid skill" }, { status: 400 });
    }
    if (action === "add") {
        if (!user.skills.includes(skill)) {
            user.skills.push(skill);
        }
    } else if (action === "remove") {
        user.skills = user.skills.filter((s) => s !== skill);
    }
    await user.save();
    return Response.json(user, { status: 200 });
}