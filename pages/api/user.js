import { users } from '@/libs/appwrite/serverAppwrite';

export default async function handler(req, res) {
  const { body } = req;
  const { userId, bio, website, name } = body;

  const responseUpdateName = await users.updateName(userId, name);
  const responseUpdatePrefs = await users.updatePrefs(userId, { bio, website });

  try {
    res
      .status(200)
      .json({
        data: { ...responseUpdateName, prefs: { ...responseUpdatePrefs } },
      });
  } catch (error) {
    res.status(500).json({ error });
  }
}
