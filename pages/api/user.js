import { users } from '@/libs/appwrite/serverAppwrite';

export default async function handler(req, res) {
  const { body } = req;
  const { userId, ...prefs } = body;

  let responseUpdateName = {};
  if (prefs.name) {
    responseUpdateName = await users.updateName(userId, prefs.name);
  }
  const responseUpdatePrefs = await users.updatePrefs(userId, { ...prefs });

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
