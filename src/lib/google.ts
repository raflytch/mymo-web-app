import { OAuth2Client } from "google-auth-library";
import { IGoogleUser } from "@/interfaces/user.interface";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

export async function verifyGoogleToken(token: string): Promise<IGoogleUser> {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid token");

    return {
      email: payload.email!,
      name: payload.name!,
      avatar: payload.picture,
      googleId: payload.sub,
    };
  } catch (error) {
    throw new Error("Invalid Google token");
  }
}

export function getGoogleAuthUrl(): string {
  return client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
  });
}
